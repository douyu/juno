package aliyunlog

import "github.com/labstack/echo/v4"

//Group api group
func Group(g *echo.Group) {
	g.GET("/logStoreMenu", LogStoreMenu)
	g.GET("/completeLogSearchUrl", CompleteLogSearchUrl)
}
