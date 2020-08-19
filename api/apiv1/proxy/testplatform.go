package proxy

import (
	"encoding/json"
	"time"

	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/proxy"
	"github.com/douyu/juno/internal/pkg/service/testtask"
	"github.com/douyu/juno/pkg/constx"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/juno/pkg/pb"
	"github.com/labstack/echo/v4"
)

func DispatchTask(c echo.Context) (err error) {
	var param view.TestTask
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "invalid params")
	}

	err = c.Validate(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "invalid params"+err.Error())
	}

	err = testtask.Instance().Push(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "invalid params"+err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

func ConsumeTask(c echo.Context) (err error) {
	timer := time.NewTimer(10 * time.Second)

	select {
	case <-timer.C:
		return output.JSON(c, output.MsgTaskQueueEmpty, "queue empty")
	case task := <-testtask.Instance().C():
		return output.JSON(c, output.MsgOk, "success", task)
	}
}

func TaskStatusUpdate(c echo.Context) (err error) {
	var event view.TestTaskEvent
	err = c.Bind(&event)
	if err != nil {
		return output.JSON(c, output.MsgErr, "params invalid:"+err.Error())
	}

	msg, _ := json.Marshal(&event)

	if proxy.StreamStore.IsStreamExist() {
		err = proxy.StreamStore.GetStream().Send(&pb.NotifyResp{
			MsgId: constx.MsgTestStepUpdateResp,
			Msg:   msg,
		})
		if err != nil {
			return output.JSON(c, output.MsgErr, err.Error())
		}
	} else {
		return output.JSON(c, output.MsgErr, "stream is not exist")
	}

	return output.JSON(c, output.MsgOk, "success")
}
