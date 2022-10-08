package db

import (
	"database/sql/driver"
	"encoding/json"
)

type (
	HttpTestCollection struct {
		ModelT
		CreatedBy uint   `json:"created_by"` // 创建人ID
		AppName   string `json:"app_name"`
		Name      string `json:"name"`

		TestCases []HttpTestCase `gorm:"foreignKey:CollectionID" json:"-"`
	}

	HttpTestCase struct {
		ModelT
		CollectionID uint          `json:"collection_id"`
		Name         string        `json:"name"`
		URL          string        `json:"url"`
		Method       string        `json:"method"`
		Query        HttpTestParam `gorm:"type:json" json:"query"`
		Headers      HttpTestParam `gorm:"type:json" json:"headers"`
		ContentType  string        `json:"content_type"`
		Body         string        `json:"body"`
		Script       string        `gorm:"type:longtext;" json:"script"`

		Collection HttpTestCollection `gorm:"foreignKey:CollectionID" json:"-"`
	}

	HttpTestLog struct {
		ModelT

		OperatorType string // 执行人类型
		OperatorID   uint   // 执行人ID

		AppName string
		Name    string

		// Request
		URL         string
		Method      string
		Query       HttpTestParam `gorm:"type:json"`
		Headers     HttpTestParam `gorm:"type:json"`
		ContentType string
		Body        string `gorm:"type:longtext"`

		// Response
		ResponseBody    string         `gorm:"type:longtext"`
		ResponseHeaders MapStringArray `gorm:"type:json"`
		Size            int64
		Cost            int64
		Code            int
		Status          string
		Error           string
		TestLogs        MapStringString `gorm:"type:json"` // 测试脚本产生的Log
	}

	HttpTestParam []HttpTestParamItem

	HttpTestParamItem struct {
		Key         string `json:"key"`
		Value       string `json:"value"`
		Description string `json:"description"`
	}
)

func (h *HttpTestParam) Scan(val interface{}) error {
	return json.Unmarshal(val.([]byte), h)
}

func (h HttpTestParam) Value() (val driver.Value, err error) {
	if h == nil {
		val = "[]"
		return
	}
	val, err = json.Marshal(&h)
	return
}

func (HttpTestCollection) TableName() string {
	return "http_test_collection"
}

func (HttpTestCase) TableName() string {
	return "http_test_case"
}

func (HttpTestLog) TableName() string {
	return "http_test_log"
}
