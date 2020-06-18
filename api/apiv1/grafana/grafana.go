package grafana

import (
	"net/http"

	"github.com/douyu/juno/internal/pkg/service/grafana"
	"github.com/labstack/echo/v4"
)

func Proxy(c echo.Context) (err error) {
	err = grafana.Proxy(c)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Grafana访问失败:"+err.Error())
	}

	return
}
