package view

import (
	"fmt"

	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/pkg/model/db"
)

type User struct {
	Uid      int    `json:"uid"`
	Username string `json:"username"`
	Nickname string `json:"nickname"`
	Email    string `json:"email"`
	Avatar   string `json:"avatar"`
}

// ReqUserEvents 获取用户相关事件的入参
type ReqUserEvents struct {
	// FromTime uint `json:"fromTime" valid:"required"` // 获取从什么时候开始的数据
	PageSize uint `json:"pageSize" valid:"required"`
	Page     uint `json:"page" valid:"required"`
}

// RespUserEvents 用户相关事件的出参
type RespUserEvents struct {
	Events     []db.AppEvent     `json:"events"`
	Pagination output.Pagination `json:"pagination"`
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

type ReqGetAppConfig struct {
	Aid uint `json:"aid" query:"aid" valid:"required"`
}

type ReqPostAppConfig struct {
	Aid    uint              `json:"aid" valid:"required"`
	Config db.UserConfigInfo `json:"config" valid:"required"`
}

type ReqPostUserVisit struct {
	Aid      uint   `json:"aid" valid:"required"`
	AppName  string `json:"appName"`   // 项目id
	ZoneCode string `json:"zone_code"` // 环境
	Env      string `json:"env"`       // 环境
	Tab      string `json:"tab"`
	Url      string `json:"url"` // url
}

func (a *ReqPostUserVisit) Check() error {
	if a.Aid == 0 {
		return fmt.Errorf("aid必传")
	}
	if a.Env == "" {
		return fmt.Errorf("env必传")
	}
	if a.Tab == "" {
		return fmt.Errorf("tab必传")
	}
	if a.Url == "" {
		return fmt.Errorf("url必传")
	}
	return nil
}

// GetTabVisit
type ReqGetTabVisit struct {
	StartTime int64 `json:"startTime"`
	EndTime   int64 `json:"endTime"`
}

func (a *ReqGetTabVisit) Check() error {
	if a.StartTime == 0 || a.EndTime == 0 {
		return fmt.Errorf("必须传时间")
	}
	if a.EndTime <= a.StartTime {
		return fmt.Errorf("起止时间不合法")
	}

	if a.EndTime-a.StartTime > 86400*93 {
		return fmt.Errorf("不可查询跨度超过三个月的数据")
	}

	return nil
}

type UserTabVisit struct {
	Uid      uint32           `json:"uid"`
	UserName string           `json:"user_name"`
	AppSum   int              `json:"app_sum"`
	VisitSum int              `json:"visit_sum"`
	AppMap   map[int]struct{} `json:"-"`
}

type TabVisit struct {
	Tab      string `json:"tab"`
	TabName  string `json:"tab_name"`
	VisitSum int    `json:"visit_sum"`
}

type AppTabVisit struct {
	Aid      uint32 `json:"aid"`
	AppName  string `json:"app_name"`
	VisitSum int    `json:"visit_sum"`
}

type VisitStat struct {
	AppVisit  []AppTabVisit  `json:"app_visit"`
	UserVisit []UserTabVisit `json:"user_visit"`
	PageVisit []TabVisit     `json:"page_visit"`
	AppList   []db.AppInfo   `json:"app_list"`
	AppSum    int            `json:"app_sum"`
	AppConf   int            `json:"app_conf"`
}

var (
	TabNameMap = map[string]string{
		"detail":  "详情",
		"monitor": "监控",
		"confgo":  "配置",
		"applog":  "日志",
		"pprof":   "Pprof",
		"etcd":    "Etcd",
		"event":   "事件",
	}
)
