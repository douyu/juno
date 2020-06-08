package pprofHandle

import (
	"fmt"
	"strings"

	"github.com/douyu/juno/internal/pkg/service/resource"

	"github.com/douyu/juno/internal/pkg/model/db"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/pprof"
	"github.com/labstack/echo/v4"
)

// GetSysConfig
func GetSysConfig(c echo.Context) error {
	reqModel := db.ReqSysConfig{}
	if err := c.Bind(&reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	if reqModel.SysType == 0 {
		// return output.JSON(c, output.MsgErr, "必须传SysType")
	}
	record, err := resource.Resource.GetSysConfig()
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", record)
}

func SetSysConfig(c echo.Context) error {
	reqModel := db.ReqSysConfig{}
	if err := c.Bind(&reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	if reqModel.SysType == 0 || reqModel.SetInt == 0 {
		return output.JSON(c, output.MsgErr, "必须传SysType和SetInt")
	}
	err := resource.Resource.SetSysConfig(reqModel.SysType, reqModel.SetInt)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success")
}

// CheckDep pprofy dependency detection
func CheckDep(c echo.Context) error {
	reqModel := db.ReqCheck{}
	if err := c.Bind(&reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	type RespCheck struct {
		Golang   int `json:"golang"`
		GoTorch  int `json:"go_torch"`
		Graphviz int `json:"graphviz"`
	}
	resp := RespCheck{}

	if res, err := pprof.CheckShell("pprof/checkGo.sh"); err != nil {
		fmt.Println("checkGo err", res)
		//return fmt.Errorf("checkGo err:%v", err)
		//return output.JSON(c, output.MsgErr, err.Error())
	} else {
		resp.Golang = 1
	}
	if res, err := pprof.CheckShell("pprof/checkGoTorch.sh"); err != nil {
		fmt.Println("checkGoTorch err", res)
		//return fmt.Errorf("checkGo err:%v", err)
		//return output.JSON(c, output.MsgErr, err.Error())
	} else {
		resp.GoTorch = 1
	}
	if res, err := pprof.CheckShell("pprof/checkGraphviz.sh"); err != nil {
		fmt.Println("checkGraphviz err", res)
		//return fmt.Errorf("checkGo err:%v", err)
		//return output.JSON(c, output.MsgErr, err.Error())
	} else {
		resp.Graphviz = 1
	}

	if reqModel.InstallType > 0 {
		return output.JSON(c, output.MsgOk, "success", resp)
	}

	type DepInfo struct {
		Name       string `json:"name"`
		CheckRes   int    `json:"check_res"`
		CanInstall int    `json:"can_install"`
	}
	res := make([]DepInfo, 0)
	item := DepInfo{
		Name:       "Go环境",
		CheckRes:   resp.Golang,
		CanInstall: 0,
	}
	res = append(res, item)
	item = DepInfo{
		Name:       "Go-torch环境",
		CheckRes:   resp.GoTorch,
		CanInstall: 2,
	}
	res = append(res, item)
	item = DepInfo{
		Name:       "Graphviz环境",
		CheckRes:   resp.Graphviz,
		CanInstall: 1,
	}
	res = append(res, item)
	return output.JSON(c, output.MsgOk, "success", res)
}

func InstallDep(c echo.Context) error {
	reqModel := db.ReqCheck{}
	if err := c.Bind(&reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	fmt.Println("reqmod", reqModel)
	if reqModel.InstallType == 0 {
		return output.JSON(c, output.MsgErr, "必须传安装类型")
	}

	switch reqModel.InstallType {
	case 1:
		if res, err := pprof.CheckShell("pprof/graphviz.sh"); err != nil {
			fmt.Println("graphviz err", res)
			//return fmt.Errorf("checkGo err:%v", err)
			return output.JSON(c, output.MsgErr, err.Error())
		}
	case 2:
		if res, err := pprof.CheckShell("pprof/installGoTorch.sh"); err != nil {
			fmt.Println("installGoTorch err", res)
			//return fmt.Errorf("checkGo err:%v", err)
			return output.JSON(c, output.MsgErr, err.Error())
		}
	default:
		return output.JSON(c, output.MsgErr, fmt.Sprintf("非法类型:%v", reqModel.InstallType))
	}

	return output.JSON(c, output.MsgOk, "success")
}

func Run(c echo.Context) error {
	reqModel := db.ReqProfile{}
	if err := c.Bind(&reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	if reqModel.AppName == "" || reqModel.HostName == "" || reqModel.Env == "" {
		return output.JSON(c, output.MsgErr, "参数缺失")
	}

	//execRs := pprof.RunCmd(fmt.Sprintf("pprof/graphviz.sh",))
	//fmt.Printf("graphviz execShell result\n----\n%v---\n", execRs)

	if err := pprof.Pprof.RunPprof(reqModel.Env, reqModel.ZoneCode, reqModel.AppName, reqModel.HostName); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

// 查询已经存储的pprof文件
func FileList(c echo.Context) error {
	req := db.PProfReqList{}
	err := c.Bind(&req)
	showData := make([]db.PProf, 0)

	if err != nil {
		return output.JSON(c, output.MsgErr, "参数错误", showData)
	}

	if req.AppName == "" {
		return output.JSON(c, output.MsgErr, "参数错误2", showData)
	}

	fileList, err := pprof.Pprof.List(req.Env, req.ZoneCode, req.AppName, req.HostName)
	if err != nil {
		//log.Error("pprof.FileList", "err", "List error: "+err.Error(), "req", req)
		return output.JSON(c, output.MsgErr, "file error", showData)
	}

	listBySceneId := make(map[string][]db.PProf)
	for _, file := range fileList {
		listBySceneId[file.SceneId] = append(listBySceneId[file.SceneId], file)
	}

	for _, list := range listBySceneId {
		//detailList, _ := listBySceneId[item.SceneId]
		if len(list) == 0 {
			continue
		}
		item := list[0]
		item.PprofList = make([]db.PprofInfo, 0)
		for _, node := range list {
			url := node.FileInfo
			urls := strings.Split(url, "/")
			for _, v := range urls {
				if strings.Contains(v, ".svg") {
					url = v
				}
			}
			item.PprofList = append(item.PprofList, db.PprofInfo{
				Id:   node.ID,
				Type: node.Type,
				Url:  url,
			})
		}
		showData = append(showData, item)
	}
	return output.JSON(c, output.MsgOk, "success", showData)
}
