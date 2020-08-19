package view

import (
	"time"

	"github.com/douyu/juno/pkg/model/db"
)

type (
	RespListGRPCProto []ListGrpcProtoItem

	ListGrpcProtoItem struct {
		ID          uint   `json:"id"`
		AppName     string `json:"app_name"`
		FileName    string `json:"file_name"`
		PackageName string `json:"package_name"`
	}

	RespDetailGrpcMethod struct {
		ID      uint   `json:"id"`
		AppName string `json:"app_name"`
		Proto   struct {
			ID          uint   `json:"id"`
			FileName    string `json:"file_name"`
			PackageName string `json:"package_name"`
		} `json:"proto"`
		Service struct {
			ID   uint   `json:"id"`
			Name string `json:"name"`
		} `json:"service"`
		Name       string      `json:"name"`
		Comment    string      `json:"comment"`
		InputType  interface{} `json:"input_type"`
		OutputType interface{} `json:"output_type"`
	}

	RespGrpcAppServiceTreeItem struct {
		AppName  string                `json:"app_name"`
		Services []RespGrpcServiceItem `json:"services"`
	}

	RespGrpcServiceItem struct {
		ID      uint   `json:"id"`
		ProtoID uint   `json:"proto_id"`
		Name    string `json:"name"`
	}

	RespListMethodUseCaseItem struct {
		GrpcMethodItem
		UseCases []GrpcUseCaseItem `json:"use_cases"`
	}

	GrpcMethodItem struct {
		ID          uint   `json:"id"`
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	GrpcUseCaseItem struct {
		ID       uint             `json:"id"`
		Name     string           `json:"name"`
		Input    string           `json:"input"`
		Metadata db.ProtoMetadata `json:"metadata"`
	}

	GrpcUseCaseDetail struct {
		ID          uint             `json:"id"`
		MethodID    uint             `json:"method_id"`
		Uid         uint             `json:"uid"`
		Name        string           `json:"name"`
		Input       string           `json:"input"`
		Metadata    db.ProtoMetadata `json:"metadata"`
		AppName     string           `json:"app_name"`
		ServiceName string           `json:"service_name"`
		MethodName  string           `json:"method_name"`
		Script      string           `json:"script"`
	}

	GrpcResponse struct {
		Error      string             `json:"error"`
		Status     string             `json:"status"`
		TimeCost   int64              `json:"time_cost"`
		Output     string             `json:"output"`
		Logs       db.MapStringString `json:"logs"`
		TestPassed bool               `json:"test_passed"`
	}

	GrpcHistoryListItem struct {
		ID         uint      `json:"id"`
		MethodID   uint      `json:"method_id"`
		MethodName string    `json:"method_name"`
		Status     string    `json:"status"`
		Error      string    `json:"error"`
		TimeCost   int64     `json:"time_cost"`
		TestPassed bool      `json:"test_passed"`
		CreatedAt  time.Time `json:"created_at"`
	}

	GrpcHistoryItem struct {
		ID          uint             `json:"id"`
		MethodID    uint             `json:"method_id"`
		AppName     string           `json:"app_name"`
		ServiceName string           `json:"service_name"`
		MethodName  string           `json:"method_name"`
		Input       string           `json:"input"`
		Metadata    db.ProtoMetadata `json:"metadata"`
		Output      string           `json:"output"`
		Status      string           `json:"status"`
		Error       string           `json:"error"`
		TimeCost    int64            `json:"time_cost"`
		Addr        string           `json:"addr"`
		TestPassed  bool             `json:"test_passed"`
		CreatedAt   time.Time        `json:"created_at"`
	}

	RespGrpcHistoryList struct {
		Pagination Pagination            `json:"pagination"`
		List       []GrpcHistoryListItem `json:"list"`
	}
)
