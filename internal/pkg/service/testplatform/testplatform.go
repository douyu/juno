package testplatform

import (
	"bytes"
	"context"
	"encoding/gob"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/douyu/jupiter/pkg/xlog"

	"github.com/douyu/juno/internal/pkg/service/clientproxy"
	"github.com/douyu/juno/internal/pkg/service/grpctest"
	"github.com/douyu/juno/internal/pkg/service/grpctest/grpcinvoker"
	"github.com/douyu/juno/internal/pkg/service/grpctest/grpctester"
	"github.com/douyu/juno/internal/pkg/service/testplatform/pipeline"
	"github.com/douyu/juno/internal/pkg/service/testplatform/workerpool"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/jhump/protoreflect/desc"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"golang.org/x/sync/errgroup"
)

func init() {
	gob.Register(desc.MethodDescriptor{})
}

func ListPipeline(params view.ReqListPipeline) (pipelines []view.TestPipelineUV, err error) {
	type PipelineWithTaskStatus struct {
		db.TestPipeline
		Count  int
		Status db.TestTaskStatus
	}
	var pls []PipelineWithTaskStatus

	query := option.DB.Model(&db.TestPipeline{}).
		Select(
			"test_pipeline.*, ? as count, ? as status",
			option.DB.Model(&db.TestPipelineTask{}).Select("count(*) as count").
				Where("pipeline_id = test_pipeline.id").SubQuery(),
			option.DB.Model(&db.TestPipelineTask{}).Select("status").
				Where("pipeline_id = test_pipeline.id").Order("id desc").Limit(1).SubQuery(),
		).Where("app_name = ?", params.AppName).
		Order("id desc")
	if params.Env != "" {
		query = query.Where("env = ?", params.Env)
	}
	if params.ZoneCode != "" && params.ZoneCode != "all" {
		query = query.Where("zone_code = ?", params.ZoneCode)
	}

	err = query.Find(&pls).Error
	if err != nil {
		return
	}

	pipelines = make([]view.TestPipelineUV, len(pls))
	eg := errgroup.Group{}
	for idx, pl := range pls {
		plIdx := idx // copy it
		pl := pl
		eg.Go(func() error {
			desc, err := makePipelineDesc(view.TestPipeline{
				ID:                 pl.ID,
				Name:               pl.Name,
				Env:                pl.Env,
				ZoneCode:           pl.ZoneCode,
				AppName:            pl.AppName,
				Branch:             pl.Branch,
				CodeCheck:          pl.CodeCheck,
				UnitTest:           pl.UnitTest,
				HttpTestCollection: pl.HttpTestCollection,
				GrpcTestAddr:       pl.GrpcTestAddr,
				GrpcTestCases:      pl.GrpcTestCases,
			})
			if err != nil {
				return err
			}

			item := view.TestPipelineUV{
				ID:                 pl.ID,
				Name:               pl.Name,
				Env:                pl.Env,
				ZoneCode:           pl.ZoneCode,
				Desc:               secureFormatDesc(*desc),
				AppName:            pl.AppName,
				Branch:             pl.Branch,
				RunCount:           pl.Count,
				Status:             pl.Status,
				CodeCheck:          pl.CodeCheck,
				UnitTest:           pl.UnitTest,
				HttpTestCollection: pl.HttpTestCollection,
				GrpcTestAddr:       pl.GrpcTestAddr,
				GrpcTestCases:      pl.GrpcTestCases,
			}

			// without lock
			pipelines[plIdx] = item
			return nil
		})
	}

	_ = eg.Wait()

	return
}

//secureFormatDesc 将 desc 中的敏感信息移除
func secureFormatDesc(desc db.TestPipelineDesc) db.TestPipelineDesc {
	var functor func(desc db.TestPipelineDesc) db.TestPipelineDesc

	functor = func(desc db.TestPipelineDesc) db.TestPipelineDesc {
		for idx, step := range desc.Steps {
			if step.Type == db.StepTypeJob && step.JobPayload != nil {
				switch step.JobPayload.Type {
				case db.JobGitPull:
					var payload pipeline.JobGitPullPayload
					err := json.Unmarshal(step.JobPayload.Payload, &payload)
					if err != nil {
						continue
					}

					payload.AccessToken = "******"
					payloadBytes, _ := json.Marshal(payload)
					step.JobPayload.Payload = payloadBytes
				}
			}

			if step.Type == db.StepTypeSubPipeline && step.SubPipeline != nil {
				subPipeline := functor(*step.SubPipeline)
				step.SubPipeline = &subPipeline
			}

			desc.Steps[idx] = step
		}

		return desc
	}

	return functor(desc)
}

func CreatePipeline(uid uint, payload view.TestPipeline) (err error) {
	var pl db.TestPipeline
	pl = db.TestPipeline{
		Name:               payload.Name,
		AppName:            payload.AppName,
		Env:                payload.Env,
		ZoneCode:           payload.ZoneCode,
		CreatedBy:          uid,
		Branch:             payload.Branch,
		CodeCheck:          payload.CodeCheck,
		UnitTest:           payload.UnitTest,
		HttpTestCollection: payload.HttpTestCollection,
		GrpcTestCases:      payload.GrpcTestCases,
		GrpcTestAddr:       payload.GrpcTestAddr,
	}

	err = option.DB.Save(&pl).Error
	if err != nil {
		return
	}

	return
}

func makePipelineDesc(payload view.TestPipeline) (desc *db.TestPipelineDesc, err error) {
	var app db.AppInfo
	var userTaskOptions = make([]pipeline.StepOption, 0)
	var taskOptions = make([]pipeline.StepOption, 0)

	if payload.CodeCheck {
		userTaskOptions = append(userTaskOptions, pipeline.StepCodeCheck())
	}

	if payload.UnitTest {
		userTaskOptions = append(userTaskOptions, pipeline.StepUnitTest(option.GitAccessToken))
	}

	if payload.HttpTestCollection != nil {
		var httpCollection db.HttpTestCollection
		err = option.DB.Preload("TestCases").Where("id = ?", *payload.HttpTestCollection).First(&httpCollection).Error
		if err != nil {
			return
		}

		userTaskOptions = append(userTaskOptions, pipeline.StepHttpTestCollection(httpCollection, httpCollection.TestCases))
	}

	if len(payload.GrpcTestCases) > 0 {
		var taskOption pipeline.StepOption
		taskOption, err = makeGrpcTestCases(payload.GrpcTestAddr, payload.GrpcTestCases)
		if err != nil {
			//...
		} else {
			userTaskOptions = append(userTaskOptions, taskOption)
		}
	}

	if len(userTaskOptions) == 0 {
		err = fmt.Errorf("最少要有一个执行的任务")
		return
	}

	err = option.DB.Where("app_name = ?", payload.AppName).First(&app).Error
	if err != nil {
		return
	}

	taskOptions = append(taskOptions, pipeline.StepGitPull(
		app.WebURL,
		payload.Branch,
		option.GitAccessToken,
	))

	userTaskOptions = append(userTaskOptions, pipeline.Parallel(true))
	taskOptions = append(taskOptions, pipeline.StepSubPipeline(
		userTaskOptions...,
	))

	desc = pipeline.New(taskOptions...)
	return
}

func makeGrpcTestCases(addr string, cases db.PipelineGrpcTestCases) (stepOption pipeline.StepOption, err error) {
	var testCases []view.GrpcTestCase

	for _, testCase := range cases {
		var testCaseItem db.GrpcTestCase
		var input grpctester.RequestInput
		var metadata = make(grpctester.Metadata)
		var methodDescriptor *desc.MethodDescriptor

		err = option.DB.Preload("Method").
			Preload("Method.Service").
			Preload("Method.Service.Proto").
			Where("id = ?", testCase.TestCase).
			First(&testCaseItem).Error
		if err != nil {
			err = errors.Wrapf(err, "can not found testcase: %d", testCase.TestCase)
			return
		}

		method := testCaseItem.Method
		service := method.Service
		proto := service.Proto
		methodDescriptor, err = grpcinvoker.GetMethodDescriptor(
			proto.PackageName+"."+service.Name+"."+method.Name,
			grpctest.ProtoAbsPath(proto.FileName),
		)
		if err != nil {
			err = errors.Wrapf(err, "parse method failed")
			return
		}

		err = json.Unmarshal([]byte(testCaseItem.Input), &input)
		if err != nil {
			return
		}

		for _, item := range testCaseItem.Metadata {
			metadata[item.Key] = item.Value
		}

		buf := bytes.NewBuffer(nil)
		_ = gob.NewEncoder(buf).Encode(*methodDescriptor)

		testCases = append(testCases, view.GrpcTestCase{
			RequestPayload: grpctester.RequestPayload{
				PackageName:      proto.PackageName,
				ServiceName:      service.Name,
				MethodName:       method.Name,
				Input:            input,
				MetaData:         metadata,
				ProtoFile:        proto.FileName,
				Host:             addr,
				Timeout:          10 * time.Second,
				TestScript:       testCaseItem.Script,
				MethodDescriptor: methodDescriptor,
			},
		})
	}

	stepOption = pipeline.StepGrpcTest(
		addr,
		testCases,
	)
	return
}

func UpdatePipeline(uid uint, payload view.TestPipeline) (err error) {
	var pl db.TestPipeline

	err = option.DB.Where("id = ?", payload.ID).Preload("App").First(&pl).Error
	if err != nil {
		return
	}

	pl.Name = payload.Name
	pl.UpdatedBy = uid
	pl.Branch = payload.Branch
	pl.CodeCheck = payload.CodeCheck
	pl.UnitTest = payload.UnitTest
	pl.HttpTestCollection = payload.HttpTestCollection
	pl.GrpcTestCases = payload.GrpcTestCases
	pl.GrpcTestAddr = payload.GrpcTestAddr

	err = option.DB.Save(&pl).Error
	if err != nil {
		return
	}

	return
}

func DeletePipeline(id int) (err error) {
	err = option.DB.Where("id = ?", id).Delete(&db.TestPipeline{}).Error
	if err != nil {
		return
	}

	return
}

func DispatchTask(uid, pipelineID uint) (err error) {
	if !option.Enable {
		return fmt.Errorf("测试平台功能未启用，请联系管理员")
	}

	var pl db.TestPipeline

	err = option.DB.Where("id = ?", pipelineID).First(&pl).Error
	if err != nil {
		return
	}

	desc, err := makePipelineDesc(view.TestPipeline{
		Name:               pl.Name,
		Env:                pl.Env,
		ZoneCode:           pl.ZoneCode,
		AppName:            pl.AppName,
		Branch:             pl.Branch,
		CodeCheck:          pl.CodeCheck,
		UnitTest:           pl.UnitTest,
		HttpTestCollection: pl.HttpTestCollection,
		GrpcTestCases:      pl.GrpcTestCases,
	})
	if err != nil {
		return
	}

	task := db.TestPipelineTask{
		Name:       pl.Name,
		PipelineID: pipelineID,
		Branch:     pl.Branch,
		AppName:    pl.AppName,
		Env:        pl.Env,
		ZoneCode:   pl.ZoneCode,
		Desc:       *desc,
		Status:     db.TestTaskStatusPending,
		Logs:       "",
		CreatedBy:  uid,
	}

	err = func() (err error) {
		tx := option.DB.Begin()
		defer func() {
			if err != nil {
				tx.Rollback()
				return
			}
		}()

		err = tx.Save(&task).Error
		if err != nil {
			return err
		}

		err = dispatchToWorker(task)
		if err != nil {
			return err
		}

		tx.Commit()
		return nil
	}()
	if err != nil {
		return err
	}

	go runGrpcTest(task.ID, pl)

	return
}

func runGrpcTest(taskId uint, pl db.TestPipeline) {
	var testSuccess = true
	var saveProgress = func(status db.TestStepStatus, log interface{}) {
		var logContent []byte
		if log != nil {
			logContent, _ = json.Marshal(log)
		}

		data := view.TestTaskStepUpdatePayload{
			StepName:   pipeline.StepGrpcTestName,
			Status:     status,
			LogsAppend: string(logContent) + "\n",
		}
		dataBytes, _ := json.Marshal(data)

		_ = onTaskStepUpdate(view.TestTaskEvent{
			Type:   view.TaskStepUpdateEvent,
			TaskID: taskId,
			Data:   dataBytes,
		})
	}

	defer func() {
		if testSuccess {
			saveProgress(db.TestStepStatusSuccess, nil)
		} else {
			saveProgress(db.TestStepStatusFailed, nil)
		}
	}()

	tester := grpctester.New()
	for _, testCase := range pl.GrpcTestCases {
		var testCaseItem db.GrpcTestCase
		var input grpctester.RequestInput
		var metadata = make(grpctester.Metadata)
		var methodDescriptor *desc.MethodDescriptor

		err := option.DB.Where("id = ?", testCase.TestCase).
			Preload("Method").
			Preload("Method.Service").
			Preload("Method.Service.Proto").
			First(&testCaseItem).
			Error
		if err != nil {
			xlog.Error("runGrpcTest: cannot found test case", xlog.Uint("testcaseid", testCase.TestCase))
			continue
		}

		method := testCaseItem.Method
		service := method.Service
		proto := service.Proto

		err = json.Unmarshal([]byte(testCaseItem.Input), &input)
		if err != nil {
			xlog.Error("runGrpcTest: invalid input", xlog.String("err", err.Error()))
			continue
		}

		for _, item := range testCaseItem.Metadata {
			metadata[item.Key] = item.Value
		}

		methodDescriptor, err = grpcinvoker.GetMethodDescriptor(
			proto.PackageName+"."+service.Name+"."+method.Name,
			grpctest.ProtoAbsPath(proto.FileName),
		)
		if err != nil {
			err = errors.Wrapf(err, "parse method failed")
			continue
		}

		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		testResult := tester.Run(ctx, grpctester.RequestPayload{
			PackageName:      proto.PackageName,
			ServiceName:      service.Name,
			MethodName:       method.Name,
			Input:            input,
			MetaData:         metadata,
			Host:             pl.GrpcTestAddr,
			Timeout:          30 * time.Second,
			TestScript:       testCaseItem.Script,
			MethodDescriptor: methodDescriptor,
		})
		cancel()

		if !testResult.Success {
			testSuccess = false
		}

		errStr := ""
		if testResult.Error != nil {
			errStr = testResult.Error.Error()
		}

		saveProgress(db.TestStepStatusRunning, map[string]interface{}{
			"test":         testCaseItem.Name,
			"package":      proto.PackageName,
			"service":      service.Name,
			"method":       testCaseItem.Method.Name,
			"filename":     proto.FileName,
			"input":        input,
			"logs":         testResult.Logs,
			"time_cost":    testResult.TimeCost,
			"error":        errStr,
			"success":      testResult.Success,
			"raw_response": testResult.RawResponse,
		})
	}
}

func UpdateTaskStatus(params view.TestTaskEvent) (err error) {
	switch params.Type {
	case view.TaskUpdateEvent:
		err = onTaskUpdate(params)
	case view.TaskStepUpdateEvent:
		err = onTaskStepUpdate(params)
	}

	return
}

func onTaskUpdate(params view.TestTaskEvent) error {
	var task db.TestPipelineTask
	var eventData view.TestTaskUpdateEventPayload

	err := json.Unmarshal(params.Data, &eventData)
	if err != nil {
		return errors.Wrapf(err, "invalid event data")
	}

	tx := option.DB.Begin()
	{
		err = tx.Where("id = ?", params.TaskID).First(&task).Error
		if err != nil {
			tx.Rollback()
			return errors.Wrapf(err, "cannot found task where id = %d", task.ID)
		}

		task.Status = eventData.Status
		task.Logs += eventData.LogsAppend

		err = tx.Save(&task).Error
		if err != nil {
			tx.Rollback()
			return errors.Wrapf(err, "save task failed")
		}
	}
	tx.Commit()

	return nil
}

func onTaskStepUpdate(params view.TestTaskEvent) (err error) {
	var task db.TestPipelineTask
	var taskStepStatus db.TestPipelineStepStatus
	var steps []db.TestPipelineStepStatus
	var eventData view.TestTaskStepUpdatePayload

	err = json.Unmarshal(params.Data, &eventData)
	if err != nil {
		return errors.Wrapf(err, "invalid event data")
	}

	tx := option.DB.Begin()
	{
		err = option.DB.Where("id = ?", params.TaskID).First(&task).Error
		if err != nil {
			tx.Rollback()
			return
		}

		err = tx.Where("task_id = ? and step_name = ?", params.TaskID, eventData.StepName).First(&taskStepStatus).Error
		if err != nil && err != gorm.ErrRecordNotFound {
			tx.Rollback()
			return
		}

		taskStepStatus.TaskID = params.TaskID
		taskStepStatus.StepName = eventData.StepName
		taskStepStatus.Status = eventData.Status
		taskStepStatus.Logs += eventData.LogsAppend

		err = tx.Save(&taskStepStatus).Error
		if err != nil {
			tx.Rollback()
			return
		}

		err = tx.Select("id, task_id, step_name, status").
			Where("task_id = ?", task.ID).Find(&steps).Error
		if err != nil {
			tx.Rollback()
			return
		}

		if len(steps) >= task.Desc.JobCount() {
			// 检查是否全部结束
			finish, success := checkTaskFinish(steps)
			if !finish {
				task.Status = db.TestTaskStatusRunning
			} else if success {
				task.Status = db.TestTaskStatusSuccess
			} else {
				task.Status = db.TestTaskStatusFailed
			}
		}

		err = tx.Save(&task).Error
		if err != nil {
			tx.Rollback()
			return
		}
	}
	err = tx.Commit().Error
	if err != nil {
		return
	}

	return
}

func checkTaskFinish(steps []db.TestPipelineStepStatus) (finished, success bool) {
	finished = true
	success = true
	for _, step := range steps {
		if step.Status == db.TestStepStatusFailed {
			success = false
		} else if step.Status != db.TestStepStatusSuccess {
			finished = false
			success = false
			break
		}
	}

	return
}

func dispatchToWorker(task db.TestPipelineTask) error {
	var app db.AppInfo

	err := option.DB.Where("app_name = ?", task.AppName).First(&app).Error
	if err != nil {
		return err
	}

	node, err := workerpool.Instance().Select(task.ZoneCode)
	if err != nil {
		return err
	}

	taskBytes, _ := json.Marshal(view.TestTask{
		TaskID:   task.ID,
		Name:     task.Name,
		AppName:  task.AppName,
		Env:      task.Env,
		ZoneCode: task.ZoneCode,
		Branch:   task.Branch,
		Desc:     task.Desc,
		GitUrl:   app.WebURL,
	})

	resp, err := clientproxy.ClientProxy.HttpPost(
		view.UniqZone{
			Env:  task.Env,
			Zone: task.ZoneCode,
		},
		view.ReqHTTPProxy{
			Address: fmt.Sprintf("%s:%d", node.IP, node.Port),
			URL:     "/api/v1/testTask/dispatch",
			Type:    http.MethodPost,
			Body:    taskBytes,
		},
	)
	if err != nil {
		return err
	}

	respObj := struct {
		Code int    `json:"code"`
		Msg  string `json:"msg"`
	}{}

	err = json.Unmarshal(resp.Body(), &respObj)
	if err != nil {
		err = errors.Wrapf(err, "unmarshall response failed")
		return err
	}

	if respObj.Code != 0 {
		err = errors.Errorf("dispatch failed: %s", respObj.Msg)
		return err
	}

	return nil
}

func ListTasks(params view.ReqQueryTestTasks) (list []view.TestTask, pagination view.Pagination, err error) {
	var tasks []db.TestPipelineTask
	var eg errgroup.Group

	pageSize := params.PageSize
	page := params.Page
	if pageSize == 0 {
		pageSize = 10
	}
	if pageSize > 100 {
		pageSize = 100
	}
	// page starts from 1
	if page == 0 {
		page = 1
	}

	offset := pageSize * (page - 1)

	pagination.PageSize = int(pageSize)
	pagination.Current = int(page)

	query := option.DB.Where("pipeline_id = ?", params.PipelineID).Find(&tasks)
	eg.Go(func() error {
		return query.Count(&pagination.Total).Error
	})
	eg.Go(func() error {
		return query.Offset(offset).Limit(pageSize).Order("id desc").Find(&tasks).Error
	})

	err = eg.Wait()
	if err != nil {
		return
	}

	for _, task := range tasks {
		list = append(list, view.TestTask{
			TaskID:    task.ID,
			Name:      task.Name,
			AppName:   task.AppName,
			Env:       task.Env,
			ZoneCode:  task.ZoneCode,
			Branch:    task.Branch,
			Desc:      task.Desc,
			Status:    task.Status,
			CreatedAt: task.CreatedAt,
		})
	}

	return
}

func TaskSteps(taskId uint) (list []view.TestTaskStepStatus, err error) {
	var steps []db.TestPipelineStepStatus
	err = option.DB.Where("task_id = ?", taskId).Find(&steps).Error
	if err != nil {
		return
	}

	for _, step := range steps {
		list = append(list, view.TestTaskStepStatus{
			ID:       step.ID,
			TaskID:   step.TaskID,
			StepName: step.StepName,
			Status:   string(step.Status),
			Logs:     step.Logs,
		})
	}

	return
}

func WorkerZones() (zones []view.WorkerZone, err error) {
	type WorkerNodeWithCount struct {
		db.WorkerNode
		Count int
	}
	var workerNodes []WorkerNodeWithCount

	err = option.DB.Group("zone_code").Select("*, count(host_name) as count").Find(&workerNodes).Error
	if err != nil {
		return
	}

	for _, node := range workerNodes {
		zones = append(zones, view.WorkerZone{
			ZoneName:  node.ZoneName,
			ZoneCode:  node.ZoneCode,
			NodeCount: node.Count,
		})
	}

	return
}
