package db

import "encoding/json"

type RegInfoOutPut struct {
	ID         int    `json:"id"`
	AppName    string `json:"app_name"`
	HostName   string `json:"host_name"`
	RegIP      string `json:"ip" gorm:"column:ip"`
	RegKey     string `json:"reg_key"`
	UpdateTime string `json:"update_time"`
	StartTime  string `json:"start_time"`
	VcsInfo    string `json:"vcs_info"`
}

type NodeStatus struct {
	IP        string `json:"ip"`
	HostName  string `json:"host_name"`
	StartTime string `json:"start_time"`
	KeyStatus string `json:"key_status"`
	Env       string `json:"env"`
}

type AppNodeInfoLog struct {
	Id         int    `json:"id" gorm:"column:id"` // id类型?
	AppName    string `json:"app_name" gorm:"column:app_name"`
	Aid        int    `json:"aid" gorm:"column:aid"`             // id类型?
	ZoneCode   string `json:"zone_code" gorm:"column:zone_code"` // id类型?
	NodeKey    string `json:"node_key" gorm:"column:node_key"`
	BuildTime  string `json:"build_time" gorm:"column:build_time"`
	HostName   string `json:"host_name" gorm:"column:host_name"`
	Pid        int    `json:"pid" gorm:"column:pid"`                 // id类型?
	UpdateTime int64  `json:"update_time" gorm:"column:update_time"` // 时间类型?
	VcsInfo    string `json:"vcs_info" gorm:"column:vcs_info"`
	CreatedAt  int64  `json:"created_at" gorm:"column:created_at"`
	UserName   string `json:"user_name" gorm:"column:user_name"`
	Action     string `json:"action" gorm:"column:action"`
}

func (t *AppNodeInfoLog) TableName() string {
	return "app_node_info_log"
}

// 节点操作日志
type AppRegInfoLog struct {
	Id        int    `json:"id" gorm:"column:id"`   // id类型?
	Aid       int    `json:"aid" gorm:"column:aid"` // id类型?
	AppName   string `json:"app_name" gorm:"column:app_name"`
	IdcId     int    `json:"idc_id" gorm:"column:idc_id"` // id类型?
	RegKey    string `json:"reg_key" gorm:"column:reg_key"`
	KeyStatus string `json:"key_status" gorm:"column:key_status"`
	Addr      string `json:"addr" gorm:"column:addr"`
	Ip        string `json:"ip" gorm:"column:ip"`
	Port      string `json:"port" gorm:"column:port"`
	CreatedAt int    `json:"created_at" gorm:"column:created_at"`
	UserName  string `json:"user_name" gorm:"column:user_name"`
	Action    string `json:"action" gorm:"column:action"`
}

func (t *AppRegInfoLog) TableName() string {
	return "app_reg_info_log"
}

type RegAllData struct {
	Register ServerRegData    `json:"register"`
	Config   ServerConfigData `json:"config"`
}

type ServerRegData struct {
	RegKey   string        `json:"reg_key"`
	RegValue GovernRegData `json:"reg_value"`
}

type ServerConfigData struct {
	ConfigKey   string           `json:"config_key"`
	ConfigValue GovernConfigData `json:"config_value"`
}

type GovernRegData struct {
	Name    string                 `json:"name"`
	Schema  string                 `json:"schema"`
	Address string                 `json:"address"`
	Labels  map[string]interface{} `json:"labels"`
}

type GovernConfigData struct {
	Config struct {
		Enable bool   `json:"enable"`
		Weight int32  `json:"weight"`
		Group  string `json:"group"`
	} `json:"config"`
}

func (v *GovernConfigData) JsonString() string {
	buf, _ := json.Marshal(v)
	return string(buf)
}
