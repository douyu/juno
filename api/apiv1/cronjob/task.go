package cronjob

import (
	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/taskplatform"
	"github.com/douyu/juno/pkg/model/view"
)

func ListTask(c *core.Context) (err error) {
	var params view.ReqQueryTasks

	err = c.Bind(&params)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	if len(params.ExecutedAt) != 0 && len(params.ExecutedAt) != 2 {
		return c.OutputJSON(output.MsgErr, "invalid params. len(params.ExecutedAt) MUST be 2")
	}

	tasks, pagination, err := taskplatform.Job.ListTask(params)
	return c.Success(c.WithData(map[string]interface{}{
		"list":       tasks,
		"pagination": pagination,
	}))
}

func DetailTask(c *core.Context) (err error) {
	taskId, err := c.QueryUint("taskId")
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	detail, err := taskplatform.Job.TaskDetail(taskId)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.Success(c.WithData(detail))
}
