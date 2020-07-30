package http

import (
	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/httptest"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/model/view"
)

func UseCaseDetail(c *core.Context) error {
	var param view.QueryHttpTestUseCase

	err := c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	useCase, err := httptest.GetUseCase(param.UseCaseID)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(useCase))
}

func CreateUseCase(c *core.Context) error {
	var param view.CreateHttpTestCase

	err := c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	useCase, err := httptest.CreateUseCase(uint(user.GetUser(c).Uid), param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(useCase))
}

func DeleteUseCase(c *core.Context) error {
	var param view.QueryHttpTestUseCase

	err := c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	err = httptest.DeleteUseCase(uint(user.GetUser(c).Uid), param.UseCaseID)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success")
}

func UpdateUseCase(c *core.Context) error {
	var param view.HttpTestCase

	err := c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	err = httptest.UpdateUseCase(uint(user.GetUser(c).Uid), param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success")
}
