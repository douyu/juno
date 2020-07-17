package pprofHandle

import (
	"github.com/douyu/juno/pkg/cfg"
	"os/exec"
	"strings"

	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/pprof"
	"github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/pkg/model/db"
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
	record, err := resource.Resource.GetSysConfig(0, "")
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", record)
}

// CheckDep pprof dependency detection
func CheckDep(c echo.Context) error {
	reqModel := db.ReqCheck{}
	if err := c.Bind(&reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	type RespCheck struct {
		Golang        int    `json:"golang"`
		GolangVersion string `json:"golangVersion"`
		FlameGraph    int    `json:"flameGraph"`
		Graphviz      int    `json:"graphviz"`
	}
	resp := RespCheck{}

	if cmdOut, err := exec.Command("go", "version").Output(); err == nil {
		resp.Golang = 1
		resp.GolangVersion = strings.Split(string(cmdOut), " ")[2]
	}

	if path, err := exec.LookPath("flamegraph.pl"); err == nil && path != "" {
		resp.FlameGraph = 1
	}

	if path, err := exec.LookPath("dot"); err == nil && path != "" {
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
		Name:       "FlameGraph环境",
		CheckRes:   resp.FlameGraph,
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

func Run(c echo.Context) error {
	reqModel := db.ReqProfile{}
	if err := c.Bind(&reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	if reqModel.AppName == "" || reqModel.HostName == "" || reqModel.Env == "" {
		return output.JSON(c, output.MsgErr, "参数缺失")
	}

	if reqModel.ZoneCode == "" {
		return output.JSON(c, output.MsgErr, "必须选择可用区")
	}

	if reqModel.ZoneCode == "all" {
		return output.JSON(c, output.MsgErr, "请选择具体的可用区，不要选择全部")
	}

	if err := pprof.Pprof.RunPprof(reqModel.Env, reqModel.ZoneCode, reqModel.AppName, reqModel.HostName); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

// 查询已经存储的pprof文件
func FileList(c echo.Context) error {
	req := db.PProfReqList{}
	showData := make([]db.PProf, 0)

	err := c.Bind(&req)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数错误", showData)
	}

	if req.AppName == "" {
		return output.JSON(c, output.MsgErr, "参数错误2", showData)
	}

	fileList, err := pprof.Pprof.List(req.Env, req.ZoneCode, req.AppName, req.HostName)
	if err != nil {
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
			item.PprofList = append(item.PprofList, db.PprofInfo{
				Id:   node.ID,
				Type: node.Type,
				Url:  strings.TrimPrefix(node.FileInfo, cfg.Cfg.Pprof.StorePath),
			})
		}
		showData = append(showData, item)
	}
	return output.JSON(c, output.MsgOk, "success", showData)
}
