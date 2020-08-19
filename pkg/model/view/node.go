package view

import "encoding/json"

// ReqNodeHeartBeat ..
type ReqNodeHeartBeat struct {
	Hostname     string `json:"hostname"`
	IP           string `json:"ip"`
	RegionCode   string `json:"region_code"`
	RegionName   string `json:"region_name"`
	ZoneCode     string `json:"zone_code"`
	ZoneName     string `json:"zone_name"`
	AppName      string `json:"app_name"`
	Env          string `json:"env"`
	AgentType    int    `json:"agent_type"`
	AgentVersion string `json:"agent_version"`
	ProxyType    int    `json:"proxy_type"`
	ProxyVersion string `json:"proxy_version"`
}

// ReqHTTPProxy ..
type ReqHTTPProxy struct {
	Address string            `json:"address"`
	URL     string            `json:"url"`
	Type    string            `json:"type"` // GET POST
	Body    json.RawMessage   `json:"body"`
	Params  map[string]string `json:"params"`
}
