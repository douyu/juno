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
		Body        string

		// Response
		ResponseBody    string
		ResponseHeaders MapStringArray `gorm:"type:json"`
		Size            int64
		Cost            int64
		Code            int
		Status          string
		Error           string
	}

	HttpTestParam []struct {
		Key         string `json:"key"`
		Value       string `json:"value"`
		Description string `json:"description"`
	}

	MapStringArray map[string][]string
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
