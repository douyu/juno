package configstatics

// Info ..
type Info struct {
	Value int    `json:"value"`
	Name  string `json:"name"`
}

// RespStatics ..
type RespStatics struct {
	EnvCnt []Info `json:"env_cnt"`
	CmcCnt []Info `json:"cmc_cnt"`
	Total  int64  `json:"total"`
}
