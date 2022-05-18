package proxyintegrat

import (
	"context"

	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/proxyintegrat"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/model/view/vproxyintegrat"
	"github.com/labstack/echo/v4"
)

//ProxyMenuList 代理列表
func ProxyMenuList(c echo.Context) (err error) {
	param := &vproxyintegrat.ProxyMenuListParams{}
	err = c.Bind(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}
	err = c.Validate(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}
	list, total, err := proxyintegrat.ProxyMenuList(context.Background(), param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "", map[string]interface{}{"list": list, "pagination": map[string]interface{}{
		"total": total, "current": param.Current, "pageSize": param.PageSize,
	}})
}

//ProxyMenuCreateOrUpdate 创建或者更新代理菜单
func ProxyMenuCreateOrUpdate(c echo.Context) (err error) {
	param := &vproxyintegrat.ProxyMenuCreateOrUpdateParams{}
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
	err = proxyintegrat.ProxyMenuCreateOrUpdate(context.Background(), param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "", struct{}{})
}

//ProxyMenuDelete 删除菜单
func ProxyMenuDelete(c echo.Context) (err error) {
	param := &vproxyintegrat.ProxyMenuDeleteParams{}
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
	err = proxyintegrat.ProxyMenuDelete(context.Background(), param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "", struct{}{})
}
