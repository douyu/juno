package proxyintegrat

import (
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/aliyunlog"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/labstack/echo/v4"
)

// TraceUrl 阿里云trace地址获取
func TraceURL(c echo.Context) (err error) {
	u := user.GetUser(c)
	toURL := c.QueryParam("toURL")
	data, err := aliyunlog.Instance.CompleteTraceSearchUrl(c.Request().Context(), &aliyunlog.CompleteTraceSearchUrlRequest{
		Region: "华北2（北京）",
		ToURL:  toURL,
	}, u)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "", map[string]interface{}{"url": data})
}
