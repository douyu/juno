package util

import (
	"fmt"
	"testing"
	"time"
)

func TestDp(t *testing.T) {
	contentStr := `
ucserver = "https://apic.douyucdn.cn/upload/"

[app]
  debug = false
  maxproc = 64
  mode = "prod-bjalig"

  [app.logger]

    [app.logger.default]
      level = "Warn"

  [app.metric]
    addr = "127.0.0.1:55555"
    interval = "10s"

  [app.registry]

    [app.registry.etcd]
      endpoints = ["wsd-etcd-g.prod.ali.oyw:2379"]
      timeout = "2s"

[jupiter]

  [jupiter.dyrpc]

    [jupiter.dyrpc.etcd]
      addrs = ["192.168.5.88:2380","192.168.5.89:2380","10.5.0.5:2380"]
      headerTimeout = "2s"
      registerTTL = "2s"

    [jupiter.dyrpc.puller]
      addrs = ["10.11.0.91:23800"]

    [jupiter.dyrpc.socialcontact]
      groupid = 654000
      timeout = "2s"

  [jupiter.grpc]
    loadbalance = "p2c"

    [jupiter.grpc.roomBase]
      addr = "grpc:wsd-live-srv-roombase-go:v1:prod-bjalig"
      level = "panic"
      timeout = "1s"

    [jupiter.grpc.roomCate]
      addr = "grpc:wsd-live-srv-roomcate-go:v1:prod-bjalig"
      level = "panic"
      timeout = "1s"

    [jupiter.grpc.roomCover]
      addr = "grpc:wsd-live-srv-roomcover-go:v1:prod-bjalig"
      level = "panic"
      timeout = "1s"

    [jupiter.grpc.roomattach]
      addr = "grpc:wsd-live-srv-roomattach-go:v1:prod-bjalig"
      level = "panic"
      timeout = "1s"

  [jupiter.hrpc]

    [jupiter.hrpc.recom]
      addr = "http://recom.ocean-bp.com"
      timeout = "500ms"

  [jupiter.opentracing]

    [jupiter.opentracing.jaeger]
      addr = "wsd-jaeger-agent-go-bj-g.prod.ali.oyw:6831"
      rate = 0.001

[server]

  [server.grpc]
    port = 59044

  [server.http]
    port = 59045
`
	p := NewDataProvider([]byte(contentStr))
	cfgIns := cfg.New()
	if err := cfgIns.Load(p); err != nil {
		fmt.Println(err.Error())
		return
	}
	type grpcStruct struct {
		Registry    []string
		Addr        string
		Level       string
		Timeout     time.Duration
		DialTimeout time.Duration // gRPC连接超时配置 对原有的timeout字段做兼容
		Debug       bool
		EnableTrace bool
		ReadTimeout time.Duration
		Wait        bool
		LoadBalance string
	}

	prefix := "jupiter.grpc"
	for key, val := range cfg.GetStringMap("jupiter.grpc") {
		switch val.(type) {
		case map[string]interface{}:
			grpcConfig := cfg.UnmarshalWithExpect(prefix+"."+key, &grpcStruct{}).(*grpcStruct)
			fmt.Println(grpcConfig)
		}

	}

}
