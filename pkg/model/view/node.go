package view

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
	URL    string                 `json:"url"`
	Params map[string]interface{} `json:"params"`
}
