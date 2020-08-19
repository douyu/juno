package view

import (
	"encoding/json"
	"time"

	"github.com/douyu/juno/internal/pkg/packages/xtest"
	"github.com/douyu/juno/pkg/model/db"
)

type (
	TestPipeline struct {
		ID                 uint   `json:"id"`
		Name               string `json:"name" validate:"required,min=4,max=32"`
		Env                string `json:"env" validate:"required,min=1,max=32"`
		ZoneCode           string `json:"zone_code" validate:"required"`
		AppName            string `json:"app_name" validate:"required"`
		Branch             string `json:"branch" validate:"required,min=1,max=32"`
		CodeCheck          bool   `json:"code_check"`
		UnitTest           bool   `json:"unit_test"`
		HttpTestCollection *int   `json:"http_test_collection"` // http 测试集合
	}

	TestPipelineUV struct {
		ID       uint                `json:"id"`
		Name     string              `json:"name" validate:"required,min=4,max=32"`
		Env      string              `json:"env" validate:"required,min=1,max=32"`
		ZoneCode string              `json:"zone_code" validate:"required"`
		AppName  string              `json:"app_name" validate:"required"`
		Branch   string              `json:"branch" validate:"required,min=1,max=32"`
		Desc     db.TestPipelineDesc `json:"desc"`
		Status   db.TestTaskStatus   `json:"status"`
		RunCount int                 `json:"run_count"`
	}

	ReqUpdatePipeline struct {
		ID     uint   `json:"id" validate:"required"`
		Name   string `json:"name" validate:"required,min=4,max=32"`
		Branch string `json:"branch" validate:"required,min=1,max=32"`
	}

	TestTask struct {
		TaskID    uint                `json:"task_id" validate:"required"`
		Name      string              `json:"name" validate:"required"`
		AppName   string              `json:"app_name" validate:"required"`
		Env       string              `json:"env" validate:"required"`
		ZoneCode  string              `json:"zone_code" validate:"required"`
		Branch    string              `json:"branch" validate:"required"`
		Desc      db.TestPipelineDesc `json:"desc" validate:"required"`
		GitUrl    string              `json:"git_url"`
		Status    db.TestTaskStatus   `json:"status"`
		CreatedAt time.Time           `json:"created_at"`
	}

	TestTaskEvent struct {
		Type   TestTaskEventType `json:"type"`
		TaskID uint              `json:"task_id"`

		Data json.RawMessage `json:"data"`
	}

	TestTaskStepUpdatePayload struct {
		StepName   string            `json:"step_name"`
		Status     db.TestStepStatus `json:"status"`
		LogsAppend string            `json:"logs_append"` // 考虑到部分任务的日志量较大，这里使用增量日志
	}

	TestTaskUpdateEventPayload struct {
		Status     db.TestTaskStatus `json:"status"`
		LogsAppend string            `json:"logs"`
	}

	TestTaskEventType string

	ReqQueryTestTasks struct {
		PipelineID uint `query:"pipeline_id"`
		Page       uint `query:"page"`
		PageSize   uint `query:"page_size"`
	}

	ReqQueryTaskItem struct {
		TaskID uint `query:"task_id"`
	}

	TestTaskStepStatus struct {
		ID       uint   `json:"id"`
		TaskID   uint   `json:"task_id"`
		StepName string `json:"step_name"`
		Status   string `json:"status"`
		Logs     string `json:"logs"`
	}

	HttpCollectionTestLog struct {
		TestID   uint              `json:"test_id"`
		TestName string            `json:"test_case_name"`
		Action   string            `json:"action"` // output, fail, pass
		Output   *string           `json:"output,omitempty"`
		Result   *xtest.TestResult `json:"result,omitempty"`
	}

	ReqListPipeline struct {
		AppName  string `query:"app_name"`
		ZoneCode string `query:"zone_code"`
		Env      string `query:"env"`
	}

	WorkerZone struct {
		ZoneName  string `json:"zone_name"`
		ZoneCode  string `json:"zone_code"`
		NodeCount int    `json:"node_count"`
	}
)

var (
	TaskUpdateEvent     TestTaskEventType = "task_update"
	TaskStepUpdateEvent TestTaskEventType = "step_update"
)
