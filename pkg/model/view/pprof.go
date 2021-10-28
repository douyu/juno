package view

type (
	// ReqRunProfile ..
	ReqRunProfile struct {
		ZoneCode       string `json:"zone_code"`
		AppName        string `json:"app_name"`
		HostName       string `json:"host_name"`
		Env            string `json:"env"`
		DurationSecond int    `json:"duration_second"` //持续时间秒
	}

	// ReqListPProf ..
	ReqListPProf struct {
		ZoneCode string `query:"zone_code"`
		AppName  string `query:"app_name"`
		HostName string `query:"host_name"`
		Env      string `query:"env"`
	}
)

func (req *ReqRunProfile) IsValid() (isValid bool, msg string) {
	if req.AppName == "" || req.HostName == "" || req.Env == "" {
		msg = "请选择具体的实例"
		return
	}
	if req.ZoneCode == "" {
		msg = "必须选择可用区"
		return
	}

	if req.ZoneCode == "all" {
		msg = "请选择具体的可用区"
		return
	}

	if req.DurationSecond < 30 {
		req.DurationSecond = 30
	}
	if req.DurationSecond > 300 {
		msg = "持续时间超过5分钟"
		return
	}
	isValid = true
	return
}
