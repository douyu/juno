package respGovern

// resty 状态信息
type RestyStats struct {
	RuntimeStats
	Redixs map[string]OneResty `json:"restys"`
}

type OneResty struct {
	Target string      `json:"target"`
	Config interface{} `json:"config"`
}
