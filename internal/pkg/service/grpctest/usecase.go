package grpctest

import (
	"encoding/json"
	"fmt"
	"path/filepath"
	"time"

	"github.com/douyu/juno/internal/pkg/service/grpctest/grpcinvoker"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/jinzhu/gorm"
)

func UseCases(uid uint, param view.ReqListGRPCUseCases) (resp []view.RespListMethodUseCaseItem, err error) {
	methods := make([]db.GrpcServiceMethod, 0)
	err = option.DB.Where("service_id = ?", param.ServiceID).
		Preload("TestCases", func(db *gorm.DB) *gorm.DB {
			return db.Where("uid = ?", uid)
		}).Find(&methods).Error
	if err != nil {
		return
	}

	for _, method := range methods {
		item := view.RespListMethodUseCaseItem{
			GrpcMethodItem: view.GrpcMethodItem{
				ID:          method.ID,
				Name:        method.Name,
				Description: method.MethodComment,
			},
			UseCases: make([]view.GrpcUseCaseItem, 0),
		}

		for _, testCase := range method.TestCases {
			item.UseCases = append(item.UseCases, view.GrpcUseCaseItem{
				ID:       testCase.ID,
				Name:     testCase.Name,
				Input:    testCase.Input,
				Metadata: testCase.Metadata,
			})
		}

		resp = append(resp, item)
	}

	return
}

func CreateUseCase(uid uint, param view.ReqCreateGRPCUseCase) (useCaseView view.GrpcUseCaseItem, err error) {
	var useCase db.GrpcTestCase

	tx := option.DB.Begin()
	err = tx.Where("name = ?", param.Name).Last(&useCase).Error
	if !gorm.IsRecordNotFoundError(err) {
		tx.Rollback()
		if err != nil {
			return
		}

		err = fmt.Errorf("存在同名的用例")
		return
	}

	useCase = db.GrpcTestCase{
		MethodID: param.MethodID,
		Uid:      uid,
		Name:     param.Name,
		Input:    param.Input,
		Metadata: param.Metadata,
	}

	err = tx.Save(&useCase).Error
	if err != nil {
		tx.Rollback()
		return
	}

	tx.Commit()

	useCaseView = view.GrpcUseCaseItem{
		ID:       useCase.ID,
		Name:     useCase.Name,
		Input:    useCase.Input,
		Metadata: useCase.Metadata,
	}

	return
}

func UpdateUseCase(uid uint, param view.ReqUpdateGRPCUseCase) (useCaseView view.GrpcUseCaseItem, err error) {
	var useCase db.GrpcTestCase

	tx := option.DB.Begin()
	err = tx.Where("id = ? and uid = ?", param.ID, uid).Last(&useCase).Error
	if err != nil {
		tx.Rollback()

		if gorm.IsRecordNotFoundError(err) {
			err = fmt.Errorf("该用例不存在")
		}

		return
	}

	useCase.Name = param.Name
	useCase.Input = param.Input
	useCase.Metadata = param.Metadata

	err = tx.Save(&useCase).Error
	if err != nil {
		tx.Rollback()
		return
	}

	tx.Commit()

	useCaseView = view.GrpcUseCaseItem{
		ID:       useCase.ID,
		Name:     useCase.Name,
		Input:    useCase.Input,
		Metadata: useCase.Metadata,
	}

	return
}

func UseCaseDetail(id uint) (resp view.GrpcUseCaseDetail, err error) {
	var useCase db.GrpcTestCase

	err = option.DB.
		Preload("Method", func(db *gorm.DB) *gorm.DB {
			return db.Preload("Service", func(db *gorm.DB) *gorm.DB {
				return db.Preload("Proto")
			})
		}).
		Where("id = ?", id).First(&useCase).Error
	if err != nil {
		return
	}

	resp = view.GrpcUseCaseDetail{
		ID:          useCase.ID,
		MethodID:    useCase.MethodID,
		Uid:         useCase.Uid,
		Name:        useCase.Name,
		Input:       useCase.Input,
		Metadata:    useCase.Metadata,
		AppName:     useCase.Method.Service.Proto.AppName,
		ServiceName: useCase.Method.Service.Name,
		MethodName:  useCase.Method.Name,
	}

	return
}

func DeleteUseCase(uid, id uint) (err error) {
	query := option.DB.Where("id = ?", id).Delete(&db.GrpcTestCase{})
	err = query.Error
	if err != nil {
		return err
	}

	if query.RowsAffected == 0 {
		return fmt.Errorf("未找到该用例")
	}

	return nil
}

func SendRequestCallGRPC(req view.MakeGrpcRequest) (response view.GrpcResponse, err error) {
	defer func() {
		if err != nil {
			response.Status = "fail"
			response.Error = err.Error()
		} else {
			response.Status = "success"
		}
	}()

	var method db.GrpcServiceMethod

	err = option.DB.Where("id = ?", req.MethodID).
		Preload("Service", func(db *gorm.DB) *gorm.DB {
			return db.Preload("Proto")
		}).
		First(&method).Error
	if err != nil {
		return
	}

	metadataMapString := make(map[string]string)
	for _, item := range req.Metadata {
		metadataMapString[item.Key] = item.Value
	}
	metadataStr, _ := json.Marshal(metadataMapString)

	timeBegin := time.Now()
	resp, err := grpcinvoker.MakeRequest(grpcinvoker.ReqProtoConfig{
		PackageName: method.Service.Proto.PackageName,
		ServiceName: method.Service.Name,
		MethodName:  method.Name,
		InputParams: req.Input,
		MetaData:    string(metadataStr),
		ProtoFile:   filepath.Join(option.ProtoDir, method.Service.Proto.FileName),
		Host:        req.Address,
		Timeout:     1 * time.Second,
	})
	if err != nil {
		return
	}

	response.TimeCost = int64(time.Now().Sub(timeBegin)) / int64(time.Millisecond)

	respBytes, err := resp.MarshalJSON()
	if err != nil {
		return
	}

	response.Output = string(respBytes)

	return
}
