package aliyunlog

import (
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service"
	"github.com/douyu/juno/internal/pkg/service/aliyunlog"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/labstack/echo/v4"
)

// LogStoreMenu
func LogStoreMenu(c echo.Context) error {
	ret, err := service.AliyunLog.LogStoreMenu(c.Request().Context())
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", map[string]interface{}{
		"list": ret,
	})
}

// CompleteLogSearchUrl
func CompleteLogSearchUrl(c echo.Context) error {
	req := new(aliyunlog.CompleteLogSearchUrlRequest)
	err := c.Bind(req)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	u := user.GetUser(c)
	signInUrl, err := service.AliyunLog.CompleteLogSearchUrl(c.Request().Context(), req, u)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", signInUrl)
}
