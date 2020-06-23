package view

import (
	"github.com/douyu/juno/internal/pkg/handler/base"
	"github.com/douyu/juno/pkg/model/db"
)

// ReqUserEvents 获取用户相关事件的入参
type ReqUserEvents struct {
	// FromTime uint `json:"fromTime" valid:"required"` // 获取从什么时候开始的数据
	PageSize uint `json:"pageSize" valid:"required"`
	Page     uint `json:"page" valid:"required"`
}

// RespUserEvents 用户相关事件的出参
type RespUserEvents struct {
	Events     []db.AppEvent   `json:"events"`
	Pagination base.Pagination `json:"pagination"`
}

// ReqUserApps 用户应用的请求
type ReqUserApps struct {
	Page     uint   `json:"page" valid:"required"`
	PageSize uint   `json:"pageSize" valid:"required"`
	QS       string `json:"qs"`
}

// RespUserApps 用户应用响应
type RespUserApps struct {
	Pagination Pagination   `json:"pagination"`
	List       []db.AppInfo `json:"list"`
}

// ReqUserAppViewHistory 应用浏览记录埋点请求
type ReqUserAppViewHistory struct {
	Aid uint `json:"aid" valid:"required"`
}
