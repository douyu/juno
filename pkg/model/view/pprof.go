package view

type (
	ReqRunProfile struct {
		ZoneCode string `json:"zone_code"`
		AppName  string `json:"app_name"`
		HostName string `json:"host_name"`
		Env      string `json:"env"`
	}

	ReqListPProf struct {
		ZoneCode string `query:"zone_code"`
		AppName  string `query:"app_name"`
		HostName string `query:"host_name"`
		Env      string `query:"env"`
	}
)
