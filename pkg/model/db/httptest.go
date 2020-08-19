package db

import (
	"database/sql/driver"
	"encoding/json"

	"github.com/jinzhu/gorm"
)

type (
	HttpTestCollection struct {
		gorm.Model
		CreatedBy uint // 创建人ID
		AppName   string
		Name      string

		TestCases []HttpTestCase `gorm:"foreignKey:CollectionID"`
	}

	HttpTestCase struct {
		gorm.Model
		CollectionID uint
		Name         string
		URL          string
		Method       string
		Query        HttpTestParam `gorm:"type:json"`
		Headers      HttpTestParam `gorm:"type:json"`
		ContentType  string
		Body         string
		Script       string `gorm:"type:longtext;"`

		Collection HttpTestCollection `gorm:"foreignKey:CollectionID"`
	}

	HttpTestLog struct {
		gorm.Model

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

	MapStringArray  map[string][]string
	MapStringString map[string]string
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

func (h *MapStringArray) Scan(val interface{}) error {
	return json.Unmarshal(val.([]byte), h)
}

func (h MapStringArray) Value() (val driver.Value, err error) {
	if h == nil {
		val = "{}"
		return
	}
	val, err = json.Marshal(&h)
	return
}

func (h *MapStringString) Scan(val interface{}) error {
	return json.Unmarshal(val.([]byte), h)
}

func (h MapStringString) Value() (val driver.Value, err error) {
	if h == nil {
		val = "{}"
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
