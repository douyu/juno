package proxyintegrat

import (
	"context"

	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/proxyintegrat"
	"github.com/douyu/juno/pkg/model/view/vproxyintegrat"
	"github.com/labstack/echo/v4"
)

const MaxSize = 100

//UIList 代理功能页面
func UIList(c echo.Context) (err error) {
	param := &vproxyintegrat.ProxyUIParams{Current: 1, PageSize: MaxSize}
	list, err := proxyintegrat.UIList(context.Background(), param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "", map[string]interface{}{"list": list})
}
