package model

import (
	"encoding/json"
	"errors"
	"net/url"
	"strings"
)

const (
	TypeRecordProviders     TypeRecord = "providers"
	TypeRecordConfigurators TypeRecord = "configurators"
	TypeRecordConsumers     TypeRecord = "consumers"
	TypeRecordRouters       TypeRecord = "routers"
)

type TypeRecord string

func (t TypeRecord) String() string {
	return string(t)
}

// 查询etcd里的数据
type RegisterEtcdInfo struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type RegisterRawMessageEtcdInfo struct {
	Key   string          `json:"key"`
	Value json.RawMessage `json:"value"`
}

//  providers       /wsd-reg/wsd-live-srv-roombase-go/providers/grpc://127.0.0.1:8889
//  configurators   /wsd-reg/wsd-live-srv-roombase-go/configurators/grpc://127.0.0.1:8889

// /wsd-reg/main/providers/grpc://127.0.0.1:18090
//{"name":"","schema":"grpc","address":"127.0.0.1:18090","labels":{"enable":"true","env":"","group":"default","hostname":"askuy","region":"unknown","up_ts":"1570589836","vcs_info":"","weight":"50","zone":"unknown"},"services":{"testproto:GreeterGrpc$IGreeter":{"namespace":"testproto","name":"GreeterGrpc$IGreeter","labels":{"dubbo":"2.0.2","name":"GreeterGrpc$IGreeter","namespace":"testproto","release":"2.7.0"},"methods":[]}}}

// 注册key
// 包括提供者,消费者,配置等
type RegisterKeyInterface interface {
	String() string
	AppName() string
	Type() TypeRecord
	Scheme() string
	Address() string
}

// 注册key
type RegisterKey struct {
	originKey string
	appName   string
	keyType   TypeRecord
	url       *url.URL
}

func NewRegisterKey(b []byte) (k RegisterKeyInterface, err error) {
	var u *url.URL
	strs := strings.SplitN(string(b), "/", 5)
	if len(strs) != 5 {
		err = errors.New("strs length is error")
		return
	}

	//u, err = url.Parse(strs[4])
	//grpc:///?host=10.1.29.8:59230  grpc://10.1.29.8:59230
	tmp := strs[4]
	if strings.Contains(tmp, "///?host=") {
		tmp = strings.ReplaceAll(tmp, "///?host=", "//")
	}
	u, err = url.Parse(tmp)

	pkey := RegisterKey{
		originKey: string(b),
		appName:   strs[2],
		keyType:   TypeRecord(strs[3]),
		url:       u,
	}

	switch pkey.Type() {
	case TypeRecordProviders:
		k = &ProviderInfo{
			pkey,
			registerServerMeta{},
		}
	case TypeRecordConfigurators:
		k = &ConfigInfo{
			pkey,
			configServerMeta{},
		}
	default:
		err = errors.New("not defined")
	}
	return
}

func (k RegisterKey) String() string {
	return k.originKey
}

func (k RegisterKey) AppName() string {
	return k.appName
}

func (k RegisterKey) Type() TypeRecord {
	return k.keyType
}

func (k RegisterKey) Scheme() string {
	return k.url.Scheme
}

func (k RegisterKey) Address() string {
	return k.url.Host
}

func (k RegisterKey) IP() string {
	return k.url.Hostname()
}

func (k RegisterKey) Port() string {
	return k.url.Port()
}
