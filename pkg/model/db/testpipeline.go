package db

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
)

type (
	TestPipeline struct {
		ModelT
		Name               string
		AppName            string
		Env                string `gorm:"type:varchar(32)"`
		ZoneCode           string
		Branch             string
		CodeCheck          bool
		UnitTest           bool
		HttpTestCollection *int
		GrpcTestAddr       string
		GrpcTestCases      PipelineGrpcTestCases `gorm:"type:json"` // GRPC 测试用例列表
		CreatedBy          uint
		UpdatedBy          uint

		App AppInfo `gorm:"foreignKey:AppName" json:"-"`
	}

	//TestPipelineTask 任务下发执行的单位
	TestPipelineTask struct {
		ModelT
		PipelineID uint
		Name       string
		AppName    string
		Branch     string
		Env        string           `gorm:"type:varchar(32)"`
		ZoneCode   string           `gorm:"type:varchar(32)"`
		Desc       TestPipelineDesc `gorm:"type:json"`
		Status     TestTaskStatus   // pending, running, failed, success
		Logs       string           `gorm:"type:longtext"`
		CreatedBy  uint

		StepStatus []TestPipelineStepStatus `gorm:"foreignKey:TaskID" json:"-"`
	}

	//TestPipelineStepStatus 任务阶段状态
	TestPipelineStepStatus struct {
		ModelT
		TaskID   uint
		StepName string
		Status   TestStepStatus // waiting, running, failed, success
		Logs     string         `gorm:"type:longtext"`
	}

	StepType int

	TestPipelineDesc struct {
		Parallel bool               `json:"parallel"`
		Steps    []TestPipelineStep `json:"steps"`
	}

	TestPipelineStep struct {
		Type        StepType          `json:"type"`         // Step Type
		Name        string            `json:"name"`         // MUST be unique under one TestPipelineDesc
		SubPipeline *TestPipelineDesc `json:"sub_pipeline"` // MUST be set when Type equals StepTypeSubPipeline
		JobPayload  *TestJobPayload   `json:"job_payload"`  // MUST be set when Type equals StepTypeJob
	}

	TestJobPayload struct {
		Type    TestJobType     `json:"type"`
		Payload json.RawMessage `json:"payload"`
	}

	PipelineGrpcTestCases []struct {
		Service  uint `json:"service"`
		Method   uint `json:"method"`
		TestCase uint `json:"testcase"`
	}

	TestJobType    string
	TestTaskStatus string
	TestStepStatus string
)

const (
	StepTypeSubPipeline StepType = 1 // 子Pipeline类型，当前Step拥有多个子Step
	StepTypeJob                  = 2 // 任务类型，当前Step执行某个任务

	JobGitPull   TestJobType = "git_pull"
	JobUnitTest  TestJobType = "unit_test"
	JobCodeCheck TestJobType = "code_check"
	JobHttpTest  TestJobType = "http_test"
	JobGrpcTest  TestJobType = "grpc_test"

	TestTaskStatusPending TestTaskStatus = "pending"
	TestTaskStatusRunning                = "running"
	TestTaskStatusFailed                 = "failed"
	TestTaskStatusSuccess                = "success"

	TestStepStatusWaiting TestStepStatus = "waiting"
	TestStepStatusRunning                = "running"
	TestStepStatusFailed                 = "failed"
	TestStepStatusSuccess                = "success"
)

func (*TestPipeline) TableName() string {
	return "test_pipeline"
}

func (*TestPipelineTask) TableName() string {
	return "test_pipeline_task"
}

func (*TestPipelineStepStatus) TableName() string {
	return "test_pipeline_step_status"
}

func (d TestPipelineDesc) Value() (driver.Value, error) {
	return json.Marshal(d)
}

func (d *TestPipelineDesc) Scan(input interface{}) error {
	return json.Unmarshal(input.([]byte), d)
}

func (d PipelineGrpcTestCases) Value() (driver.Value, error) {
	return json.Marshal(d)
}

func (d *PipelineGrpcTestCases) Scan(input interface{}) error {
	return json.Unmarshal(input.([]byte), d)
}

// ValidatePipelineDesc 检查 TestPipelineDesc 是否有效
func (d TestPipelineDesc) ValidatePipelineDesc() error {
	names := make(map[string]bool)

	var functor func(desc TestPipelineDesc) error
	functor = func(desc TestPipelineDesc) error {
		for _, step := range desc.Steps {
			if names[step.Name] {
				return fmt.Errorf("step name conflicts: %s", step.Name)
			}
			names[step.Name] = true

			switch step.Type {
			case StepTypeSubPipeline:
				if step.SubPipeline == nil {
					return fmt.Errorf("step.SubPipeline MUST not be nil when type = StepTypeSubPipeline")
				}

				err := functor(*step.SubPipeline)
				if err != nil {
					return err
				}
			case StepTypeJob:
				if step.JobPayload == nil {
					return fmt.Errorf("step.JobPayload MUST not be nil when type = StepTypeJob")
				}
			}
		}

		return nil
	}

	return functor(d)
}

func (d TestPipelineDesc) JobCount() int {
	count := 0

	var functor func(desc TestPipelineDesc)
	functor = func(desc TestPipelineDesc) {
		for _, step := range desc.Steps {
			switch step.Type {
			case StepTypeSubPipeline:
				if step.SubPipeline == nil {
					continue
				}

				functor(*step.SubPipeline)
			case StepTypeJob:
				count += 1
			}
		}
	}

	functor(d)

	return count
}
