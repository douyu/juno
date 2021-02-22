package model

import (
	"errors"
	"strings"
)

const (
	// /wsd-reg/main/providers/grpc://127.0.0.1:18090
	ProviderV1GrpcKeyName = "grpc:%s:v1:"
	ProviderV1HttpKeyName = "http:%s:v1:"

	ProviderV2GovernKeyName = "/prometheus/job/%s"
	ProviderV2GrpcKeyName   = "/wsd-reg/%s/providers/grpc://"
	ProviderV2HttpKeyName   = "/wsd-reg/%s/providers/http://"

	ConfiguratorsKeyName     = "/wsd-reg/%s/configurators/"
	ConfiguratorsGrpcKeyName = "/wsd-reg/%s/configurators/grpc:///"
	ConfiguratorsHttpKeyName = "/wsd-reg/%s/configurators/http:///"
)

// 治理的provider信息
type ProviderEtcdInfo struct {
	RawValue string `json:"rawValue"` // 检验数据
	Type     string `json:"type"`     // govern,grpc,http
	Ip       string `json:"ip"`
	Port     string `json:"port"`
	Address  string `json:"address"`
	RegKey   string `json:"regKey"`
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

// grpc:main:v1:lvchao/10.117.22.137:18090
func (p *ProviderEtcdInfo) ParseToProviderV1(key string) (err error) {
	// 第一层级解析
	arrs1 := strings.Split(key, "/")
	p.RawValue = key
	// 如果不是4段数据,说明数据有问题
	if len(arrs1) != 2 {
		return errors.New("arr1 length is error")
	}
	address := arrs1[1]
	// 第二层级解析
	arrs2 := strings.Split(arrs1[0], ":")
	if len(arrs2) != 4 {
		return errors.New("arr2 length is error")
	}
	var arrs3 []string
	arrs3, err = parseAddr(address)
	if err != nil {
		return
	}
	p.Type = arrs2[0]
	p.Ip = arrs3[0]
	p.Port = arrs3[1]
	p.Address = address
	return
}

func parseAddr(addr string) (arrs []string, err error) {
	arrs = strings.Split(addr, ":")
	if len(arrs) != 2 {
		err = errors.New("addr length is error")
		return
	}
	return
}
