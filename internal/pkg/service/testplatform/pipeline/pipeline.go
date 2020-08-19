package pipeline

import (
	"encoding/json"

	"github.com/douyu/juno/pkg/model/db"
)

type (
	StepOption func() db.TestPipelineStep

	JobGitPullPayload struct {
		GitHttpUrl  string `json:"http_url"`
		Branch      string `json:"branch"`
		AccessToken string `json:"access_token"`
	}

	JobCodeCheckPayload struct {
	}

	JobUnitTestPayload struct {
		AccessToken string `json:"access_token"`
	}
)

const (
	StepGitPullName   = "git_pull"
	StepCodeCheckName = "code_check"
	StepUnitTestName  = "unit_test"
)

func New(options ...StepOption) *db.TestPipelineDesc {
	p := db.TestPipelineDesc{}

	for _, option := range options {
		p.Steps = append(p.Steps, option())
	}

	return &p
}

func StepSubPipeline(options ...StepOption) StepOption {
	return func() db.TestPipelineStep {
		return db.TestPipelineStep{
			Type:        db.StepTypeSubPipeline,
			JobPayload:  nil,
			SubPipeline: New(options...),
		}
	}
}

func StepJob(name string, jobPayload db.TestJobPayload) StepOption {
	return func() db.TestPipelineStep {
		return db.TestPipelineStep{
			Name:        name,
			Type:        db.StepTypeJob,
			JobPayload:  &jobPayload,
			SubPipeline: nil,
		}
	}
}

func StepGitPull(gitHttpUrl, branch, accessToken string) StepOption {
	return StepJob(
		StepGitPullName,
		JobGitPull(gitHttpUrl, branch, accessToken),
	)
}

func StepCodeCheck() StepOption {
	return StepJob(
		StepCodeCheckName,
		JobCodeCheck(),
	)
}

func StepUnitTest(accessToken string) StepOption {
	return StepJob(
		StepUnitTestName,
		JobUnitTest(accessToken),
	)
}

func JobGitPull(gitHttpUrl, branch, accessToken string) db.TestJobPayload {
	payload, _ := json.Marshal(&JobGitPullPayload{
		GitHttpUrl:  gitHttpUrl,
		Branch:      branch,
		AccessToken: accessToken,
	})
	return db.TestJobPayload{
		Type:    db.JobGitPull,
		Payload: payload,
	}
}

func JobCodeCheck() db.TestJobPayload {
	payload, _ := json.Marshal(JobCodeCheckPayload{})
	return db.TestJobPayload{
		Type:    db.JobCodeCheck,
		Payload: payload,
	}
}

func JobUnitTest(accessToken string) db.TestJobPayload {
	payload, _ := json.Marshal(JobUnitTestPayload{
		AccessToken: accessToken,
	})
	return db.TestJobPayload{
		Type:    db.JobUnitTest,
		Payload: payload,
	}
}
