package grpc

import (
	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/grpctest"
	"github.com/douyu/juno/pkg/model/view"
)

func Proto(c *core.Context) error {
	protoList, err := grpctest.Proto()
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(protoList))
}

func MethodDetail(c *core.Context) error {
	var param view.ReqMethodDetail
	err := c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	detail, err := grpctest.MethodDetail(param.ID)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(detail))
}

func BindProtoToApp(c *core.Context) error {
	var param view.ReqBindProtoToApp
	err := c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	err = c.Validate(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	err = grpctest.BindProtoToApp(param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success")
}

func AppServiceTree(c *core.Context) error {
	resp, err := grpctest.AppServiceTree()
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(resp))
}

func Services(c *core.Context) error {
	appName := c.QueryParam("app_name")
	services, err := grpctest.Services(appName)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(services))
}
