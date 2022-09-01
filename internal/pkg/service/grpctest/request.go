package grpctest

import (
	"context"
	"encoding/json"
	"fmt"
	"path/filepath"
	"time"

	"github.com/douyu/juno/internal/pkg/packages/xtest"
	"github.com/douyu/juno/internal/pkg/service/grpctest/grpcinvoker"
	"github.com/douyu/juno/internal/pkg/service/grpctest/grpctester"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/store/gorm"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/pkg/errors"
	"golang.org/x/sync/errgroup"
)

func UserMakeRequest(uid uint, req view.MakeGrpcRequest) (response view.GrpcResponse, err error) {
	var grpcTestLog db.GrpcTestLog

	response = view.GrpcResponse{
		Status:     "success",
		TestPassed: false,
	}

	result, err := SendSingleRequest(req)
	response.TimeCost = result.TimeCost.Milliseconds()
	response.Logs = result.Logs
	if err != nil {
		response.Status = "failed"
		response.Error = err.Error()
	} else {
		resp, ok := result.RawResponse.(grpctester.Response)
		if !ok {
			err = fmt.Errorf("invalid response")
			response.Error = err.Error()
		} else {
			respBytes, _ := json.Marshal(resp)
			response.Output = string(respBytes)
		}
	}

	if result.Error != nil {
		response.Error = result.Error.Error()
		response.Status = "failed"
	}

	response.TestPassed = result.Success

	defer func() {
		if err != nil {
			xlog.Error("UserMakeRequest", xlog.String("err", "marshall response failed:"+err.Error()))
		}

		//grpc request log
		grpcTestLog = db.GrpcTestLog{
			MethodID:     req.MethodID,
			OperatorType: "user",
			OperatorID:   uid,
			Input:        req.Input,
			Output:       response.Output,
			Status:       response.Status,
			Error:        response.Error,
			TimeCost:     result.TimeCost.Milliseconds(),
			Addr:         req.Address,
			Metadata:     req.Metadata,
			Script:       req.Script,
			TestPassed:   result.Success,
		}

		if err != nil {
			grpcTestLog.Error = err.Error()
			grpcTestLog.Status = "error"
		} else {
			grpcTestLog.Status = "success"
		}

		go func() {
			err := option.DB.Save(&grpcTestLog).Error
			if err != nil {
				xlog.Error("grpctest.UserMakeRequest", xlog.String("save grpcLog failed", err.Error()))
			}
		}()
	}()

	return response, err
}

func SendSingleRequest(req view.MakeGrpcRequest) (result xtest.TestResult, err error) {
	tester := grpctester.New()
	return sendRequestCallGRPC(tester, req)
}

func sendRequestCallGRPC(tester *grpctester.GrpcTester, req view.MakeGrpcRequest) (result xtest.TestResult, err error) {
	var input grpctester.RequestInput
	var method db.GrpcServiceMethod

	err = json.Unmarshal([]byte(req.Input), &input)
	if err != nil {
		return
	}

	err = option.DB.Where("id = ?", req.MethodID).
		Preload("Service", func(db *gorm.DB) *gorm.DB {
			return db.Preload("Proto")
		}).
		First(&method).Error
	if err != nil {
		return
	}

	metadata := make(grpctester.Metadata)
	for _, item := range req.Metadata {
		metadata[item.Key] = item.Value
	}

	// request payload
	payload := grpctester.RequestPayload{
		PackageName: method.Service.Proto.PackageName,
		ServiceName: method.Service.Name,
		MethodName:  method.Name,
		Input:       input,
		MetaData:    metadata,
		ProtoFile:   filepath.Join(option.ProtoDir, method.Service.Proto.FileName),
		Host:        req.Address,
		Timeout:     1 * time.Second,
		TestScript:  req.Script,
	}

	// 获取 method methodDescriptor
	methodDescriptor, err := grpcinvoker.GetMethodDescriptor(
		fmt.Sprintf("%s.%s.%s", payload.PackageName, payload.ServiceName, payload.MethodName),
		payload.ProtoFile,
	)
	if err != nil {
		err = errors.Wrap(err, "get method descriptor failed")
		return
	}
	payload.MethodDescriptor = methodDescriptor

	// 执行测试用例
	result = tester.Run(context.Background(), payload)

	return
}

func RequestHistoryList(param view.ReqGrpcHistoryList, uid uint) (resp view.RespGrpcHistoryList, err error) {
	var logs []db.GrpcTestLog
	var eg errgroup.Group

	query := option.DB.Model(&db.GrpcTestLog{}).
		Where("grpc_test_log.operator_id = ? and grpc_test_log.operator_type = ?", uid, "user").
		Joins("left join grpc_service_method on grpc_test_log.method_id = grpc_service_method.id").
		Joins("left join grpc_proto_service on grpc_service_method.service_id = grpc_proto_service.id").
		Where("grpc_proto_service.id = ?", param.ServiceID)

	eg.Go(func() error {
		page := param.Page
		pageSize := param.PageSize
		if pageSize > 100 {
			pageSize = 100
		}
		if pageSize == 0 {
			pageSize = 10
		}
		offset := page * pageSize

		resp.Pagination.PageSize = int(pageSize)
		resp.Pagination.Current = int(page)

		err = query.Preload("Method").
			Order("id desc").
			Limit(pageSize).
			Offset(offset).
			Find(&logs).Error
		if err != nil {
			return err
		}

		for _, log := range logs {
			resp.List = append(resp.List, view.GrpcHistoryListItem{
				ID:         log.ID,
				MethodID:   log.MethodID,
				MethodName: log.Method.Name,
				Status:     log.Status,
				Error:      log.Error,
				TimeCost:   log.TimeCost,
				TestPassed: log.TestPassed,
				CreatedAt:  log.CreatedAt,
			})
		}

		return nil
	})

	eg.Go(func() error {
		err = query.Count(&resp.Pagination.Total).Error
		if err != nil {
			return err
		}

		return nil
	})

	err = eg.Wait()
	if err != nil {
		return
	}

	return
}

func RequestHistoryItem(id uint) (history view.GrpcHistoryItem, err error) {
	var log db.GrpcTestLog

	err = option.DB.Where("id = ?", id).
		Preload("Method", func(db *gorm.DB) *gorm.DB {
			return db.Preload("Service", func(db *gorm.DB) *gorm.DB {
				return db.Preload("Proto")
			})
		}).
		First(&log).Error
	if err != nil {
		return
	}

	history = view.GrpcHistoryItem{
		ID:          log.ID,
		MethodID:    log.MethodID,
		AppName:     log.Method.Service.Proto.AppName,
		ServiceName: log.Method.Service.Name,
		MethodName:  log.Method.Name,
		Input:       log.Input,
		Metadata:    log.Metadata,
		Output:      log.Output,
		Status:      log.Status,
		Error:       log.Error,
		TimeCost:    log.TimeCost,
		Addr:        log.Addr,
		CreatedAt:   log.CreatedAt,
	}

	return
}
