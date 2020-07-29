package http

import (
	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/httptest"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/model/view"
)

func SendRequest(c *core.Context) error {
	var param view.ReqSendHttpRequest

	err := c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	response, err := httptest.SendRequest(uint(user.GetUser(c).Uid), param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(response))
}

func RequestHistory(c *core.Context) error {
	var param view.ReqListHttpTestHistory

	err := c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	history, err := httptest.RequestHistory(uint(user.GetUser(c).Uid), param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(history))
}

func RequestDetail(c *core.Context) error {
	var param view.ReqQueryHistoryItem

	err := c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	history, err := httptest.RequestHistoryDetail(param.HistoryID)

	return c.OutputJSON(output.MsgOk, "success", c.WithData(history))
}
