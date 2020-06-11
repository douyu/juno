package view

type RespRegisterInfo struct {
	AppName   string `json:"app_name"`
	IP        string `json:"ip"`
	HostName  string `json:"host_name"`
	RegKey    string `json:"reg_key"`
	StartTime string `json:"start_time"`
	VCSInfo   string `json:"vcs_info"`
}

// 查询结果记录
type RespRegistryItem struct {
	ID             int32  `json:"id"`
	AppName        string `json:"appName"`
	RegKey         string `json:"regKey"`
	RegValue       string `json:"regValue"`
	Region         string `json:"region"`
	Zone           string `json:"zone"`
	Scheme         string `json:"scheme"`
	Address        string `json:"address"`
	IP             string `json:"ip"`
	HostName       string `json:"hostname"`
	Type           string `json:"type"`
	Enable         int8   `json:"enable"`
	Group          string `json:"group"`
	Weight         int64  `json:"weight"`
	ProcessStartAt int64  `json:"processStartAt"`
	CreateAt       int64  `json:"createAt"`
	UpdateAt       int64  `json:"updateAt"`
}

// 查询结果
type RespRegistryQuery struct {
	List []RespRegistryItem `json:"list"`
}
