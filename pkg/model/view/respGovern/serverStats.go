package respGovern

// 应用服务状态信息
type ServerStats struct {
	RuntimeStats
	Servers interface{} `json:"servers"`
}
