package view

import "github.com/douyu/juno/pkg/model/db"

type (
	ReqMethodDetail struct {
		ID uint `query:"id" validate:"required"`
	}

	ReqBindProtoToApp struct {
		ProtoID uint   `json:"proto_id" validate:"required"` // PB 文件路径
		AppName string `json:"app_name" validate:"required"`
	}

	ReqListGRPCUseCases struct {
		ServiceID uint `query:"service_id" validate:"required"`
	}

	ReqCreateGRPCUseCase struct {
		MethodID uint             `json:"method_id" validate:"required"`
		Name     string           `json:"name" validate:"required"`
		Input    string           `json:"input"`
		Metadata db.ProtoMetadata `json:"metadata"`
	}

	ReqUpdateGRPCUseCase struct {
		ID       uint             `json:"id" validate:"required"`
		MethodID uint             `json:"method_id" validate:"required"`
		Name     string           `json:"name" validate:"required"`
		Input    string           `json:"input"`
		Metadata db.ProtoMetadata `json:"metadata"`
	}

	ReqQueryGRPCUseCase struct {
		MethodID uint `query:"id"`
	}

	ReqQueryGrpcService struct {
		ServiceID uint `query:"service_id" validate:"required"`
	}

	ReqGrpcHistoryList struct {
		Page      uint `query:"page"`
		PageSize  uint `query:"page_size"`
		ServiceID uint `query:"service_id" validate:"required"`
	}

	ReqQueryHistoryItem struct {
		HistoryID uint `query:"history_id" validate:"required"`
	}

	ReqSendGRPCRequest struct {
		ReqCreateGRPCUseCase
		Address string `json:"address" validate:"required"`
	}

	ReqUseCaseDetail struct {
		ID uint `json:"id"`
	}

	MakeGrpcRequest struct {
		MethodID uint             `json:"method_id"`
		Input    string           `json:"input"`
		Address  string           `json:"address"`
		Metadata db.ProtoMetadata `json:"metadata"`
	}
)
