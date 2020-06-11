package resource

import "github.com/douyu/juno/internal/pkg/model/db"

// 应用信息
type ReqAppInfo struct {
	Aid     int    `query:"aid"`
	AppName string `query:"app_name"`
}

type ReqAppList struct {
	db.AppInfo
	KeywordsType string `query:"keywords_type"`
	Keywords     string `query:"keywords"`
	CurrentPage  int    `query:"currentPage"`
	PageSize     int    `query:"pageSize"`
	SearchPort   string `query:"search_port"`
}

type ReqAppPut struct {
	List []db.AppInfo `json:"list"`
}

type ReqAppCreate struct {
	db.AppInfo
}

type ReqAppUpdate struct {
	db.AppInfo
}

type ReqAppDelete struct {
	db.AppInfo
}

// 机房信息
type ReqZoneInfo struct {
	Id       int    `query:"id"`
	ZoneCode string `query:"idc_code"`
}

type ReqZoneList struct {
	Env          string `query:"env"`
	RegionCode   string `query:"region_code"`
	RegionName   string `query:"region_name"`
	CurrentPage  int    `query:"currentPage"`
	PageSize     int    `query:"pageSize"`
	KeywordsType string `query:"keywords_type"`
	Keywords     string `query:"keywords"`
}

type ReqZonePut struct {
	List []db.Zone `json:"list"`
}

type ReqZoneCreate struct {
	db.Zone
}

type ReqZoneUpdate struct {
	db.Zone
}

type ReqZoneDelete struct {
	db.Zone
}

// 节点信息
type ReqNodeInfo struct {
	Id       int    `query:"id"`
	HostName string `query:"host_name"`
}

type ReqNodeList struct {
	db.Node
	CurrentPage  int    `query:"currentPage"`
	PageSize     int    `query:"pageSize"`
	KeywordsType string `query:"keywords_type"`
	Keywords     string `query:"keywords"`
}

type ReqNodePut struct {
	List []db.Node `json:"list"`
}

type ReqNodeCreate struct {
	db.Node
}

type ReqNodeUpdate struct {
	db.Node
}

type ReqNodeDelete struct {
	db.Node
}

type ReqNodeHeartBeat struct {
	Hostname     string `json:"hostname"`
	IP           string `json:"ip"`
	AgentVersion string `json:"agent_version"`
	RegionCode   string `json:"region_code"`
	RegionName   string `json:"region_name"`
	ZoneCode     string `json:"zone_code"`
	ZoneName     string `json:"zone_name"`
	AppName      string `json:"app_name"`
	Env          string `json:"env"`
}

type ReqNodeTransferList struct {
	ZoneCode string `query:"zone_code"`
	Env      string `query:"env"`
}

type ReqNodeTransferPut struct {
	Target []db.Node `query:"target"`
	ZoneId int       `json:"zone_id"`
}

type ReqAppNodeTransferList struct {
	Aid int `query:"aid"`
}

type ReqAppNodeTransferPut struct {
	Target []db.Node `query:"target"`
	Aid    int       `json:"aid"`
}

// APP NODE信息
type ReqAppNodeInfo struct {
	Id int `query:"id"`
}

type ReqAppNodeList struct {
	Aid         int    `query:"aid"`
	Env         string `query:"env"`
	AppName     string `query:"app_name"`
	HostName    string `query:"host_name"`
	Ip          string `query:"ip"`
	CurrentPage int    `query:"currentPage"`
	PageSize    int    `query:"pageSize"`
	ZoneCode    string `query:"zone_code"`
}

type ReqAppNodePut struct {
	Id      int          `json:"id"`
	AppName string       `json:"app_name"`
	List    []db.AppNode `json:"list"`
}

type ReqAppNodeCreate struct {
	db.AppNode
}

type ReqAppNodeUpdate struct {
	db.AppNode
}

type ReqAppNodeDelete struct {
	db.AppNode
}

type NodeStaticsInfo struct {
	Value int    `json:"value"`
	Name  string `json:"name"`
}

type RespNodeStatics struct {
	DayCnt     []NodeStaticsInfo `json:"day_cnt"`
	NodeStatus []NodeStaticsInfo `json:"node_status"`
	NodeApp    []NodeStaticsInfo `json:"node_app"`
	EnvZone    []NodeStaticsInfo `json:"env_zone"`
}
