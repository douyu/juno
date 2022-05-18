package proxyintegrat

import (
	"context"

	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/proxyintegrat"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/model/view/vproxyintegrat"
	"github.com/labstack/echo/v4"
)

//ProxyManageList 列表
func ProxyManageList(c echo.Context) (err error) {
	param := &vproxyintegrat.ProxyManageListParams{}
	err = c.Bind(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}
	err = c.Validate(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}
	list, total, err := proxyintegrat.ProxyManageList(context.Background(), param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "", map[string]interface{}{"list": list, "pagination": map[string]interface{}{
		"total": total, "current": param.Current, "pageSize": param.PageSize,
	}})
}

//ProxyManageCreateOrUpdate 创建或者更新代理菜单
func ProxyManageCreateOrUpdate(c echo.Context) (err error) {
	param := &vproxyintegrat.ProxyManageCreateOrUpdateParams{}
	err = c.Bind(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}
	err = c.Validate(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}
	u := user.GetUser(c)
	param.UID = uint32(u.Uid)
	err = proxyintegrat.ProxyManageCreateOrUpdate(context.Background(), param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "", struct{}{})
}

//ProxyManageDelete 删除菜单
func ProxyManageDelete(c echo.Context) (err error) {
	param := &vproxyintegrat.ProxyManageDeleteParams{}
	err = c.Bind(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}
	err = c.Validate(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}
	u := user.GetUser(c)
	param.UID = uint32(u.Uid)
	err = proxyintegrat.ProxyManageDelete(context.Background(), param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "", struct{}{})
}
