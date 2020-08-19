package grpc

import (
	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/grpctest"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/model/view"
)

func UseCases(c *core.Context) error {
	var param view.ReqListGRPCUseCases
	err := c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	err = c.Validate(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	u := user.GetUser(c)

	cases, err := grpctest.UseCases(uint(u.Uid), param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(cases))
}

func CreateUseCase(c *core.Context) error {
	var param view.ReqCreateGRPCUseCase
	err := c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	u := user.GetUser(c)

	useCase, err := grpctest.CreateUseCase(uint(u.Uid), param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(useCase))
}

func UpdateUseCase(c *core.Context) error {
	var param view.ReqUpdateGRPCUseCase
	err := c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	u := user.GetUser(c)

	useCase, err := grpctest.UpdateUseCase(uint(u.Uid), param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(useCase))
}

func UseCaseDetail(c *core.Context) error {
	var param view.ReqUseCaseDetail
	err := c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	detail, err := grpctest.UseCaseDetail(param.ID)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(detail))
}

func DeleteUseCase(c *core.Context) error {
	var param view.ReqQueryGRPCUseCase

	err := c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	u := user.GetUser(c)

	err = grpctest.DeleteUseCase(uint(u.Uid), param.MethodID)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success")
}

func SendRequest(c *core.Context) (err error) {
	var param view.ReqSendGRPCRequest

	err = c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	u := user.GetUser(c)

	response, err := grpctest.UserMakeRequest(uint(u.Uid), view.MakeGrpcRequest{
		MethodID: param.MethodID,
		Input:    param.Input,
		Address:  param.Address,
		Metadata: param.Metadata,
		Script:   param.Script,
	})

	return c.OutputJSON(output.MsgOk, "success", c.WithData(response))
}

func RequestHistory(c *core.Context) (err error) {
	var param view.ReqGrpcHistoryList

	err = c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	history, err := grpctest.RequestHistoryList(param, uint(user.GetUser(c).Uid))
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(history))
}

func RequestHistoryDetail(c *core.Context) (err error) {
	var param view.ReqQueryHistoryItem

	err = c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	item, err := grpctest.RequestHistoryItem(param.HistoryID)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(item))
}
