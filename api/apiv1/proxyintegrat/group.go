package proxyintegrat

import "github.com/labstack/echo/v4"

//Group api group
func Group(g *echo.Group) {
	g.GET("/uilist", UIList)
	g.GET("/proxyMenuList", ProxyMenuList)
	g.POST("/proxyMenuCreateOrUpdate", ProxyMenuCreateOrUpdate)
	g.POST("/proxyMenuDelete", ProxyMenuDelete)
}
