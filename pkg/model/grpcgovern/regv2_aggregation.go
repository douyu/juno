package grpcgovern

type AggregationRegister struct {
	Provider      ProviderEtcdInfo      `json:"provider"`
	Configurators ConfiguratorsEtcdInfo `json:"configurators"`
	Aggregation   AggregationInfo       `json:"aggregation"`
}

type AggregationInfo struct {
	Ip      string `json:"ip"`
	Type    string `json:"type"` // govern,grpc,http
	Port    string `json:"port"`
	RegKey  string `json:"regKey"`
	Address string `json:"address"`
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

// 治理的configurators信息
type ConfiguratorsEtcdInfo struct {
	RawValue string `json:"rawValue"` // 检验数据
	RegKey   string `json:"regKey"`
	Type     string `json:"type"` // govern,grpc,http
	Ip       string `json:"ip"`
	Port     string `json:"port"`
	Address  string `json:"address"`
	Labels   struct {
		Enable   string `json:"enable"`
		Env      string `json:"env"`
		Group    string `json:"group"`
		Hostname string `json:"hostname"`
		Weight   string `json:"weight"`
	} `json:"labels"`
}

// 治理的provider信息
type ProviderEtcdInfo struct {
	RawValue string `json:"rawValue"` // 检验数据
	RegKey   string `json:"regKey"`
	Type     string `json:"type"` // govern,grpc,http
	Ip       string `json:"ip"`
	Port     string `json:"port"`
	Address  string `json:"address"`
	Labels   struct {
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
