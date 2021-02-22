package model

type AggregationRegister struct {
	Provider      ProviderEtcdInfo      `json:"provider"`
	Configurators ConfiguratorsEtcdInfo `json:"configurators"`
	Aggregation   AggregationInfo       `json:"aggregation"`
}

type AggregationInfo struct {
	Ip      string `json:"ip"`
	Type    string `json:"type"` // govern,grpc,http
	Port    string `json:"port"`
	Address string `json:"address"`
	RegKey  string `json:"regKey"`
	Labels  struct {
		Enable      string `json:"enable"`
		Env         string `json:"env"`
		Group       string `json:"group"`
		Hostname    string `json:"hostname"`
		Region      string `json:"region"`
		UpTimestamp string `json:"startTs"` // 启动时间
		VcsInfo     string `json:"vcsInfo"`
		Weight      string `json:"weight"`
		Zone        string `json:"zone"`
	} `json:"labels"`
}
