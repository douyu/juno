package db

import (
	"database/sql/driver"
	"encoding/json"
	"time"
)

type Proto struct {
	Id             int         `gorm:"not null;"json:"id"`
	FileName       string      `gorm:"not null;"json:"fileName"`
	AppName        string      `gorm:"not null;"json:"appName"`
	ServiceName    string      `gorm:"not null;"json:"serviceName"`
	MethodName     string      `gorm:"not null;"json:"methodName"`
	PackageName    string      `gorm:"not null;"json:"packageName"`
	InputName      string      `gorm:"not null;"json:"inputName"`
	InputType      ProtoFields `gorm:"not null;type:json"json:"inputType"`
	InputParamTmpl string      `gorm:"not null;"json:"inputParamTmpl"`
	OutputName     string      `gorm:"not null;"json:"outputName"`
	OutputType     ProtoFields `gorm:"not null;type:json"json:"outputType"`
	Extra          string      `gorm:"not null;"json:"extra"`
	CreatedAt      time.Time   `gorm:""json:"createdAt"`
	UpdatedAt      time.Time   `gorm:""json:"updatedAt"`
	DeletedAt      *time.Time  `gorm:""json:"deletedAt"`
}

func (Proto) TableName() string {
	return "proto"
}

type ProtoInputField struct {
	JsonName    string      `json:"jsonName"`
	Type        int32       `json:"type"`
	Label       int32       `json:"label"`
	Number      int32       `json:"number"`
	IsRepeated  bool        `json:"isRepeated"`
	MessageType ProtoFields `json:"messageType"`
}

// map: 字段名 => 类型描述
type ProtoFields map[string]ProtoInputField

func (c ProtoFields) Value() (driver.Value, error) {
	b, err := json.Marshal(c)
	return string(b), err
}

func (c *ProtoFields) Scan(input interface{}) error {
	return json.Unmarshal(input.([]byte), c)
}
