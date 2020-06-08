package respGovern

// 通用状态信息
type RuntimeStats struct {
	IP       string `json:"ip" label:"IP"`
	Hostname string `json:"hostname" label:"Hostname"`
	Time     string `json:"time" label:"时间"` // 每次展示数据的时间
	Err      string `json:"err" label:"错误信息"`
}
