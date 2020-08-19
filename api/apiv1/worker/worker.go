package worker

import (
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/testplatform/workerpool"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/labstack/echo/v4"
)

func Heartbeat(c echo.Context) error {
	var params view.WorkerHeartbeat

	err := c.Bind(&params)
	if err != nil {
		return output.JSON(c, output.MsgErr, "invalid params:"+err.Error())
	}

	workerpool.Instance().Heartbeat(params)
	return output.JSON(c, output.MsgOk, "success")
}
