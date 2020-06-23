package confgo

import (
	"errors"
	"strings"

	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/auth"
	"github.com/douyu/juno/internal/pkg/service/confgo"
	"github.com/douyu/juno/internal/pkg/service/resource"
	user2 "github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/labstack/echo/v4"
)

// ListResource Get all resources
func ListResource(c echo.Context) error {
	typ := c.Param("typ")
	switch typ {
	case "dep":
		return ListDepResource(c)
	case "admin":
		return ListAdminResource(c)
	case "user":
		return listUserResource(c)
	case "related":
		return GetRelatedResource(c)
	}
	return output.JSON(c, output.MsgErr, "typ error")
}

// ListAdminResource Get all resources
func ListAdminResource(c echo.Context) error {
	var err error
	reqModel := new(resourceListParams)
	if err = c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	// prod环境访问添加读权限
	if !user2.IsAdmin(c) {
		return output.JSON(c, output.MsgErr, errors.New("not admin").Error())
	}

	res, count, err := confgo.ResourceSrv.GetAdminResourceList(reqModel.ID, reqModel.AppID, reqModel.Name, reqModel.Value, reqModel.Env, reqModel.ZoneCode, reqModel.Type, reqModel.Page, reqModel.Limit)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "查询资源成功", map[string]interface{}{
		"list":        res,
		"currentPage": reqModel.Page,
		"totalCount":  count,
	})
}

// listUserResource 获取所有资源
func listUserResource(c echo.Context) error {
	var err error
	reqModel := new(resourceListParams)
	if err = c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	res, count, err := confgo.ResourceSrv.GetUserResourceList(reqModel.ID, reqModel.AppID, reqModel.Name, reqModel.Value, reqModel.Env, reqModel.Type, reqModel.Page, reqModel.Limit)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "查询资源成功", map[string]interface{}{
		"list":        res,
		"currentPage": reqModel.Page,
		"totalCount":  count,
	})
}

// AddResource ...
func AddResource(c echo.Context) error {
	var err error
	reqModel := make([]db.CmcResource, 0)

	_ = c.Bind(&reqModel)

	if len(reqModel) == 0 {
		return output.JSON(c, output.MsgErr, "params error")
	}

	user := user2.GetUser(c)
	// prod环境访问添加写权限
	if strings.HasPrefix(reqModel[0].Env, "prod") {
		if ok, _ := auth.GitlabMasterAuth(user.Uid, ""); !ok {
			return output.JSON(c, output.MsgErr, "权限错误")
		}

	}

	err = confgo.ResourceSrv.AddResource(reqModel, user.Username)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "添加资源成功")
}

// DelResource ..
func DelResource(c echo.Context) error {
	var err error
	reqModel := new(db.CmcResource)
	if err = c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	if reqModel.ID == 0 {
		return output.JSON(c, output.MsgErr, "id必须指定")
	}

	err = confgo.ResourceSrv.DelResource(reqModel.ID)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "删除资源成功")
}

// UpdateResource ..
func UpdateResource(c echo.Context) error {
	var err error
	reqModel := new(db.CmcResource)
	if err = c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	if reqModel.ID == 0 {
		return output.JSON(c, output.MsgErr, "id必须指定")
	}

	user := user2.GetUser(c)

	// prod环境访问添加写权限
	if strings.HasPrefix(reqModel.Env, "prod") {
		if ok, _ := auth.GitlabMasterAuth(user.Uid, ""); !ok {
			return output.JSON(c, output.MsgErr, "权限错误")
		}
	}

	err = confgo.ResourceSrv.UpdateResource(reqModel.ID, reqModel.Name, reqModel.Env, reqModel.Value, reqModel.ValueType, reqModel.Type,
		reqModel.Desc, reqModel.IsShow, reqModel.IsCommon, user.Username)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "更新资源成功")
}

// GetRelatedResource ...
func GetRelatedResource(c echo.Context) error {
	var err error
	reqModel := new(struct {
		Name  string `json:"name"`
		Value string `json:"value"`
		Env   string `json:"env"`
		Type  string `json:"type"`
		Page  int    `json:"page"`
		Limit int    `json:"limit"`
		ID    int    `json:"id"`
		Caid  int    `json:"caid"`
		AppID int    `json:"appId"`
	})
	if err = c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	res, err := confgo.ResourceSrv.GetRelatedSourceList(reqModel.Caid, true)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "查询资源成功", res)
}

// ListDepResource ..
func ListDepResource(c echo.Context) (err error) {
	reqModel := new(db.CmcResource)
	if err = c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	if reqModel.ID == 0 {
		return output.JSON(c, output.MsgErr, "id不能为空")
	}
	appList, err := confgo.ConfuSrv.ResourceAppList(reqModel.ID)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "", appList)
}

// InfoAll According to the application id or application name, get all the application configuration of the computer room
func InfoAll(c echo.Context) error {
	var err error
	type ReqAppInfo struct {
		Aid     int    `query:"aid"`
		AppName string `query:"app_name"`
	}

	req := ReqAppInfo{}
	if err = c.Bind(&req); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	var identify interface{}
	if req.Aid > 0 {
		identify = req.Aid
	} else {
		identify = req.AppName
	}

	// 获取全部应用各个机房的配置信息
	resp, err := confgo.ConfuSrv.GetAllConfigTextByApp(identify)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "查询资源成功", resp)
}

// ParseAll Analyze the application configuration according to the application id or application name
func ParseAll(c echo.Context) error {
	var err error
	type ReqAppInfo struct {
		Aid     int    `query:"aid"`
		AppName string `query:"app_name"`
	}

	req := ReqAppInfo{}
	if err = c.Bind(&req); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	var identify interface{}
	if req.Aid > 0 {
		identify = req.Aid
	} else {
		identify = req.AppName
	}

	// 获取全部应用各个机房的配置信息
	resp, err := confgo.ConfuSrv.GetAllConfigTextByApp(identify)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	respp := make([]*confgo.CmcTpl, 0)
	for _, value := range resp.Config {
		list, err := confgo.ParseConfig(invoker.JunoMysql, value)
		if err != nil {
			return output.JSON(c, output.MsgErr, err.Error())
		}
		respp = append(respp, list...)
	}

	return output.JSON(c, output.MsgOk, "查询资源成功", respp)
}

// ParseGenerator Analyze the application configuration according to the application id or application name
func ParseGenerator(c echo.Context) error {
	allApp, err := resource.Resource.GetAllApp()
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	for _, info := range allApp {
		respp := make([]*confgo.CmcTpl, 0)
		// 获取全部应用各个机房的配置信息
		resp, err := confgo.ConfuSrv.GetAllConfigTextByApp(info.AppName)
		if err != nil {
			return output.JSON(c, output.MsgErr, err.Error())
		}
		for _, value := range resp.Config {
			list, err := confgo.ParseConfig(invoker.JunoMysql, value)
			if err != nil {
				return output.JSON(c, output.MsgErr, err.Error())
			}
			respp = append(respp, list...)
		}
		err = confgo.CmcAppSrv.ParseToMysql(info.Aid, info.AppName, respp)
		if err != nil {
			continue
		}
	}
	return output.JSON(c, output.MsgOk, "查询资源成功")
}

type resourceListParams struct {
	Name     string `json:"name"`
	Value    string `json:"value"`
	Env      string `json:"env"`
	Type     string `json:"type"`
	Page     int    `json:"page"`
	Limit    int    `json:"limit"`
	ID       int    `json:"id"`
	Caid     int    `json:"caid"`
	AppID    int    `json:"app_id"`
	ZoneCode string `json:"zone_code"`
	DepNum   int    `json:"dep_num"`
}
