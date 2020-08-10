package grpctest

import (
	"fmt"

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
	useCase.Script = param.Script

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
		Script:      useCase.Script,
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
