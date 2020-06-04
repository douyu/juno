package app

import (
	"strings"

	"github.com/douyu/juno/pkg/service/resource"

	"github.com/douyu/juno/pkg/packages/contrib/output"
	"github.com/labstack/echo/v4"
)

// 添加lang约束查询
func FilterList(c echo.Context) error {
	langs := c.QueryString()
	langsList := make([]string, 0)
	if len(langs) > 0 {
		langsList = strings.Split(strings.ToLower(langs), ",")
	}
	// 写死 project a
	// bizDomain := []string{"项目A"}
	result, err := resource.Resource.FilterListInLangs(langsList)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "", result)
}

// DetailV2  新版应用详情
func Info(c echo.Context) error {
	appName := c.QueryParam("appName")
	if appName == "" {
		return output.JSON(c, output.MsgErr, "params appname error")
	}

	// 基础信息
	appInfo, err := resource.Resource.GetApp(appName)
	if err != nil {
		// return output.JSON(c, output.MsgErr, err.Error())
	}
	// 机房信息
	idcInfo, err := resource.Resource.GetAppIDCList(appName)
	if err != nil {
		// return output.JSON(c, output.MsgErr, err.Error())
	}
	// 日志机房信息，要做映射

	// jupiter版本
	jupiterVersion, err := resource.Resource.GetMinervaVersion(appName)
	if err != nil {
		// return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "", map[string]interface{}{
		"appInfo":        appInfo,
		"idcList":        idcInfo,
		"jupiterVersion": jupiterVersion,
	})
}

// DetailV2  新版应用详情
func Env(c echo.Context) error {
	// 机房信息
	idcInfo, err := resource.Resource.GetIDCList()
	if err != nil {
		// return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "", map[string]interface{}{
		"idcList": idcInfo,
	})
}

// ReqAppsQuery ...
type ReqAppsQuery struct {
	Langs     []string `json:"langs" form:"langs"`
	BizDomain []string `json:"tags" form:"tags"`
	Qs        string   `json:"qs" form:"qs"`
	SortBy    string   `json:"sortBy" form:"sortBy"`
	Page      int      `json:"page" form:"page"`
	CustomBy  string   `json:"custom"`
	PageSize  uint     `json:"pageSize"`
}
