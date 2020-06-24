package db

import "encoding/json"

// K8sPub ...
const (
	K8sPub = int(iota)
	K8sRestart
	K8sStop
	K8sStatus
)

// 语言类型常量
const (
	Redis = iota + 1
	Memcache
	Mongo
	MySQL
	RPC
	Nginx
	PHP
	LUA
	GO
	JAVA
	PYTHON
	FED
	FLASH
	CPP
)

// LangTypes 语言类型数组映射
var LangTypes = []string{
	Redis:    "Redis",
	Memcache: "Memcache",
	Mongo:    "Mongo",
	MySQL:    "MySQL",
	RPC:      "RPC",
	Nginx:    "Nginx",
	PHP:      "PHP",
	LUA:      "Lua",
	GO:       "Go",
	JAVA:     "Java",
	PYTHON:   "Python",
	FED:      "Fed",
	FLASH:    "Flash",
	CPP:      "C++",
}

// 架构层级
const (
	OTHERLv = iota
	ProxyLv
	AppLv
	GateWayLv
	ServiceLv
	DataLv
)

// LevelTypes 五层架构名称map
var LevelTypes = []string{
	OTHERLv:   "其他",
	ProxyLv:   "代理",
	AppLv:     "应用",
	GateWayLv: "网关",
	ServiceLv: "服务",
	DataLv:    "数据",
}

// EventSystem ...
const (
	EventSystem   = "system"   // 系统触发，正常用户点击发布
	EventRollback = "rollback" // 回滚事件
	EventWebHook  = "webhook"  // 由gitlab事件触发的统一为webhook事件，如有需要再细分
	EventPush     = "push"
	EventPull     = "pull_request"
	EventTag      = "tag"
)

// StatusInit ...
const (
	StatusInit     = 0
	StatusSuccess  = 1
	StatusRunning  = 2
	StatusPending  = 3
	StatusSkipped  = 4
	StatusFailure  = 5
	StatusCanceled = 6
)

// GoPkgToml ...
const (
	GoPkgToml = "/Gopkg.lock"
)

// 变化文件状态集合
type ChangeLog struct {
	Add     []string `json:"A"`
	Delete  []string `json:"D"`
	Modify  []string `json:"M"`
	Replace []string `json:"R"`
}

// ToString ...
func (c *ChangeLog) ToString() string {
	bytes, err := json.Marshal(c)

	if err != nil {
		return ""
	}

	return string(bytes)
}
