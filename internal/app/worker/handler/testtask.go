package handler

import (
	"github.com/douyu/juno/internal/app/worker/testworker"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/labstack/echo/v4"
)

func DispatchTestTask(c echo.Context) (err error) {
	var params view.TestTask

	err = c.Bind(&params)
	if err != nil {
		return output.JSON(c, output.MsgErr, "invalid params"+err.Error())
	}

	err = testworker.Instance().Push(params)
	if err != nil {
		return output.JSON(c, output.MsgErr, "enqueue failed: "+err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}
