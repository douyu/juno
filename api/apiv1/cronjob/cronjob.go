package cronjob

import (
	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/taskplatform"
	"github.com/douyu/juno/pkg/model/view"
)

func ListJob(c *core.Context) error {
	var params view.ReqQueryJobs
	err := c.Bind(&params)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	list, pagination, err := taskplatform.Job.List(params)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.Success(c.WithData(map[string]interface{}{
		"list":       list,
		"pagination": pagination,
	}))
}

func CreateJob(c *core.Context) error {
	var cronjob view.CronJob

	err := c.Bind(&cronjob)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	err = taskplatform.Job.Create(uint(c.GetUser().Uid), cronjob)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.Success()
}

func UpdateJob(c *core.Context) error {
	var cronjob view.CronJob

	err := c.Bind(&cronjob)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	err = taskplatform.Job.Update(cronjob)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.Success()
}

func DeleteJob(c *core.Context) error {
	jobId, err := c.QueryInt("id")
	if err != nil {
		return c.OutputJSON(output.MsgErr, "invalid job id: "+err.Error())
	}

	err = taskplatform.Job.Delete(uint(jobId))
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.Success()
}

func Dispatch(c *core.Context) error {
	node := c.QueryParam("node")
	jobId, err := c.QueryInt("id")
	if err != nil {
		return c.OutputJSON(output.MsgErr, "invalid job id: "+err.Error())
	}

	err = taskplatform.Job.DispatchOnce(uint(jobId), node)
	if err != nil {
		return c.OutputJSON(output.MsgErr, "dispatch failed:"+err.Error())
	}

	return c.Success()
}
