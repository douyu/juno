package types

import (
	"fmt"

	"google.golang.org/grpc/naming"
)

// ServiceInfo represents a server the client connects to.
type ServiceInfo struct {
	Env      string   `json:"env" toml:"env"`
	IID      string   `json:"iid" toml:"iid"`
	AppID    string   `json:"app_id" toml:"app_id"`
	AppName  string   `json:"app_name" toml:"app_name"`
	Hostname string   `json:"hostname" toml:"hostname"`
	Version  string   `json:"version" toml:"version"`
	Schema   string   `json:"schema" toml:"schema"`
	Address  string   `json:"address" toml:"address"`
	Methods  []string `json:"methods" toml:"methods"`
	Name     string   `json:"name" toml:"name"`
	// 服务元信息
	ServiceMeta []map[string]string `json:"metadata" toml:"metadata"`
}

// RegisterKey ...
func (si ServiceInfo) RegisterKey() string {
	return fmt.Sprintf("%s:%s:v1:%s/%s", si.Schema, si.AppName, si.Env, si.Address)
}

// GroupInfo ...
type GroupInfo struct {
	Name   string `json:"name" toml:"name"`
	Weight int    `json:"weight" toml:"weight"`
}

// RegionInfo ...
type RegionInfo struct {
	Name string `json:"name" toml:"name"`
}

// TrafficInfo ...
type TrafficInfo struct {
	Groups []GroupInfo `json:"groups" toml:"groups"`
	Region RegionInfo  `json:"region" toml:"region"`
	Switch bool        `json:"switch" toml:"switch"`
}

type Config struct {
	Disable bool   `json:"enable" toml:"enable"`
	Group   string `json:"group" toml:"group"`
	Weight  int    `json:"weight" toml:"weight"`
}

// Meta ...
type Meta struct {
	Info   ServerNode `json:"info,omitempty" toml:"info"`
	Config Config     `json:"config" toml:"config"`
}

// ServiceMeta ...
type ServiceMeta struct {
	Op       naming.Operation
	Addr     string
	Metadata interface{}
	Meta     Meta `json:"meta" toml:"meta"`
}
