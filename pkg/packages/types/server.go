package types

// ServerNode ...
type ServerNode struct {
	Name     string              `json:"name" toml:"name"`
	Scheme   string              `json:"scheme" toml:"scheme"` // http | grpc
	Address  string              `json:"address" toml:"address"`
	Labels   map[string]string   `json:"labels" toml:"labels"` // 标签: group, weight, enable 等
	Services map[string]*Service `json:"services" toml:"services"`
}

// 一个Server可以实现多个Service接口
type Service struct {
	Namespace string            `json:"namespace" toml:"namespace"`
	Name      string            `json:"name" toml:"name"`
	Labels    map[string]string `json:"labels" toml:"labels"`
	Methods   []string          `json:"methods" toml:"methods"`
}

// WorkerNode ...
type WorkerNode struct {
	Name string `json:"name" toml:"name"`
	Spec string `json:"spec" toml:"spec"`
}

// ClientNode ...
type ClientNode struct {
	Name     string              `json:"name" toml:"name"`
	Scheme   string              `json:"schema" toml:"scheme"`
	Address  string              `json:"address" toml:"address"`
	Labels   map[string]string   `json:"labels" toml:"labels"`
	Services map[string]*Service `json:"services" toml:"services"`
}

// // AppInstance represents a server the client connects to.
// type AppInstance struct {
// 	Region        string                `json:"region" toml:"region"`
// 	Zone          string                `json:"zone" toml:"zone"`
// 	Env           string                `json:"env" toml:"env"`
// 	AppID         string                `json:"id" toml:"id"`
// 	AppName       string                `json:"name" toml:"name"`
// 	Hostname      string                `json:"hostname" toml:"hostname"`
// 	Version       string                `json:"version" toml:"version"`
// 	LastTimestamp int64                 `json:"ts" toml:"ts"`
// 	Metadata      map[string]string     `json:"metadata" toml:"metadata"`
// 	Status        int64                 `json:",omitempty" toml:",omitempty"`
// 	Servers       map[string]ServerNode `json:"servers,omitempty" toml:"servers"`
// 	Workers       map[string]WorkerNode `json:"workers,omitempty" toml:"workers"`
// 	Clients       map[string]ClientNode `json:"clients,omitempty" toml:"clients"`
//
// 	MetricKey string `json:"metricKey" toml:"metricKey"`
// 	MetricAddress string `json:"metricAddress" toml:"metricAddress"`
// }

// Label register label to etcd
func (n ServerNode) Label() string {
	return n.Name
}
