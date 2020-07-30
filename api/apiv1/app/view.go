package app

type ReqList struct {
	AppName  string `json:"appName"`
	ZoneCode string `json:"zone_code"`
	Env      string `json:"env"`
}

type RespInfo struct {
	Id         int    `json:"id" gorm:"not null;column:id"` // id类型?
	HostName   string `json:"hostName" gorm:"not null;column:host_name"`
	Ip         string `json:"ip" gorm:"not null;column:ip"`
	DeviceID   int    `json:"deviceId" gorm:"not null;column:device_id"`
	Env        string `json:"env"gorm:"not null"`
	RegionCode string `json:"regionCode"gorm:"not null"`
	RegionName string `json:"regionName"gorm:"not null"`
	ZoneCode   string `json:"zone_code"gorm:"not null"`
	IsGrpc     int    `json:"isGrpc"`
	IsHttp     int    `json:"isHttp"`
	IsDayu     int    `json:"isDayu"`
}

type ReqLogger struct {
	Typ      string `json:"typ"`
	Env      string `json:"env"`
	Aid      string `json:"aid"`
	AppName  string `json:"app_name"`
	QueryTyp string `json:"query_typ"`
}
