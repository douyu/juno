package view

type EtcdInfo struct {
	Key            string `json:"key"`
	CreateRevision int    `json:"createRevision"`
	ModRevision    int    `json:"modRevision"`
	Version        int    `json:"version"`
	Value          []byte `json:"value"`
}

type ReqGetEtcdList struct {
	Prefix      string `json:"prefix"`
	AppName     string `json:"appName"`
	ServiceName string `json:"serviceName"`
	Suffix      string `json:"suffix"`
	ZoneCode    string `json:"zone_code"`
	Env         string `json:"env"`
}

type ReqAddEtcd struct {
	Prefix      string `json:"prefix"`
	AppName     string `json:"appName"`
	ServiceName string `json:"serviceName"`
	Suffix      string `json:"suffix"`
	ZoneCode    string `json:"zone_code"`
	Env         string `json:"env"`
	DataSource  string `json:"dataSource"`
	Value       string `json:"value"`
}

type ReqSentinelRuleAdd struct {
	Prefix      string `json:"prefix"`
	AppName     string `json:"appName"`
	ServiceName string `json:"serviceName"`
	Suffix      string `json:"suffix"`
	ZoneCode    string `json:"zone_code"`
	DataSource  string `json:"dataSource"`
}

type RespEtcdInfo struct {
	Key            string `json:"key"`
	CreateRevision int64  `json:"create_revision"`
	ModRevision    int64  `json:"mod_revision"`
	Version        int64  `json:"version"`
	Value          string `json:"value"`
	Lease          int64  `json:"lease"`
}

type ReqEtcdServiceList struct {
	AppName  string `json:"appName"`
	ZoneCode string `json:"zone_code"`
}

type RespEtcdServiceList struct {
	AppName  string `json:"appName"`
	ZoneCode string `json:"zone_code"`
}

type GovernServerStats struct {
	IP       string      `json:"ip"`
	Hostname string      `json:"hostname"`
	Time     string      `json:"time"` // 每次展示数据的时间
	Err      string      `json:"err"`
	Servers  interface{} `json:"servers"`
	// Servers  map[string]ServerNode `json:"servers"`
}

type RuntimeStats struct {
	IP       string `json:"ip"`
	Hostname string `json:"hostname"`
	Time     string `json:"time"` // 每次展示数据的时间
	Err      string `json:"err"`
}

type ServerNode struct {
	Name     string              `json:"name" toml:"name"`
	Scheme   string              `json:"scheme" toml:"scheme"` // http | grpc
	Address  string              `json:"address" toml:"address"`
	Labels   map[string]string   `json:"labels" toml:"labels"` // 标签: group, weight, enable 等
	Services map[string]*Service `json:"services" toml:"services"`
}

type Service struct {
	Namespace string            `json:"namespace" toml:"namespace"`
	Name      string            `json:"name" toml:"name"`
	Labels    map[string]string `json:"labels" toml:"labels"`
	Methods   []string          `json:"methods" toml:"methods"`
}
