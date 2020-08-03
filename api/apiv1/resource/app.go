package resource

import (
	"encoding/json"
	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/internal/pkg/service/system"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
	"strings"
)

// 应用信息
func AppInfo(c echo.Context) error {
	var (
		err      error
		info     db.AppInfo
		identify interface{}
	)
	reqModel := ReqAppInfo{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	if reqModel.Aid > 0 {
		identify = reqModel.Aid
	} else {
		identify = reqModel.AppName
	}

	info, err = resource.Resource.GetApp(identify)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", info)
}

// 应用列表
func AppList(c echo.Context) error {
	var err error
	reqModel := ReqAppList{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	list, page, err := resource.Resource.GetAppList(reqModel.AppInfo, reqModel.CurrentPage, reqModel.PageSize, reqModel.KeywordsType, reqModel.Keywords, reqModel.SearchPort, "update_time desc,aid desc")
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", map[string]interface{}{
		"pagination": page,
		"list":       list,
	})
}

func AppListWithEnv(c echo.Context) error {
	var param view.ReqAppListWithEnv
	err := c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgOk, err.Error())
	}

	appList, err := resource.Resource.GetAppListWithEnv(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success", appList)
}

type configVersion struct {
	Name       string `json:"name"`
	Version    string `json:"version"`
	VersionKey string `json:"versionKey"` // 版本key
}

func GetFrameVersion(c echo.Context) error {
	resp := view.RespGetFrameVersion{}

	var param view.ReqGetFrameVersion
	err := c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	if param.AppName == "" {
		return output.JSON(c, output.MsgErr, "必须传appName")
	}

	frameVersion, err := resource.Resource.GetFrameVersion(param.AppName)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	resp.FrameVersion = frameVersion

	if frameVersion == "" {
		return output.JSON(c, output.MsgOk, "success", resp)
	}

	// v1.7.1 去掉最后的.1
	if strings.Contains(frameVersion, ".") {
		ind := strings.LastIndex(frameVersion, ".")
		frameVersion = frameVersion[0:ind]
	}

	settings, err := system.System.Setting.GetAll()
	if err != nil {
		xlog.Error("Setting.GetAll", zap.Error(err))
	}
	tmp, ok := settings["version"]
	if !ok {
		xlog.Warn("GetFrameVersion", zap.String("no key", "version"))
		return output.JSON(c, output.MsgOk, "success", resp)
	}

	versionStruct := make([]configVersion, 0)
	if err := json.Unmarshal([]byte(strings.TrimSpace(tmp)), &versionStruct); err != nil {
		xlog.Warn("GetFrameVersion", zap.String("json unmarshall", "version"), zap.Error(err))
		return output.JSON(c, output.MsgOk, "success", resp)
	}

	for _, v := range versionStruct {
		// v.version v1.7, v1.8
		if v.Version == "" {
			continue
		}
		version := strings.TrimSpace(v.Version)
		//version = strings.TrimPrefix(version, "[")
		//version = strings.TrimPrefix(version, "]")
		versionArray := strings.Split(version, ",")
		for _, versionStr := range versionArray {
			versionStr = strings.TrimSpace(versionStr)
			if versionStr == frameVersion {
				resp.VersionKey = v.VersionKey
				break
			}
		}
		if resp.VersionKey != "" {
			break
		}
	}
	return output.JSON(c, output.MsgOk, "success", resp)
}

// 创建数据或者修改数据
func AppPut(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqAppPut{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	// todo 根据header头，识别是谁创建的
	for _, value := range reqModel.List {
		err = resource.Resource.PutApp(value, &db.User{})
		if err != nil {
			return output.JSON(c, output.MsgErr, err.Error())
		}
	}
	return output.JSON(c, output.MsgOk, "success")
}

// 创建数据
func AppCreate(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqAppCreate{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	err = resource.Resource.CreateApp(reqModel.AppInfo, &db.User{})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

// 更新数据
func AppUpdate(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqAppUpdate{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	err = resource.Resource.UpdateApp(reqModel.AppInfo, &db.User{})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

// 删除数据
func AppDelete(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqAppDelete{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	err = resource.Resource.DeleteApp(reqModel.AppInfo, &db.User{})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

//GrpcAddrList 获取 Grpc 的地址列表
func GrpcAddrList(c *core.Context) error {
	var param QueryAppByAppName

	err := c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	port, nodes, err := resource.Resource.GetAppGrpcList(param.AppName)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	resp := RespAppGrpcAddrList{
		Port: port,
	}

	for _, node := range nodes {
		resp.Hosts = append(resp.Hosts, AddrEnvItem{
			Env:  node.Env,
			Addr: node.IP,
		})
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(resp))
}

//HttpAddrList 获取 Http 地址列表
func HttpAddrList(c *core.Context) error {
	var param QueryAppByAppName

	err := c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	port, nodes, err := resource.Resource.GetAppHttpList(param.AppName)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	resp := RespAppHTTPAddrList{
		Port: port,
	}

	for _, node := range nodes {
		resp.Hosts = append(resp.Hosts, AddrEnvItem{
			Env:  node.Env,
			Addr: node.IP,
		})
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(resp))
}
