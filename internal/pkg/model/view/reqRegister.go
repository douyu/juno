package view

type ReqRegistryQuery struct {
	AppName  string `json:"appName"`
	IDCCode  string `json:"zone_code"`
	IP       string `json:"ip"`
	HostName string `json:"hostname"`
	Env      string `json:"env"`
}
