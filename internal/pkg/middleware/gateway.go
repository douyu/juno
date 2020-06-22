package middleware

import (
	"github.com/douyu/juno/internal/pkg/service/gateway"
	"github.com/labstack/echo/v4"
)

func ProxyGatewayMW(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		// 检查是否在网关代理的列表里面
		if gateway.IsDomainToProxy(c.Request().Host) {
			return gateway.Proxy(c)
		}

		return next(c)
	}
}
