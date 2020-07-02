package view

// ReqNodeHeartBeat ..
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
	AgentType    int    `json:"agent_type"`
}
