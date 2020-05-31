package db

import (
	"database/sql/driver"
	"encoding/json"
	"github.com/douyu/juno/pkg/library/util"
)

// AppInfo ...
type AppInfo struct {
	Aid        int          `gorm:"not null;primary_key;AUTO_INCREMENT"json:"aid"`
	Gid        int          `gorm:"not null;comment:'gitlab id'"json:"gid"`
	Name       string       `gorm:"not null;index;comment:'项目中文名'"json:"name"`
	AppName    string       `gorm:"not null;index;comment:'项目英文唯一标识名'"json:"app_name"`
	CreateTime int64        `gorm:"not null;comment:'创建时间'" json:"create_time"`
	UpdateTime int64        `gorm:"not null;comment:'更新时间'"json:"update_time"`
	Level      int          `gorm:"not null;comment:'层级'"json:"level"`
	Lang       string       `gorm:"not null;comment:'语言'"json:"lang"`
	BizDomain  string       `gorm:"not null;comment:'业务类型'"json:"biz_domain"`
	CreatedBy  int          `gorm:"not null;comment:'创建者'"json:"created_by"`
	UpdatedBy  int          `gorm:"not null;comment:'更新者'"json:"updated_by"`
	HttpPort   string       `gorm:"not null;comment:'HTTP端口号'"json:"http_port"`
	RpcPort    string       `gorm:"not null;comment:'RPC端口号'"json:"rpc_port" `
	GovernPort string       `gorm:"not null;comment:'治理端口号'"json:"govern_port" `
	HookId     int          `gorm:"not null;comment:'钩子'"json:"hook_id"`
	Users      UserNameJson `gorm:"not null;type:json;comment:'业务负责人'"json:"users"`
	WebUrl     string       `gorm:"not null;"json:"web_url"`
	ProtoDir   string       `gorm:"not null;"json:"proto_dir"`
	GitUrl     string       `gorm:"not null;"json:"git_url"`
}

// TableName ...
func (AppInfo) TableName() string {
	return "app"
}

func (a *AppInfo) MD5String() string {
	buf, _ := json.Marshal(a)
	return util.Md5(string(buf))
}

type UserNameJson []string

func (c UserNameJson) Value() (driver.Value, error) {
	b, err := json.Marshal(c)
	return string(b), err
}

func (c *UserNameJson) Scan(input interface{}) error {
	return json.Unmarshal(input.([]byte), c)
}

type AppChangeMap struct {
	Id        int    `json:"id" gorm:"not null;column:id"` // id类型?
	AppName   string `json:"appName" gorm:"not null;column:app_name;index"`
	Md5       string `json:"md5" gorm:"not null;column:md5;index"`
	UpdatedAt int64  `json:"updatedAt" gorm:"not null;column:updated_at"`
}

func (t *AppChangeMap) TableName() string {
	return "app_change_map"
}

type AppUserRelation struct {
	Id        int    `json:"id" gorm:"not null;column:id"` // id类型?
	AppName   string `json:"appName" gorm:"not null;column:app_name"`
	UserName  string `json:"userName" gorm:"not null;column:user_name"`
	UpdatedAt int64  `json:"updatedAt" gorm:"not null;column:updated_at"`
}

func (t *AppUserRelation) TableName() string {
	return "app_user_relation"
}
