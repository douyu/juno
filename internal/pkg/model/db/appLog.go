package db

import "time"

// AppLogAction ..
type AppLogAction string

const (
	// AppLogActionDelete ..
	AppLogActionDelete AppLogAction = "delete"
	// AppLogActionManuallyDelete ..
	AppLogActionManuallyDelete AppLogAction = "manual_delete"
)

// AppLog ...
type AppLog struct {
	ID         int          `gorm:"not null;primary_key;comment:'应用id'" json:"id"`
	Aid        int          `gorm:"not null;comment:'应用id'" json:"aid"`
	Gid        int          `gorm:"not null;comment:'gitlab id'" json:"gid"`
	Name       string       `gorm:"not null;index;comment:'项目中文名'" json:"name"`
	AppName    string       `gorm:"not null;index;comment:'项目英文唯一标识名'" json:"appName"`
	CreateTime int64        `gorm:"not null;comment:'创建时间'" json:"createTime"`
	UpdateTime int64        `gorm:"not null;comment:'更新时间'" json:"updateTime"`
	Level      int          `gorm:"not null;comment:'层级'" json:"level"`
	Lang       string       `gorm:"not null;comment:'语言'" json:"lang"`
	BizDomain  string       `gorm:"not null;" json:"bizDomain"`
	CreatedBy  int          `gorm:"not null;comment:'创建者'" json:"createdBy"`
	UpdatedBy  int          `gorm:"not null;comment:'更新者'" json:"updatedBy"`
	HTTPPort   string       `json:"httpPort" gorm:"not null;column:http_port"`
	RPCPort    string       `json:"rpcPort" gorm:"not null;column:rpc_port"`
	HealthPort string       `json:"healthPort" gorm:"not null;column:health_port"`
	HookID     int          `gorm:"not null;comment:'钩子'" json:"hookId"`
	Users      UserNameJSON `gorm:"not null;type:json" json:"users"`
	WebURL     string       `gorm:"not null;" json:"webUrl"`
	Action     string       `gorm:"null;type:varchar(32);comment:'动作';column:action" json:"action"`
	CreatedAt  time.Time    `gorm:"null;column:created_at;comment:'记录创建时间'" json:"createdAt"`
}

// TableName ...
func (AppLog) TableName() string {
	return "app_log"
}
