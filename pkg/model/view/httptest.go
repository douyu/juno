package view

import (
	"time"

	"github.com/douyu/juno/pkg/model/db"
)

type (
	HttpTestCollection struct {
		ID        uint           `json:"id"`
		AppName   string         `json:"app_name"`
		Name      string         `json:"name"`
		CreatedAt time.Time      `json:"created_at"`
		TestCases []HttpTestCase `json:"test_cases"`
	}

	RespListHttpTestCollection struct {
		Pagination Pagination           `json:"pagination"`
		List       []HttpTestCollection `json:"list"`
	}

	HttpTestCase struct {
		ID          uint             `json:"id" validate:"required"`
		Name        string           `json:"name"`
		URL         string           `json:"url"`
		Method      string           `json:"method"`
		Query       db.HttpTestParam `json:"query"`
		Headers     db.HttpTestParam `json:"headers"`
		ContentType string           `json:"content_type"`
		Body        string           `json:"body"`
	}

	HttpTestResponse struct {
		Code     int                 `json:"code"`
		Body     string              `json:"body"`
		Headers  map[string][]string `json:"headers"`
		Size     int64               `json:"size"`
		TimeCost int64               `json:"time_cost"`
	}

	HttpTestLog struct {
		OperatorType string `json:"operator_type"` // 执行人类型
		OperatorID   uint   `json:"operator_id"`   // 执行人ID

		Name string `json:"name"`

		// Request
		URL         string           `json:"url"`
		Method      string           `json:"method"`
		Query       db.HttpTestParam `json:"query"`
		Headers     db.HttpTestParam `json:"headers"`
		ContentType string           `json:"content_type"`
		Body        string           `json:"body"`

		// Response
		ResponseBody    string            `json:"response_body"`
		ResponseHeaders db.MapStringArray `json:"response_headers"`
		Size            int64             `json:"size"`
		Cost            int64             `json:"cost"`
		Code            int               `json:"code"`
	}

	// 列表项，移除大字段和列表展示不需要的字段
	HttTestLogListItem struct {
		ID           uint   `json:"id"`
		OperatorType string `json:"operator_type"` // 执行人类型
		OperatorID   uint   `json:"operator_id"`   // 执行人ID

		Name string `json:"name"`

		// Request
		URL    string `json:"url"`
		Method string `json:"method"`

		// Response
		Size int64 `json:"size"`
		Cost int64 `json:"cost"`
		Code int   `json:"code"`
	}

	RespListHttpTestHistory struct {
		List       []HttTestLogListItem `json:"list"`
		Pagination Pagination           `json:"pagination"`
	}
)
