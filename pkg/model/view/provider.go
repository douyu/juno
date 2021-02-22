package view

import "encoding/json"

type ReqList struct {
	AppName string `json:"appName"`
	IdcCode string `json:"idcCode"`
	Env     string `json:"env"`
}

type RespInfo struct {
	Id         int    `json:"id" gorm:"not null;column:id"` //id类型?
	AppName    string `json:"appName" gorm:"not null;column:app_name"`
	IdcId      uint32 `json:"idcId" gorm:"not null;column:idc_id"` //id类型?
	Aid        uint32 `json:"aid" gorm:"not null;column:aid"`      //id类型?
	HostName   string `json:"hostName" gorm:"not null;column:host_name"`
	Ip         string `json:"ip" gorm:"not null;column:ip"`
	DeviceID   int    `json:"deviceId" gorm:"not null;column:device_id"`
	Env        string `json:"env"gorm:"not null"`
	RegionCode string `json:"regionCode"gorm:"not null"`
	RegionName string `json:"regionName"gorm:"not null"`
	IdcCode    string `json:"idcCode"gorm:"not null"`

	RegKey         string          `gorm:"not null"json:"regKey"`
	RegValue       json.RawMessage `gorm:"not null;type:text"json:"regValue"`
	Scheme         string          `gorm:"not null"json:"scheme"`
	Address        string          `gorm:"not null"json:"address"`
	VcsInfo        string          `gorm:"not null;"json:"vcsInfo"`
	ProcessStartAt int64           `gorm:"not null"json:"processStartAt"`
	Enable         int8            `gorm:"not null"json:"enable"`
	Type           string          `gorm:"not null"json:"type"`
	Weight         int64           `gorm:"not null"json:"weight"`
	Group          string          `gorm:"not null"json:"group"`
}

type ReqConfiguratorsPut struct {
	IdcCode string `json:"idcCode"`
	Env     string `json:"env"`
	AppName string `json:"appName"`
	RegKey  string `json:"regKey"`
	Enable  string `json:"enable"`
	Weight  string `json:"weight"`
	Group   string `json:"group"`
}

type ReqGovern struct {
	AppName string `json:"appName"`
	IdcCode string `json:"idcCode"`
	Env     string `json:"env"`
	TypeId  int    `json:"typeId"`
}
