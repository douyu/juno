package plugin

import (
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/proxyintegrat"
	"github.com/labstack/echo/v4"
)

//PluginList 插件列表
func PluginList(c echo.Context) (err error) {
	list, err := proxyintegrat.AppProxyMenuList(c.Request().Context())
	if err != nil {
		return output.JSON(c, output.MsgOk, "success", map[string]interface{}{"list": []struct{}{}})
	}
	return output.JSON(c, output.MsgOk, "success", map[string]interface{}{"list": list})
}
