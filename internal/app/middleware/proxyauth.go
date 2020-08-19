package middleware

import (
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/labstack/echo/v4"
)

func ProxyAuth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		if c.Request().Header.Get("Token") == cfg.Cfg.ProxyAuth.Token {
			return next(c)
		}

		return output.JSON(c, output.MsgNoAuth, "forbidden")
	}
}
