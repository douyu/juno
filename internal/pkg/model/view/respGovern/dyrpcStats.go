package respGovern

// redix 状态信息
type DyrpcStats struct {
	RuntimeStats
	Dyrpcs map[string]OneDyrpc `json:"dyrpcs"`
}

type OneDyrpc struct {
	Mode    int         `json:"mode"`
	GroupID int         `json:"groupID"`
	Config  interface{} `json:"config"`
}
