package respGovern

// bigmap 状态信息
type BigmapStats struct {
	RuntimeStats
	Bigmaps map[string]OneBigmap `json:"bigmaps"`
}

type OneBigmap struct {
	// Status string
	Config interface{} `json:"config"`
}
