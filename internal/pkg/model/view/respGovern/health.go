package respGovern

// 应用存活信息
type HealthStats struct {
	RuntimeStats
	Status string `json:"status" label:"状态"`
}
