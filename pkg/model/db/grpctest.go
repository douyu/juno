package db

import (
	"database/sql/driver"
	"encoding/json"
)

type (
	GrpcProto struct {
		ModelT

		AppName     string
		FileName    string
		PackageName string

		Services []GrpcProtoService `gorm:"foreignKey:ProtoID"`
	}

	GrpcProtoService struct {
		ModelT

		ProtoID uint
		Name    string

		Proto   GrpcProto           `gorm:"foreignKey:ProtoID"`
		Methods []GrpcServiceMethod `gorm:"foreignKey:ServiceID"`
	}

	// Protobuf Method 描述，通过解析 PB 文件获取到 PB 描述
	GrpcServiceMethod struct {
		ModelT

		ServiceID     uint        `gorm:"column:service_id;"`
		Name          string      `gorm:"column:name;not null;"`
		MethodComment string      `gorm:"column:method_comment;"`
		InputName     string      `gorm:"column:input_name;not null;"`
		InputType     ProtoFields `gorm:"column:input_type;not null;type:json"`  // 入参类型描述
		OutputType    ProtoFields `gorm:"column:output_type;not null;type:json"` // 返回值类型描述
		OutputName    string      `gorm:"column:output_name;not null;"`

		Service   GrpcProtoService `gorm:"foreignKey:ServiceID"`
		TestCases []GrpcTestCase   `gorm:"foreignKey:MethodID"`
	}

	// GRPC 测试用例
	GrpcTestCase struct {
		ModelT
		MethodID uint
		Uid      uint
		Name     string
		Input    string        `gorm:"type:longtext;"`
		Metadata ProtoMetadata `gorm:"type:longtext;"`
		Script   string        `gorm:"type:longtext;"`

		Method GrpcServiceMethod `gorm:"foreignKey:MethodID"`
	}

	// GRPC 测试日志
	GrpcTestLog struct {
		ModelT

		MethodID uint

		OperatorType string // 执行方的类型
		OperatorID   uint   // 执行方ID

		Input      string        `gorm:"type:longtext;"`
		Output     string        `gorm:"type:longtext;"`
		Status     string        `gorm:"type:varchar(20);"` // 状态
		Error      string        `gorm:"type:longtext;"`
		TimeCost   int64         `gorm:"type:int unsigned;"`
		Addr       string        `gorm:"type:varchar(30)"` // 访问的地址
		Metadata   ProtoMetadata `gorm:"type:longtext;"`
		Script     string        `gorm:"type:longtext;"`
		TestPassed bool

		Method GrpcServiceMethod `gorm:"foreignKey:MethodID"`
	}

	// map: 字段名 => 类型描述
	ProtoFields map[string]ProtoField

	ProtoField struct {
		JsonName    string      `json:"json_name"`
		Type        int32       `json:"type"`
		Label       int32       `json:"label"`
		Number      int32       `json:"number"`
		IsRepeated  bool        `json:"is_repeated"`
		MessageType ProtoFields `json:"message_type"`
		Comment     string      `json:"comment"`
	}

	ProtoMetadata []struct {
		Key         string `json:"key"`
		Value       string `json:"value"`
		Description string `json:"description"`
	}
)

func (c ProtoFields) Value() (driver.Value, error) {
	b, err := json.Marshal(c)
	return string(b), err
}

func (c *ProtoFields) Scan(input interface{}) error {
	return json.Unmarshal(input.([]byte), c)
}

func (m ProtoMetadata) Value() (driver.Value, error) {
	b, err := json.Marshal(m)
	return string(b), err
}

func (m *ProtoMetadata) Scan(input interface{}) error {
	return json.Unmarshal(input.([]byte), m)
}

func (GrpcProto) TableName() string {
	return "grpc_proto"
}

func (GrpcProtoService) TableName() string {
	return "grpc_proto_service"
}

func (GrpcServiceMethod) TableName() string {
	return "grpc_service_method"
}

func (GrpcTestLog) TableName() string {
	return "grpc_test_log"
}

func (GrpcTestCase) TableName() string {
	return "grpc_test_case"
}
