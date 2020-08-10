package event

import (
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/appevent"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/labstack/echo/v4"
)

// 更新数据
func List(c echo.Context) error {
	var (
		err error
	)
	reqModel := view.ReqEventList{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	list, pagination, err := appevent.AppEvent.List(reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", map[string]interface{}{
		"pagination": pagination,
		"list":       list,
	})
}
