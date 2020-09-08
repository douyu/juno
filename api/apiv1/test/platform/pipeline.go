package platform

import (
	"strconv"

	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/testplatform"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/model/view"
)

func ListPipeline(c *core.Context) (err error) {
	var params view.ReqListPipeline
	err = c.Bind(&params)
	if err != nil {
		return c.OutputJSON(output.MsgErr, "invalid params:"+err.Error())
	}

	pipelines, err := testplatform.ListPipeline(params)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(pipelines))
}

func CreatePipeline(c *core.Context) (err error) {
	var params view.TestPipeline

	err = c.Bind(&params)
	if err != nil {
		return c.OutputJSON(output.MsgErr, "invalid params: "+err.Error())
	}

	u := user.GetUser(c)
	err = testplatform.CreatePipeline(uint(u.Uid), params)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success")
}

func UpdatePipeline(c *core.Context) (err error) {
	var params view.TestPipeline

	err = c.Bind(&params)
	if err != nil {
		return c.OutputJSON(output.MsgErr, "invalid params: "+err.Error())
	}

	err = testplatform.UpdatePipeline(uint(user.GetUser(c).Uid), params)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success")
}

func RunPipeline(c *core.Context) (err error) {
	pipelineId, err := strconv.Atoi(c.QueryParam("id"))
	if err != nil {
		return c.OutputJSON(output.MsgErr, "invalid pipeline")
	}

	err = testplatform.DispatchTask(uint(user.GetUser(c).Uid), uint(pipelineId))
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success")
}

func DeletePipeline(c *core.Context) error {
	pipelineId, err := strconv.Atoi(c.QueryParam("id"))
	if err != nil {
		return c.OutputJSON(output.MsgErr, "invalid pipeline")
	}

	err = testplatform.DeletePipeline(pipelineId)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success")
}
