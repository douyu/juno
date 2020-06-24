package db

import (
	"github.com/douyu/juno/pkg/model/event"
)

// AppEvent ..
type AppEvent struct {
	ID            int    `gorm:"primary_key,not null;AUTO_INCREMENT" json:"id"` // 数据id
	AppName       string `gorm:"not null;index:idx_app_name" json:"app_name"`   // 应用名称
	Aid           int    `gorm:"not null;index:idx_aid" json:"aid"`             // 应用id
	ZoneCode      string `gorm:"not null;index:idx_zone_code" json:"zone_code"` // 环境
	Env           string `gorm:"not null;index:idx_env" json:"env"`             // 环境
	HostName      string `gorm:"not null;" json:"host_name"`
	UserName      string `gorm:"not null;" json:"user_name"`                     // 用户名
	UID           int    `gorm:"not null;" json:"uid"`                           // 用户id
	Operation     string `gorm:"not null; index:idx_operation" json:"operation"` // 操作
	CreateTime    int64  `gorm:"" json:"create_time"`                            // 事件发生时间
	Source        string `gorm:"not null;index:idx_source" json:"source"`        // 事件来源
	Metadata      string `gorm:"not null;type:text" json:"metadata"`             // 事件内容
	OperationName string `gorm:"-" json:"operation_name"`
	SourceName    string `gorm:"-" json:"source_name"`
}

// TableName ..
func (a *AppEvent) TableName() string {
	return "app_event"
}

// HandleOperationName ..
func (a *AppEvent) HandleOperationName() {
	a.OperationName = event.OperationMap[a.Operation]
}

// HandleSourceName ..
func (a *AppEvent) HandleSourceName() {
	a.SourceName = event.SourceMap[a.Source]
}
