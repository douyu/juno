package resource

import (
	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/labstack/echo/v4"
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
	var param ReqAppGrpcAddrList

	err := c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	err = c.Validate(&param)
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
