package db

// node节点，可以由juno agent进行上报，也可以由接口进行上报
type Node struct {
	Id         int    `gorm:"not null;"json:"id"`
	HostName   string `gorm:"not null;"json:"host_name" `
	Ip         string `json:"ip" gorm:"not null;column:ip"`
	CreateTime int64  `gorm:"not null;"json:"create_time"`
	UpdateTime int64  `gorm:"not null;"json:"update_time"`
	Env        string `gorm:"not null;"json:"env"`
	RegionCode string `json:"region_code"gorm:"not null"`
	RegionName string `json:"region_name"gorm:"not null"`
	ZoneCode   string `json:"zone_code"gorm:"not null"`
	ZoneName   string `json:"zone_name"gorm:"not null"`

	AgentHeartbeatTime int64 `gorm:"not null;"json:"agent_heartbeat_time"`
	ProxyHeartbeatTime int64 `gorm:"not null;"json:"proxy_heartbeat_time"`

	NodeType     int    `gorm:"not null;"json:"node_type"`     // 1为接口，2为后台添加，3为juno agent
	AgentType    int    `gorm:"not null;"json:"agent_type"`    // agent类型
	AgentVersion string `gorm:"not null;"json:"agent_version"` // agent version
	ProxyType    int    `gorm:"not null;"json:"proxy_type"`    // proxy 类型
	ProxyVersion string `gorm:"not null;"json:"proxy_version"` // proxy version
}

func (Node) TableName() string {
	return "node"
}

type NodeCnt struct {
	DayTime string `json:"day_time" gorm:"day_time"`
	Cnt     int    `gorm:"cnt"json:"cnt"`
}
