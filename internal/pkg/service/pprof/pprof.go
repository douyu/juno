package pprof

import (
	"crypto/md5"
	"encoding/hex"
	"errors"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"strconv"
	"time"

	"github.com/douyu/juno/internal/pkg/service/grpcgovern"
	"github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/conf"
	"github.com/douyu/jupiter/pkg/store/gorm"
	"github.com/go-resty/resty/v2"
)

type pprof struct {
	PProfTypeList []string
	*resty.Client
	*gorm.DB
}

var Pprof *pprof

func InitPprof(gormDB *gorm.DB) *pprof {
	Pprof = &pprof{
		PProfTypeList: []string{
			"profile",
			"heap",
			"goroutine",
			"block",
		},
		Client: resty.New().SetDebug(false).SetTimeout(120*time.Second).SetHeader("X-JUNO-GOVERN", "juno"),
		DB:     gormDB,
	}
	return Pprof
}

const tempFilePath = "/tmp"

func (p *pprof) RunPprof(env, zoneCode, appName, hostName string) error {
	// 检测 Golang环境，如果没有退出返回错误
	if res, err := CheckShell(cfg.Cfg.Pprof.Path + "/pprof/checkGo.sh"); err != nil {
		fmt.Println("checkGo err", res)
		return fmt.Errorf("checkGo err:%v", err)
	}

	// 检测 Graphviz环境，如果没有自动安装
	if res, err := CheckShell(cfg.Cfg.Pprof.Path + "/pprof/graphviz.sh"); err != nil {
		fmt.Println("CheckGraphviz err", res)
		return fmt.Errorf("CheckGraphviz install err:%v", err)
	}

	// 1. 拿到应用的治理端口和ip
	appInfo, err := resource.Resource.GetApp(appName)
	if err != nil {
		return err
	}

	appNode, err := resource.Resource.GetAppNode(db.AppNode{
		AppName:  appName,
		Env:      env,
		ZoneCode: zoneCode,
		HostName: hostName,
	})
	if err != nil {
		return err
	}

	var (
		governPort = appInfo.GovernPort
		ip         = appNode.IP
		fileList   = make([]db.PProfFileInfo, 0)
	)

	// 2. 根据pprofTypeList 分别访问对应机器的执行结果  proxy
	for _, fileType := range p.PProfTypeList {

		resp := make([]byte, 0)
		// 没走代理
		if conf.GetString("proxy.mode") == "local" {
			resp, err = p.GetPprof(ip, governPort, fileType)
			if err != nil {
				fmt.Println("####  PostPprof err", err)
				continue
			}
		} else {
			resp, err = grpcgovern.IGrpcGovern.Pprof(env, zoneCode, ip, governPort, fileType)
			if err != nil {
				fmt.Println("####  IGrpcGovern err", err)
				continue
			}
		}
		//fmt.Println("fileType", fileType, "res", string(resp))

		// 3. 请求结果存入临时文件

		saveFileName := "/tmp/" + fileType + "_" + hostName + ".bin"
		saveSvgName := fmt.Sprintf("assets/pprof_static/%s_%s_%s.svg", time.Now().Format("2006_01_02_15_04_05"), hostName, fileType)
		if err = ioutil.WriteFile(saveFileName, resp, os.ModePerm); err != nil {
			fmt.Println("err2", err)
			continue
		}

		// 4. 将临时文件生成对应的pprof 图

		execRs := RunCmd(fmt.Sprintf("pprof/pprof.sh %s %s", saveFileName, saveSvgName))
		fmt.Printf("execShell result\n----\n%v---\n", execRs)

		if !FileExists(saveSvgName) {
			//log.Error("pprof.Run", "err", "Pprof util.FileExists false", "saveFileName", saveFileName, "resp", resp, "fileType", fileType)
			continue
		}

		// 5. 图存储

		fmt.Printf("saveFileName = %v, saveSvgName = %v\n", saveFileName, saveSvgName)

		item := db.PProfFileInfo{
			Url:      saveSvgName,
			FileType: fileType,
		}
		fileList = append(fileList, item)

		// 6. 火焰图存储 block无火焰图输出
		saveSvgNameHy := saveSvgName + "_hy.svg"
		fmt.Println("saveSvgNameHy------>", saveSvgNameHy)

		if FileExists(saveSvgNameHy) && fileType != "block" {
			item := db.PProfFileInfo{
				Url:      saveSvgNameHy,
				FileType: fileType + "_hy",
			}
			fileList = append(fileList, item)

		}

		// 6. 清理掉临时文件
		if err = os.Remove(saveFileName); err != nil {
			//log.Error("pprof.Run", "err", "Pprof Remove saveFileName error: "+err.Error(), "saveFileName", saveFileName)
		}

	}

	if len(fileList) <= 0 {
		//log.Error("pprof.Run", "err", "fileList error: app can not get pprof file", "appName", appName, "idcCode", idcCode, "hostName", hostName, "ip", ip, "appInfo", appInfo)
		return errors.New("app can not get pprof file")
	}

	// 7. 数据落库
	//生成场景ID
	sceneId := ShortHash(strconv.FormatInt(time.Now().Unix(), 10), 1)
	for _, item := range fileList {
		err := p.savePProf2DB(env, zoneCode, appName, appInfo.Aid, hostName, sceneId, item.FileType, item.Url, "svg")
		if err != nil {
			//log.Error("pprof.Run", "err", "Pprof savePProf2DB error: "+err.Error(), appName, "idcCode", idcCode, "hostName", hostName, "item", item)
			return err
		}
	}

	return nil
}

func RunCmd(cmdStr string) string {
	//envs := make([]string, 0)
	//envs = append(envs, fmt.Sprintf("PATH=%s:%s", os.Getenv("PATH"), "/tmp/"))
	//envs = append(envs, fmt.Sprintf("GOPATH=%s", "/tmp"))
	//envs = append(envs, "GOCACHE=/tmp")

	command := exec.Command("/bin/bash", "-c", cmdStr) //初始化Cmd
	//command.Env = envs

	//SetCmdEnv(command)
	resp, err := command.CombinedOutput()
	if err != nil {
		return "run err " + err.Error() + " " + string(resp)
	}
	return string(resp)
}

func CheckShell(cmdStr string) (string, error) {
	command := exec.Command("/bin/bash", "-c", cmdStr) //初始化Cmd

	resp, err := command.CombinedOutput()
	if err != nil {
		return string(resp), err
	}
	return string(resp), nil
}

// FileExists reports whether the named file or directory exists.
func FileExists(name string) bool {
	if _, err := os.Stat(name); err != nil {
		if os.IsNotExist(err) {
			return false
		}
	}
	return true
}

func (g *pprof) GetPprof(ip, port, pprofType string) (resp []byte, err error) {

	url := fmt.Sprintf("http://%s:%s/debug/pprof", ip, port)
	if _, err = g.CheckPprof(url); err != nil {
		return
	}
	// 耗时比较久
	if pprofType == "profile" {
		pprofType = pprofType + "?seconds=15"
	}
	url = url + "/" + pprofType
	if resp, err = g.CheckPprof(url); err != nil {
		return
	}
	return
}

func (g *pprof) CheckPprof(url string) (resp []byte, err error) {
	output, err := g.Client.R().Get(url)
	if err != nil {
		return
	}
	stream := output.Body()
	return stream, nil
	/*	profResp := ProfResp{}
		if err = json.Unmarshal(stream, &profResp); err != nil {
			return resp, nil
			//return resp, fmt.Errorf("json Unmarshal error: %v", err)
		}
		if profResp.Code != 0 {
			return resp, fmt.Errorf("msg=%v,data=%v", profResp.Msg, profResp.Data)
		}
		return []byte(profResp.Data), nil*/
}

// 存储pprof
func (p *pprof) savePProf2DB(env, zoneCode, appName string, aid int, hostName string, sceneId string, fileType, fileInfo string, ext string) (err error) {
	pprofDB := db.PProf{
		Env:        env,
		Type:       fileType,
		SceneId:    sceneId,
		AppName:    appName,
		Aid:        aid,
		FileInfo:   fileInfo,
		ZoneCode:   zoneCode,
		Ext:        ext,
		Remark:     "",
		HostName:   hostName,
		CreateTime: time.Now().Unix(),
		UpdateTime: time.Now().Unix(),
	}
	if err := p.DB.Create(&pprofDB).Error; err != nil {
		return err
	}
	return
}

// 查询已经存储的pprof v2
func (p *pprof) List(env, zoneCode, appName, hostName string) (resp []db.PProf, err error) {
	dbConn := p.DB.Table("pprof")
	if appName != "" {
		dbConn = dbConn.Where("app_name = ? ", appName)
	}
	if zoneCode != "" {
		dbConn = dbConn.Where("zone_code = ? ", zoneCode)
	}
	if env != "" {
		dbConn = dbConn.Where("env = ? ", env)
	}
	if hostName != "" {
		dbConn = dbConn.Where("host_name = ? ", hostName)
	}
	if err = dbConn.Order("create_time desc").Find(&resp).Error; err != nil {
		return
	}
	return
}

// 查询每个scene下的具体数据
func (p *pprof) ListByScene(env, zoneCode, appName, sceneId string) (fileList []db.PProf, err error) {
	dbConn := p.DB.Table("pprof")
	if appName != "" {
		dbConn = dbConn.Where("app_name = ? ", appName)
	}
	if zoneCode != "" {
		dbConn = dbConn.Where("zone_code = ? ", zoneCode)
	}
	if env != "" {
		dbConn = dbConn.Where("env = ? ", env)
	}
	if sceneId != "" {
		dbConn = dbConn.Where("scene_id = ? ", sceneId)
	}
	dbConn.Find(&fileList)
	return
}

type ProfResp struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
	Data string `json:"data"`
}

// 生成短hash
func ShortHash(longstr string, number int) string {
	baseVal := 0x3FFFFFFF
	indexVal := 0x0000003D
	charset := []byte("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")

	if number < 1 || number > 4 {
		number = 1
	}
	key := "juno666"
	urlhash := Md5(key + longstr)
	len := len(urlhash)

	var hexcc int64
	var short_url []byte
	var result [4]string

	for i := 0; i < 4; i++ {
		urlhash_piece := Substr(urlhash, i*len/4, len/4)
		hexDec, _ := strconv.ParseInt(urlhash_piece, 16, 64)
		hexcc = hexDec & int64(baseVal)

		var index int64
		short_url = []byte{}
		for j := 0; j < 6; j++ {
			//将得到的值与0x0000003d,3d为61，即charset的坐标最大值
			index = hexcc & int64(indexVal)
			short_url = append(short_url, charset[index])
			//循环完以后将hex右移5位
			hexcc = hexcc >> 5
		}
		result[i] = string(short_url)
	}

	return result[number]

}

// 字符串截取
func Substr(str string, start int, length int) string {
	rs := []rune(str)
	rl := len(rs)
	end := 0

	if start < 0 {
		start = rl - 1 + start
	}
	end = start + length

	if start > end {
		start, end = end, start
	}

	if start < 0 {
		start = 0
	}
	if start > rl {
		start = rl
	}
	if end < 0 {
		end = 0
	}
	if end > rl {
		end = rl
	}
	return string(rs[start:end])
}

// md5
func Md5(s string) string {
	h := md5.New()
	h.Write([]byte(s))
	return hex.EncodeToString(h.Sum(nil))
}
