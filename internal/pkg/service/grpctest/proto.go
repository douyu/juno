package grpctest

import (
	"fmt"
	"path/filepath"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/store/gorm"
	"github.com/pkg/errors"
)

func Proto() (resp view.RespListGRPCProto, err error) {
	protos := make([]db.GrpcProto, 0)

	err = option.DB.Find(&protos).Error
	if err != nil {
		return nil, err
	}

	for _, proto := range protos {
		resp = append(resp, view.ListGrpcProtoItem{
			ID:          proto.ID,
			AppName:     proto.AppName,
			FileName:    proto.FileName,
			PackageName: proto.PackageName,
		})
	}

	return
}

func MethodDetail(methodID uint) (resp view.RespDetailGrpcMethod, err error) {
	var method db.GrpcServiceMethod
	err = option.DB.Preload("Service", func(db *gorm.DB) *gorm.DB {
		return db.Preload("Proto")
	}).Where("id = ?", methodID).Last(&method).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = fmt.Errorf("method not exists")
			return
		}

		return
	}

	resp = view.RespDetailGrpcMethod{
		ID:      method.ID,
		AppName: method.Service.Proto.AppName,
		Proto: struct {
			ID          uint   `json:"id"`
			FileName    string `json:"file_name"`
			PackageName string `json:"package_name"`
		}{
			ID:          method.Service.ProtoID,
			FileName:    method.Service.Proto.FileName,
			PackageName: method.Service.Proto.PackageName,
		},
		Service: struct {
			ID   uint   `json:"id"`
			Name string `json:"name"`
		}{
			ID:   method.ServiceID,
			Name: method.Service.Name,
		},
		Name:       method.Name,
		Comment:    method.MethodComment,
		InputType:  method.InputType,
		OutputType: method.OutputType,
	}

	return
}

func BindProtoToApp(param view.ReqBindProtoToApp) (err error) {
	var app db.AppInfo
	var proto db.GrpcProto

	err = option.DB.Where("app_name = ?", param.AppName).Last(&app).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("invalid app name")
		}

		return err
	}

	err = option.DB.Where("id = ?", param.ProtoID).Last(&proto).Error
	if err != nil {
		return fmt.Errorf("invalid proto id")
	}

	proto.AppName = app.AppName
	err = option.DB.Save(&proto).Error
	if err != nil {
		return err
	}

	return
}

func AppServiceTree() (resp []view.RespGrpcAppServiceTreeItem, err error) {
	protoList := make([]db.GrpcProto, 0)
	resp = make([]view.RespGrpcAppServiceTreeItem, 0)

	err = option.DB.Where("app_name is not null and app_name != ''").
		Preload("Services").
		Find(&protoList).
		Error

	mapAppProto := make(map[string][]db.GrpcProto) // app_name -> proto
	for _, proto := range protoList {
		mapAppProto[proto.AppName] = append(mapAppProto[proto.AppName], proto)
	}

	for appName, protoList := range mapAppProto {
		item := view.RespGrpcAppServiceTreeItem{
			AppName:  appName,
			Services: make([]view.RespGrpcServiceItem, 0),
		}

		for _, proto := range protoList {
			for _, service := range proto.Services {
				item.Services = append(item.Services, view.RespGrpcServiceItem{
					ID:          service.ID,
					FileName:    proto.FileName,
					PackageName: proto.PackageName,
					ProtoID:     service.ProtoID,
					Name:        service.Name,
				})
			}
		}

		resp = append(resp, item)
	}

	return
}

func Services(appName string) (services []view.RespGrpcServiceMethodItem, err error) {
	var protoList []db.GrpcProto

	err = option.DB.Where("app_name = ?", appName).
		Preload("Services").
		Preload("Services.Methods").
		Preload("Services.Methods.TestCases").
		Find(&protoList).Error
	if err != nil {
		return
	}

	for _, proto := range protoList {
		for _, service := range proto.Services {
			var methods []view.RespListMethodUseCaseItem

			for _, method := range service.Methods {
				var useCases []view.GrpcUseCaseItem

				for _, testCase := range method.TestCases {
					useCases = append(useCases, view.GrpcUseCaseItem{
						ID:       testCase.ID,
						Name:     testCase.Name,
						Input:    testCase.Input,
						Metadata: testCase.Metadata,
					})
				}

				methods = append(methods, view.RespListMethodUseCaseItem{
					GrpcMethodItem: view.GrpcMethodItem{
						ID:          method.ID,
						Name:        method.Name,
						Description: method.MethodComment,
					},
					UseCases: useCases,
				})
			}

			services = append(services, view.RespGrpcServiceMethodItem{
				ID:          service.ID,
				ProtoID:     service.ProtoID,
				FileName:    proto.FileName,
				PackageName: proto.PackageName,
				Name:        service.Name,
				Methods:     methods,
			})
		}
	}

	return
}

func ProtoAbsPath(filename string) string {
	return filepath.Join(option.ProtoDir, filename)
}
