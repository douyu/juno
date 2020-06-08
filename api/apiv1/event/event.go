package event

import (
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/appevent"
	"github.com/labstack/echo/v4"
)

// 更新数据
func List(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqList{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	list, pagination, err := appevent.AppEvent.List(reqModel.Page, reqModel.PageSize)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", map[string]interface{}{
		"pagination": pagination,
		"list":       list,
	})
}

// Statistics 获取发布时间的时序趋势
func Statistics(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqList{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	list, pagination, err := appevent.AppEvent.List(reqModel.Page, reqModel.PageSize)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", map[string]interface{}{
		"pagination": pagination,
		"list":       list,
	})
}
