package db

type AppNodeAgentView struct {
	HostName string `json:"host_name"`
	IpPort   string `json:"ip"`
}

type AppNode struct {
	Id         int    `json:"id" gorm:"not null;column:id"` // id类型?
	AppName    string `json:"app_name" gorm:"not null;column:app_name"`
	Aid        int    `json:"aid" gorm:"not null;column:aid"` // id类型?
	HostName   string `json:"host_name" gorm:"not null;column:host_name"`
	Ip         string `json:"ip" gorm:"not null;column:ip"`
	DeviceID   int    `json:"device_id" gorm:"not null;column:device_id"`
	Env        string `json:"env"gorm:"not null"`
	RegionCode string `json:"region_code"gorm:"not null"`
	RegionName string `json:"region_name"gorm:"not null"`
	ZoneCode   string `json:"zone_code"gorm:"not null"`
	ZoneName   string `json:"zone_name"gorm:"not null"`
	CreateTime int64  `gorm:"not null;"json:"create_time"`
	UpdateTime int64  `gorm:"not null;"json:"update_time"`
}

func (t *AppNode) TableName() string {
	return "app_node"
}

type AppNodeMap struct {
	ID      int    `json:"id"`
	Aid     int    `json:"aid"`
	AppName string `json:"app_name"`
	MD5     string `json:"md5"` // 由md5(app_name+deviceIDs)
}

func (a *AppNodeMap) TableName() string {
	return "app_node_map"
}
