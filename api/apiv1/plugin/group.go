package plugin

import "github.com/labstack/echo/v4"

//Group api group
func Group(g *echo.Group) {
	//插件列表
	g.GET("/pluginList", PluginList)
}
