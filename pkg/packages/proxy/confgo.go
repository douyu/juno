package proxy

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/douyu/jupiter/pkg/conf"
	"io/ioutil"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/douyu/juno/pkg/model/db"

	"github.com/douyu/juno/pkg/packages/proxy/invoker"
	"go.etcd.io/etcd/clientv3"
)

type confgo struct{}

type configData struct {
	Content  string   `json:"content"`
	Metadata metadata `json:"metadata"`
}

type metadata struct {
	Timestamp int64  `json:"timestamp"`
	Version   string `json:"version"`
	Format    string `json:"format"`
	Path      string `json:"path"`
}

func (c *confgo) GetData(appName string, typeId int, param string) (resp interface{}, err error) {
	fmt.Println("GetData", "appName", appName, "typeId", typeId, "param", param)

	switch typeId {
	case 0:
		return c.GetConfigStatus(appName, param)
	case 1:
		return c.GetAgentList()
	}
	return nil, errors.New("not exist")
}

type Nodes struct {
	IP   string `json:"ip"`
	Port string `json:"port"`
}

func (c *confgo) GetBatchUsingInfo(caid int, appName *db.CmcAppView, agents []db.AppNodeAgentView) (list []db.CmcUseStatus, err error) {
	if len(agents) > 370 || len(agents) <= 0 {
		err = errors.New("ip port param error, over size 370, too many")
		return
	}
	list = make([]db.CmcUseStatus, 0)
	var wg sync.WaitGroup
	wg.Add(len(agents))
	for _, agent := range agents {
		go func(agent db.AppNodeAgentView) {
			data, err := c.GetUsingInfo(caid, appName, agent)
			if err != nil {
				fmt.Println("GetBatchUsingInfo", "error", err.Error())
			} else {
				list = append(list, data)
			}
			wg.Done()
		}(agent)
	}
	wg.Wait()
	fmt.Println("GetBatchSupervisorInfo", "appName", appName, "agents", agents, "list", list)
	return
}

type PMTShell struct {
	Pmt     string `json:"pmt"` // systemd supervisor
	AppName string `json:"app_name"`
	Op      int    `json:"op"` // 0 start 1 stop 2 restart
}

func (c *confgo) AppRestart(ip string, port int, appName, pmt string) (res db.CmcUseStatus, err error) {
	client := http.Client{
		Timeout: time.Second * 1,
	}
	body := struct {
		Pmt     string `json:"pmt"` // systemd supervisor
		AppName string `json:"app_name"`
		Op      int    `json:"op"` // 0 start 1 stop 2 restart
	}{
		Pmt:     pmt,
		AppName: appName,
		Op:      2,
	}
	bodyBuf, _ := json.Marshal(body)

	resp, err := client.Post(fmt.Sprintf("http://%s:%d/api/agent/process/shell", ip, port), "application/json; charset=utf-8", strings.NewReader(string(bodyBuf)))
	if err != nil {
		return
	}
	if resp.StatusCode != http.StatusOK {
		err = fmt.Errorf("request error")
		return
	}
	buf, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return
	}
	configRespData := new(struct {
		Code int `json:"code"`
		Data struct {
			Supervisor bool `json:"supervisor"`
			Systemd    bool `json:"systemd"`
		} `json:"data"`
		Msg string `json:"msg"`
	})
	if err = json.Unmarshal(buf, configRespData); err != nil {
		return
	}
	if configRespData.Data.Supervisor {
		res.UseTyp = "supervisor"
		res.IsUse = 1
	}

	if configRespData.Data.Systemd {
		res.UseTyp = "systemd"
		res.IsUse = 1
	}
	return
}

func (c *confgo) GetUsingInfo(caid int, app *db.CmcAppView, agent db.AppNodeAgentView) (res db.CmcUseStatus, err error) {
	client := http.Client{
		Timeout: time.Second * 1,
	}

	filePath := strings.Join([]string{conf.GetString("confgo.dir"), app.AppName, "config", app.FileName}, "/")

	body := struct {
		Config string `json:"config"`
	}{
		Config: filePath,
	}
	bodyBuf, _ := json.Marshal(body)
	resp, err := client.Post(fmt.Sprintf("http://%s/api/v1/conf/command_line/status", agent.IpPort), "application/json; charset=utf-8", strings.NewReader(string(bodyBuf)))
	if err != nil {
		return
	}
	if resp.StatusCode != http.StatusOK {
		err = fmt.Errorf("request error")
		return
	}
	buf, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return
	}
	configRespData := new(struct {
		Code int `json:"code"`
		Data struct {
			Supervisor bool `json:"supervisor"`
			Systemd    bool `json:"systemd"`
		} `json:"data"`
		Msg string `json:"msg"`
	})
	if err = json.Unmarshal(buf, configRespData); err != nil {
		return
	}
	res = db.CmcUseStatus{
		Caid:     caid,
		Aid:      int32(app.Aid),
		AppName:  app.AppName,
		Hostname: agent.HostName,
		Env:      app.Env,
		Content:  filePath,
	}

	if configRespData.Data.Supervisor {
		res.UseTyp = "supervisor"
		res.IsUse = 1
	}

	if configRespData.Data.Systemd {
		res.UseTyp = "systemd"
		res.IsUse = 1
	}
	return
}

type CmcAgent struct {
	Id         int    `json:"id" gorm:"column:id"`
	Ip         string `json:"ip" gorm:"column:ip"`
	Port       string `json:"port" gorm:"column:port"`
	Hostname   string `json:"hostname" gorm:"column:hostname"`
	Env        string `json:"env" gorm:"column:env"`
	UpdateTime int64  `json:"update_time" gorm:"column:update_time"`
	Extra      string `json:"extra"`
}

// Back to agent heartbeat information
func (c *confgo) GetAgentList() ([]CmcAgent, error) {
	list := make([]CmcAgent, 0)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*3)
	resp, err := invoker.ConfgoEtcd.Get(ctx, fmt.Sprintf("/%s/callback", conf.GetString("confgo.prefix")), clientv3.WithPrefix())
	cancel()
	if err != nil {
		return list, err
	}
	now := time.Now().Unix()

	for _, kvs := range resp.Kvs {
		key, _ := string(kvs.Key), string(kvs.Value)
		keys := strings.Split(key, "/")
		if len(keys) != 4 {
			fmt.Println("scan agent key error:", key)
			continue
		}
		env, hostname := keys[2], keys[3]
		data := new(struct {
			IP      string `json:"ip"`
			Port    int    `json:"port"`
			Version string `json:"version"`
		})
		_ = json.Unmarshal(kvs.Value, data)
		list = append(list, CmcAgent{
			Ip:         data.IP,
			Port:       fmt.Sprintf("%d", data.Port),
			Hostname:   hostname,
			Env:        env,
			UpdateTime: now,
			Extra:      data.Version,
		})
	}
	return list, nil
}

func (c *confgo) GetConfigStatus(appName, fileName string) (list []db.ConfigStatus, err error) {
	list = make([]db.ConfigStatus, 0)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*3)
	key := fmt.Sprintf("/%s/callback/%s/%s", conf.GetString("confgo.prefix"), appName, fileName)

	resp, err := invoker.ConfgoEtcd.Get(ctx, key, clientv3.WithPrefix())

	cancel()
	if err != nil {
		return
	}
	if len(resp.Kvs) == 0 {
		err = fmt.Errorf("UsingStatus err etcd kvs len is 0")
		return
	}
	for _, item := range resp.Kvs {
		status := db.ConfigStatus{}
		if err := json.Unmarshal(item.Value, &status); err != nil {
			continue
		}
		status.EffectMD5 = c.getEffectMD5(fmt.Sprintf("http://%s:%s/debug/config", status.IP, status.HealthPort))
		list = append(list, status)
	}

	fmt.Println("GetConfigStatusEnd", "list", list, "key", key)

	return
}

func (c *confgo) getEffectMD5(url string) (res string) {
	client := http.Client{
		Timeout: time.Duration(time.Second * 3),
	}

	resp, err := client.Get(url)
	if err != nil {
		fmt.Println("checkEffectMD5", "httpGet", err.Error())
		return
	}

	defer func() {
		_ = resp.Body.Close()
	}()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("checkEffectMD5", "ioutilReadAll", err.Error())
		return
	}

	var d struct {
		JunoAgentDate int64  `json:"juno_agent_date"`
		JunoAgentMD5  string `json:"juno_agent_md5"`
	}
	err = json.Unmarshal(body, &d)
	if err != nil {
		fmt.Println("checkEffectMD5", "jsonUnmarshal", err.Error())
		return
	}
	return d.JunoAgentMD5
}

// PutConfigV2 Post configuration to etcd
func (c *confgo) PutConfigV2(appName, port, env, fileName, format, val string, instanceList []string, enableGlobal bool, md5 string) (commonVal string, err error) {
	// Inject global configuration
	var globalVal string
	if enableGlobal {
		globalVal, err = getGlobalConfig()
		if err != nil {
			fmt.Println("getGlobalConfig error", "err", err.Error())
		} else {
			val = mergeGlobalConfig(globalVal, val)
		}
	}

	data := configData{
		Content: val,
		Metadata: metadata{
			Timestamp: time.Now().Unix(),
			Format:    format,
			Version:   md5,
			Path:      strings.Join([]string{conf.GetString("confgo.dir"), appName, "config", fileName}, "/"),
		},
	}
	buf, err := json.Marshal(data)
	if err != nil {
		return "", fmt.Errorf("PutConfigV2 json parse error " + err.Error())
	}
	for _, hostName := range instanceList {

		key := fmt.Sprintf("/%s/%s/%s/%s/static/%s/%s", conf.GetString("confgo.prefix"), hostName, appName, env, fileName, port)

		// The migration is complete, only write independent ETCD of the configuration center
		confuCtx, cancel := context.WithTimeout(context.Background(), time.Second*3)
		_, err = invoker.ConfgoEtcd.Put(confuCtx, key, string(buf))
		cancel()
		if err != nil {
			fmt.Println("PutConfigV2 confu etcd put error ", "msg", err.Error())
			return
		}
	}

	// To deliver the application's cluster configuration, you need to ensure that the configuration file names are consistent
	clusterKey := fmt.Sprintf("/%s/cluster/%s/%s/static/%s", conf.GetString("confgo.prefix"), appName, env, fileName)
	confuCtx, cancel := context.WithTimeout(context.Background(), time.Second*3)
	_, err = invoker.ConfgoEtcd.Put(confuCtx, clusterKey, string(buf))
	cancel()
	if err != nil {
		fmt.Println("PutConfigV2 confu etcd put cluster error ", "msg", err.Error())
		err = fmt.Errorf("put cluster error:%s", err.Error())
		return
	}
	if enableGlobal {
		return globalVal, nil
	}
	return "", nil
}

// Only the toml file type is currently supported
func getGlobalConfig() (value string, err error) {
	key := "/global-config"
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*3)
	resp, err := invoker.ConfgoEtcd.Get(ctx, key)
	cancel()
	if err != nil {
		return
	}
	if len(resp.Kvs) == 0 {
		err = fmt.Errorf("no data")
		return
	}
	globalConfigData := configData{}
	buf := resp.Kvs[0].Value
	if err = json.Unmarshal(buf, &globalConfigData); err != nil {
		return
	}
	value = globalConfigData.Content
	return
}

func mergeGlobalConfig(globalVal string, val string) string {
	return fmt.Sprintf("%s\n%s\n", val, globalVal)
}
