package grpcgovern

import (
	"sync"
	"time"

	"github.com/douyu/jupiter/pkg/conf"

	"github.com/go-resty/resty/v2"
)

type GrpcGovern struct {
	DomainMap       map[string]string // ZoneCode对应域名
	Token           string
	governStatus    map[string]HealthStatus // govern的状态
	governStatusMtx sync.Mutex
	*resty.Client
}

const (
	UrlProviderV2Info = "/v2/provider/info"
	UrlPprofV1Info    = "/api/v1/pprof/info"
	UrlGovernInfo     = "/v2/govern/%s/%d"
	UrlEtcdInfo       = "/api/etcdctl/%s/%s"
	UrlGovernEvent    = "/api/provider/%s/events" // /api/provider/:appname/events
	UrlConfigurators  = "/v2/configurators/put"
	// 聚合provider,configurators, 第一个为appname,第二个为typeid
	// typeid 1为grpc,2为http
	UrlBaseAggregation  = "/v2/aggregation/base/%s/%d"
	UrlConfigServerPut  = "/v1/configserver/put"
	UrlConfigServerInfo = "/v1/configserver/%s/%d/%s"

	UrlAliLoggerDashboard = "/v1/alilogger/dashboard/%s/%s"
	UrlAliLoggerLogStore  = "/v1/alilogger/logstore/%s/%s/%s"
)

const (
	EtcdRegister     = "register"
	EtcdConfigServer = "config"
	EtcdSentinel     = "sentinel"
)

func GenNewZoneCode(env, zoneCode string) string {
	return zoneCode + "_" + env
}

func InitGrpcGovern() *GrpcGovern {
	instance := &GrpcGovern{
		DomainMap:    conf.GetStringMapString("govern-host"),
		Token:        conf.GetString("auth.grpcgovern.token"),
		governStatus: make(map[string]HealthStatus),
		Client:       resty.New().SetDebug(false).SetTimeout(3*time.Second).SetHeader("Content-Type", "application/json;charset=utf-8"),
	}
	go instance.healthCheckLoop()
	return instance
}

func (g *GrpcGovern) getDomain(zoneCode string) (domain string) {
	domain, _ = g.DomainMap[zoneCode]
	return
}
