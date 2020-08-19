package platform

import (
	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/testplatform"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/labstack/echo/v4"
)

func TaskStepStatusUpdate(c echo.Context) error {
	var params view.TestTaskEvent
	err := c.Bind(&params)
	if err != nil {
		return output.JSON(c, output.MsgErr, "invalid params: "+err.Error())
	}

	err = testplatform.UpdateTaskStatus(params)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

func TaskList(c *core.Context) error {
	var params view.ReqQueryTestTasks
	err := c.Bind(&params)
	if err != nil {
		return c.OutputJSON(output.MsgErr, "invalid params:"+err.Error())
	}

	tasks, pagination, err := testplatform.ListTasks(params)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(map[string]interface{}{
		"list":       tasks,
		"pagination": pagination,
	}))
}

func TaskSteps(c *core.Context) error {
	var params view.ReqQueryTaskItem
	err := c.Bind(&params)
	if err != nil {
		return c.OutputJSON(output.MsgErr, "invalid params: "+err.Error())
	}

	steps, err := testplatform.TaskSteps(params.TaskID)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(steps))
}
