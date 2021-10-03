package pprof

import (
	"context"
	"errors"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"path"
	"strconv"
	"time"

	"github.com/douyu/juno/internal/pkg/service/app"

	"github.com/douyu/juno/internal/pkg/service/clientproxy"
	"github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/juno/pkg/util"
	"github.com/douyu/jupiter/pkg/store/gorm"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/go-resty/resty/v2"
	torchPprof "github.com/uber-archive/go-torch/pprof"
	"github.com/uber-archive/go-torch/renderer"
	"go.uber.org/zap"
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
		Client: resty.New().SetDebug(cfg.Cfg.Pprof.Debug).SetTimeout(cfg.Cfg.Pprof.Timeout).SetHeader(cfg.Cfg.Pprof.TokenHeader, cfg.Cfg.Pprof.Token),
		DB:     gormDB,
	}
	return Pprof
}

func (p *pprof) RunPprof(ctx context.Context, req *view.ReqRunProfile) (err error) {
	// 1 check go version
	if _, err = exec.Command("go", "version").Output(); err != nil {
		return fmt.Errorf("There was an error running 'go version' command: %s", err)
	}

	// 2 check dot -v, graphiz
	if _, err = exec.Command("dot", "-v").Output(); err != nil {
		return fmt.Errorf("There was an error running 'dot -v' command: %s", err)
	}

	// 3 get app ip and govern port
	appInfo, err := resource.Resource.GetApp(req.AppName)
	if err != nil {
		return err
	}

	ip, err := p.getIp(db.AppNode{
		AppName:  req.AppName,
		Env:      req.Env,
		ZoneCode: req.ZoneCode,
		HostName: req.HostName,
	})
	if err != nil {
		return err
	}
	if ip == "" {
		return errors.New("无法查询到应用对应节点上的IP数据")
	}
	var (
		governPort = app.GovernPort(appInfo.GovernPort, req.Env, req.ZoneCode, req.AppName, req.HostName)
		fileList   = make([]db.PProfFileInfo, 0)
	)
	if governPort == "" || governPort == "0" {
		return errors.New("治理端口为空")
	}
	// 4 range pprof type list, get the pprof info
	for _, fileType := range p.PProfTypeList {
		var resp []byte
		resp, err = p.getPprof(view.UniqZone{Env: req.Env, Zone: req.ZoneCode}, ip, governPort, fileType, req.DurationSecond)
		if err != nil {
			xlog.Error("PostPprof err", zap.Error(err), zap.String("fileType", fileType))
			continue
		}
		xlog.Debug("get remote pprof success", zap.String("fileType", fileType))

		// 3. 请求结果存入临时文件
		saveFileName := path.Join(cfg.Cfg.Pprof.TmpPath, fileType+"_"+req.HostName+".bin")

		monthPath := time.Now().Format("2006_01_02")
		storePath := path.Join(cfg.Cfg.Pprof.StorePath, monthPath)
		err = util.CreatePath(storePath)
		if err != nil {
			xlog.Error("create store path error", zap.Error(err), zap.String("storePath", storePath))
			continue
		}
		saveSvgName := path.Join(storePath, fmt.Sprintf("%s_%s_%s.svg", time.Now().Format("2006_01_02_15_04_05"), req.HostName, fileType))
		if err = ioutil.WriteFile(saveFileName, resp, os.ModePerm); err != nil {
			xlog.Error("save tmp file error", zap.Error(err), zap.String("saveSvgName", saveSvgName))
			continue
		}

		// 4. 将临时文件生成对应的pprof 图
		err := getFlameGraph(saveFileName, saveSvgName)
		if err != nil {
			xlog.Error("get flame grapht err", zap.Error(err), zap.String("saveFileName", saveFileName), zap.String("saveSvgName", saveSvgName))
		}

		if !util.IsExist(saveSvgName) {
			xlog.Error("pprof.Run", zap.String("err", "Pprof util.FileExists false"), zap.String("saveFileName", saveFileName), zap.Any("resp", resp), zap.String("fileType", fileType))
			continue
		}

		// 5. 图存储
		xlog.Debug("store file", zap.String("saveFileName", saveFileName), zap.String("saveSvgName", saveSvgName))

		item := db.PProfFileInfo{
			Url:      saveSvgName,
			FileType: fileType,
		}
		fileList = append(fileList, item)

		// 6. 火焰图存储 block无火焰图输出
		saveSvgNameHy := saveSvgName + "_hy.svg"

		if util.IsExist(saveSvgNameHy) && fileType != "block" {
			item := db.PProfFileInfo{
				Url:      saveSvgNameHy,
				FileType: fileType + "_hy",
			}
			fileList = append(fileList, item)

		}

		// 6. 清理掉临时文件
		if err = os.Remove(saveFileName); err != nil {
			xlog.Error("pprof.Run", zap.Error(err), zap.String("saveFileName", saveFileName))
		}
	}

	if len(fileList) <= 0 {
		return errors.New("app can not get pprof file")
	}

	// 7. 数据落库
	//生成场景ID
	sceneId := util.ShortHash(strconv.FormatInt(time.Now().Unix(), 10), 1)
	for _, item := range fileList {
		err := p.savePProf2DB(req.Env, req.ZoneCode, req.AppName, appInfo.Aid, req.HostName, sceneId, item.FileType, item.Url, "svg")
		if err != nil {
			xlog.Error("save pprof to db err", zap.Error(err), zap.String("appName", req.AppName), zap.String("zoneCode", req.ZoneCode), zap.String("hostName", req.HostName), zap.Any("item", item))
			return err
		}
	}
	return nil
}

func getFlameGraph(fileName, tagFileName string) error {
	// 1 获取和存储profile的原始的svg图
	out, err := exec.Command("bash", "-c", fmt.Sprintf("go tool pprof -svg %s > %s", fileName, tagFileName)).Output()
	if err != nil {
		return fmt.Errorf("go tool pprof -svg err: %v", err)
	}

	// 2 获取火焰图准备
	out, err = exec.Command("bash", "-c", "go tool pprof -raw "+fileName).Output()
	if err != nil {
		return fmt.Errorf("go tool pprof -raw err: %v", err)
	}

	profile, err := torchPprof.ParseRaw(out)
	if err != nil {
		return fmt.Errorf("could not parse raw pprof output: %v", err)
	}

	sampleIndex := torchPprof.SelectSample([]string{}, profile.SampleNames)
	flameInput, err := renderer.ToFlameInput(profile, sampleIndex)
	if err != nil {
		return fmt.Errorf("could not convert stacks to flamegraph input: %v", err)
	}

	// 3 生成火焰图
	flameGraph, err := renderer.GenerateFlameGraph(flameInput, []string{}...)
	if err != nil {
		xlog.Error("flame graph err", zap.Error(err), zap.Any("flameInput", flameInput))
		return fmt.Errorf("could not generate flame graph: %v", err)
	}

	// 4 存储火焰图
	if err := ioutil.WriteFile(tagFileName+"_hy.svg", flameGraph, os.ModePerm); err != nil {
		return err
	}
	xlog.Debug("[success] viewgraph get and save success", zap.String("fileName", fileName), zap.String("tagFileName", tagFileName))
	return nil
}

//GetPprof ..
func (p *pprof) getPprof(uniqZone view.UniqZone, ip, port, pprofType string, durationSec int) (resp []byte, err error) {
	url := "/debug/pprof"
	_, err = clientproxy.ClientProxy.HttpGet(uniqZone, view.ReqHTTPProxy{
		Address: fmt.Sprintf("%s:%s", ip, port),
		URL:     url,
		Timeout: durationSec,
	})
	if err != nil {
		return
	}
	// 耗时比较久
	if pprofType == "profile" {
		pprofType = fmt.Sprintf("%s?seconds=%d", pprofType, durationSec)
	}
	url = url + "/" + pprofType
	resp2, err := clientproxy.ClientProxy.HttpGet(uniqZone, view.ReqHTTPProxy{
		Address: fmt.Sprintf("%s:%s", ip, port),
		URL:     url,
		Timeout: durationSec,
	})
	if err != nil {
		return
	}
	resp = resp2.Body()
	return
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

func (p *pprof) getIp(app db.AppNode) (ip string, err error) {
	var (
		appPod db.K8sPod
	)
	appNode, err := resource.Resource.GetAppNode(app)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		appPod, err = resource.Resource.GetAppPod(db.K8sPod{NodeName: app.HostName, AppName: app.AppName})
		if err != nil {
			return "", err
		}
		return appPod.PodIp, nil
	}
	if err != nil {
		return "", err
	}
	return appNode.IP, nil
}
