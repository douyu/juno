package testworker

import (
	"context"
	"encoding/gob"
	"encoding/json"
	"fmt"
	"net/url"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/jhump/protoreflect/desc"
	"go.uber.org/zap"

	"github.com/beeker1121/goque"
	"github.com/douyu/juno/internal/pkg/packages/xtest"
	"github.com/douyu/juno/internal/pkg/service/codeplatform"
	"github.com/douyu/juno/internal/pkg/service/httptest"
	"github.com/douyu/juno/internal/pkg/service/testplatform/pipeline"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/go-resty/resty/v2"
	"github.com/pkg/errors"
	log "github.com/sirupsen/logrus"
	"golang.org/x/sync/errgroup"
)

type (
	TestWorker struct {
		option      Option
		client      *resty.Client
		taskChan    chan view.TestTask
		queue       *goque.Queue
		jobHandlers map[db.TestJobType]JobHandler
	}

	Option struct {
		JunoAddress    string
		Token          string
		ParallelWorker int
		RepoStorageDir string
		QueueDir       string
	}

	RespConsumeJob struct {
		Code int            `json:"code"`
		Msg  string         `json:"msg"`
		Data *view.TestTask `json:"data"`
	}

	ProgressLog struct {
		ProgressLog bool         `json:"progress_log"` // always true
		Type        progressType `json:"type"`         // "error" | "start"
		Msg         string       `json:"msg"`
	}

	progressType string
	JobHandler   func(task view.TestTask, name string, p json.RawMessage) error
)

var (
	instance *TestWorker
	initOnce sync.Once

	progressStart   progressType = "start"
	progressSuccess progressType = "success"
	progressFailed  progressType = "failed"
)

func init() {
	gob.Register(desc.MethodDescriptor{})
}

func Instance() *TestWorker {
	initOnce.Do(func() {
		instance = &TestWorker{
			taskChan: make(chan view.TestTask),
		}

		instance.jobHandlers = map[db.TestJobType]JobHandler{
			db.JobGitPull:   instance.gitPull,
			db.JobHttpTest:  instance.httpTest,
			db.JobUnitTest:  instance.unitTest,
			db.JobCodeCheck: instance.codeCheck,
			//db.JobGrpcTest:  instance.grpcTest,
		}
	})

	return instance
}

func (t *TestWorker) Init(option Option) (err error) {
	t.option = option
	t.client = resty.New().
		SetHostURL(option.JunoAddress).
		SetTimeout(20*time.Second).
		SetHeader("Token", option.Token)
	t.queue, err = goque.OpenQueue(option.QueueDir)
	if err != nil {
		return
	}

	t.Start()

	return
}

func (t *TestWorker) Start() {
	go t.startPull()
	go t.startWork()
}

func (t *TestWorker) Push(task view.TestTask) error {
	_, err := t.queue.EnqueueObjectAsJSON(task)
	if err != nil {
		xlog.Error("enqueue failed", xlog.String("err", err.Error()))
		return err
	}

	return nil
}

func (t *TestWorker) startPull() {
	for {
		item, err := t.queue.Dequeue()
		if err != nil {
			if err == goque.ErrEmpty {
				time.Sleep(1 * time.Second)
			} else {
				xlog.Error("pull item failed. wait for 10 second and retry", xlog.String("err", err.Error()))
				time.Sleep(10 * time.Second)
			}

			continue
		}

		if item == nil {
			continue
		}

		var task view.TestTask
		err = item.ToObjectFromJSON(&task)
		if err != nil {
			xlog.Error("unmarshall task failed", xlog.String("err", err.Error()))

			continue
		}

		t.taskChan <- task
	}
}

func (t *TestWorker) startWork() {
	for i := 0; i < t.option.ParallelWorker; i++ {
		go t.work()
	}
}

func (t *TestWorker) work() {
	for {
		task := <-t.taskChan

		t.notifyTaskUpdate(task.TaskID, db.TestTaskStatusRunning, "")

		err := t.runTask(task, task.Desc)
		if err != nil {
			t.notifyTaskUpdate(task.TaskID, db.TestTaskStatusFailed, fmt.Sprintf("task failed. err = %s", err.Error()))
		} else {
			t.notifyTaskUpdate(task.TaskID, db.TestTaskStatusSuccess, "")
		}
	}
}

func (t *TestWorker) runTask(task view.TestTask, desc db.TestPipelineDesc) (err error) {
	eg := errgroup.Group{}
	for _, step := range desc.Steps {
		if desc.Parallel {
			_step := step
			eg.Go(func() error {
				return t.runStep(task, _step)
			})
		} else {
			err = t.runStep(task, step)
			if err != nil {
				xlog.Error("TestWorker.runTask failed, stop running", xlog.String("err", err.Error()))
				break
			}
		}
	}
	if err != nil {
		return
	}

	err = eg.Wait()
	if err != nil {
		return
	}

	return
}

func (t *TestWorker) runStep(task view.TestTask, step db.TestPipelineStep) (err error) {
	switch step.Type {
	case db.StepTypeJob:
		if step.JobPayload == nil {
			return fmt.Errorf("platform.JobPayload = nil when step.Type = StepTypeJob. step = %v", step)
		}

		err = t.runJob(task, step.Name, step.JobPayload)
		if err != nil {
			return
		}

	case db.StepTypeSubPipeline:
		if step.SubPipeline != nil {
			err = t.runTask(task, *step.SubPipeline)
			if err != nil {
				return
			}
		} else {
			return fmt.Errorf("platform.SubPipeline = nil when step.Type = StepTypeSubPipeline. step = %v", step)
		}
	}

	return
}

func (t *TestWorker) runJob(task view.TestTask, name string, payload *db.TestJobPayload) (err error) {
	handler, ok := t.jobHandlers[payload.Type]
	if ok {
		t.notifyProgress(task.TaskID, name, db.TestTaskStatusRunning, progressStart, "")
		err = handler(task, name, payload.Payload)

		if err != nil {
			xlog.Error("runJob failed", xlog.String("err", err.Error()))
		}
	} else {
		xlog.Error("invalid job type: ", zap.Any("type", payload.Type))
	}

	return
}

func (t *TestWorker) notifyTaskEvent(taskId uint, event view.TestTaskEventType, data interface{}) {
	req := t.client.R()

	eventData, _ := json.Marshal(data)
	body := view.TestTaskEvent{
		Type:   event,
		TaskID: taskId,
		Data:   eventData,
	}

	req.SetBody(body)

	resp, err := req.Post("/api/v1/worker/testTask/update")
	if err != nil {
		log.Error("TestWorker.notifyStepStatus", xlog.String("err", err.Error()))
		return
	}

	respObj := struct {
		Code int    `json:"code"`
		Msg  string `json:"msg"`
	}{}
	err = json.Unmarshal(resp.Body(), &respObj)
	if err != nil {
		log.Error("TestWorker: json unmarshall failed", xlog.String("err", err.Error()))
		return
	}

}

func (t *TestWorker) notifyTaskUpdate(taskId uint, status db.TestTaskStatus, logsAppend string) {
	t.notifyTaskEvent(taskId, view.TaskUpdateEvent, view.TestTaskUpdateEventPayload{
		Status:     status,
		LogsAppend: logsAppend,
	})
}

func (t *TestWorker) notifyStepStatus(taskId uint, stepName string, status db.TestStepStatus, logsAppend string) {
	data := view.TestTaskStepUpdatePayload{
		StepName:   stepName,
		Status:     status,
		LogsAppend: logsAppend,
	}

	t.notifyTaskEvent(taskId, view.TaskStepUpdateEvent, data)
}

func (t *TestWorker) codeBaseDir(task view.TestTask) string {
	return filepath.Join(t.option.RepoStorageDir, task.AppName, task.Branch)
}

func (t *TestWorker) gitPull(task view.TestTask, name string, p json.RawMessage) (err error) {
	var progress string
	var payload pipeline.JobGitPullPayload

	defer func() {
		if err != nil {
			// failed
			t.notifyStepStatus(task.TaskID, name, db.TestStepStatusFailed, fmt.Sprintf("%s\nerr = %s", progress, err.Error()))
		} else {
			// success
			t.notifyStepStatus(task.TaskID, name, db.TestStepStatusSuccess, progress)
		}
	}()

	err = json.Unmarshal(p, &payload)
	if err != nil {
		return errors.Wrapf(err, "unmarshall payload into pipeline.JobGitPullPayload failed. err = %s", err.Error())
	}

	code := codeplatform.New(codeplatform.Option{
		StorageDir: t.codeBaseDir(task),
		Token:      payload.AccessToken,
	})

	progress, err = code.CloneOrPull(payload.GitHttpUrl, t.codeBaseDir(task))
	if err != nil {
		return err
	}

	return nil
}

func (t *TestWorker) unitTest(task view.TestTask, name string, p json.RawMessage) (err error) {
	var payload pipeline.JobUnitTestPayload
	printer := NewPrinter(128)

	defer func() {
		logs := printer.Flush()

		if err != nil {
			t.notifyStepStatus(task.TaskID, name, db.TestStepStatusFailed, string(logs))
			t.notifyProgress(task.TaskID, name, db.TestTaskStatusFailed, progressFailed, err.Error())
		} else {
			t.notifyStepStatus(task.TaskID, name, db.TestTaskStatusSuccess, string(logs))
			t.notifyProgress(task.TaskID, name, db.TestTaskStatusFailed, progressSuccess, "")
		}
	}()

	err = json.Unmarshal(p, &payload)
	if err != nil {
		return errors.Wrapf(err, "unmarshall payload into pipeline.JobUnitTestPayload failed. err = %s", err.Error())
	}

	gitUrlParsed, err := url.Parse(task.GitUrl)
	if err != nil {
		return errors.Wrapf(err, "invalid GitUrl")
	}

	cmdArray := []string{
		fmt.Sprintf("git config --global url.\"https://juno:%s@%s/\".insteadOf \"https://%s/\"", payload.AccessToken, gitUrlParsed.Host, gitUrlParsed.Host),
		fmt.Sprintf("cd %s", t.codeBaseDir(task)),
		"go test -v -json ./...",
	}
	cmd := exec.Command("sh", "-c", strings.Join(cmdArray, " && "))
	cmd.Stdout = printer
	cmd.Stderr = printer
	finishChan := make(chan error, 1)
	timer := time.NewTimer(5 * time.Minute)

	go func() {
		finishChan <- cmd.Run()
		_ = exec.Command(fmt.Sprintf("git config --global --remove-section url.\"https://juno:%s@%s/\"", payload.AccessToken, gitUrlParsed.Host)).Run()
	}()

	for {
		select {
		case logs := <-printer.C:
			fmt.Printf("\n-> printer logs: %s\n", logs)
			t.notifyStepStatus(task.TaskID, name, db.TestStepStatusRunning, logs)

		case <-timer.C: // timeout
			close(finishChan)
			err = cmd.Process.Kill()
			if err != nil {
				err = errors.Wrap(err, "unitTest process kill failed")
				return
			}

			return fmt.Errorf("unitTest process timeout. killed")

		case err = <-finishChan:
			return
		}
	}
}

func (t *TestWorker) notifyProgress(taskId uint, stepName string, status db.TestStepStatus, progressType progressType, msg string) {
	logs, _ := json.Marshal(ProgressLog{
		ProgressLog: true,
		Type:        progressType,
		Msg:         msg,
	})
	t.notifyStepStatus(taskId, stepName, status, string(logs)+"\n")
}

func (t *TestWorker) codeCheck(task view.TestTask, name string, p json.RawMessage) error {
	dir := filepath.Join(t.codeBaseDir(task), "/...")
	dir = strings.Replace(dir, string(filepath.Separator), "/", -1)
	linter := NewLinter(dir)
	problems, err := linter.Lint()
	logs := ""
	for _, problem := range problems {
		problemBytes, _ := json.Marshal(problem)
		logs += string(problemBytes) + "\n"
	}
	t.notifyStepStatus(task.TaskID, name, db.TestStepStatusRunning, logs)

	if err != nil {
		t.notifyProgress(task.TaskID, name, db.TestStepStatusFailed, progressFailed, err.Error())
	} else {
		t.notifyProgress(task.TaskID, name, db.TestStepStatusSuccess, progressSuccess, "")
	}

	return nil
}

func (t *TestWorker) httpTest(task view.TestTask, name string, p json.RawMessage) error {
	var payload pipeline.JobHttpTestPayload
	var testSuccess = true

	err := json.Unmarshal(p, &payload)
	if err != nil {
		return err
	}

	notifyStepProgress := func(log view.HttpCollectionTestLog) {
		respBytes, _ := json.Marshal(log)
		t.notifyStepStatus(task.TaskID, name, db.TestStepStatusRunning, string(respBytes)+"\n")
	}

	tester := xtest.New(
		xtest.WithInterpreter(xtest.InterpreterTypeJS),
		xtest.WithGlobalStore(true),
	)
	for _, testCase := range payload.TestCases {
		reqParams := view.ReqSendHttpRequest{
			ID:          testCase.ID,
			Name:        testCase.Name,
			URL:         testCase.URL,
			Method:      testCase.Method,
			Query:       testCase.Query,
			Headers:     testCase.Headers,
			ContentType: testCase.ContentType,
			Body:        testCase.Body,
			Script:      testCase.Script,
		}
		req := httptest.NewRequest(resty.New(), testCase.Script, reqParams, tester)

		// http 测试遇到错误继续往后执行
		err = func() error {
			ctx, cancelFunc := context.WithTimeout(context.Background(), 30*time.Second)
			defer cancelFunc()

			resp, err := req.Send(ctx)
			if err != nil {
				return err
			}

			notifyStepProgress(view.HttpCollectionTestLog{
				TestID:   testCase.ID,
				TestName: testCase.Name,
				Action:   "output",
				Output:   nil,
				Result:   &resp,
			})

			err = resp.Error
			if err != nil {
				return err
			}

			if !resp.Success {
				return fmt.Errorf("test failed")
			}

			return err
		}()
		if err != nil {
			testSuccess = false

			output := err.Error()
			notifyStepProgress(view.HttpCollectionTestLog{
				TestID:   testCase.ID,
				TestName: testCase.Name,
				Action:   "fail",
				Output:   &output,
				Result:   nil,
			})
		} else {
			notifyStepProgress(view.HttpCollectionTestLog{
				TestID:   testCase.ID,
				TestName: testCase.Name,
				Action:   "pass",
				Output:   nil,
				Result:   nil,
			})
		}
	}

	if testSuccess {
		t.notifyStepStatus(task.TaskID, name, db.TestStepStatusSuccess, "")
	} else {
		t.notifyStepStatus(task.TaskID, name, db.TestStepStatusFailed, "")
	}

	return nil
}

//func (t *TestWorker) grpcTest(task view.TestTask, name string, p json.RawMessage) (err error) {
//	var payload pipeline.JobGrpcTestPayload
//	var testSuccess = true
//	var tester = grpctester.New()
//	var notify = func(status db.TestStepStatus, log interface{}) {
//		var logContent []byte
//		if log != nil {
//			logContent, _ = json.Marshal(log)
//		}
//		t.notifyStepStatus(task.TaskID, name, status, string(logContent))
//	}
//
//	err = json.Unmarshal(p, &payload)
//	if err != nil {
//		return
//	}
//
//	defer func() {
//		if testSuccess {
//			notify(db.TestStepStatusSuccess, nil)
//		} else {
//			notify(db.TestStepStatusFailed, nil)
//		}
//	}()
//
//	for _, testCase := range payload.TestCases {
//		var methodDesc desc.MethodDescriptor
//		err = gob.NewDecoder(bytes.NewReader(testCase.MethodDescriptor)).Decode(&methodDesc)
//		if err != nil {
//			continue
//		}
//
//		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
//		testResult := tester.Run(ctx, grpctester.RequestPayload{
//			PackageName:      testCase.PackageName,
//			ServiceName:      testCase.ServiceName,
//			MethodName:       testCase.MethodName,
//			Input:            testCase.Input,
//			MetaData:         testCase.MetaData,
//			ProtoFile:        testCase.ProtoFile,
//			Host:             testCase.Host,
//			Timeout:          testCase.Timeout,
//			TestScript:       testCase.TestScript,
//			MethodDescriptor: &methodDesc,
//		})
//
//		cancel()
//
//		if !testResult.Success {
//			testSuccess = false
//		}
//
//		notify(db.TestStepStatusRunning, &testResult)
//	}
//
//	return
//}
