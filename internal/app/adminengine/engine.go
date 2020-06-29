package adminengine

import (
	"github.com/douyu/juno/api/apiv1/resource"
	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/middleware"
	"github.com/douyu/juno/internal/pkg/packages/proxy"
	"github.com/douyu/juno/internal/pkg/service"
	"github.com/douyu/juno/internal/pkg/service/notify"
	"github.com/douyu/juno/pb"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/jupiter"
	jgrpc "github.com/douyu/jupiter/pkg/client/grpc"
	"github.com/douyu/jupiter/pkg/server/xecho"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/go-resty/resty/v2"
	"time"
)

// Admin ...
type Admin struct {
	jupiter.Application
	grpcGovernClient *resty.Client
}

// New ...
func New() *Admin {
	eng := &Admin{
		grpcGovernClient: resty.New().SetDebug(false).SetTimeout(3*time.Second).SetHeader("Content-Type", "application/json;charset=utf-8"),
	}
	_ = eng.Startup(
		eng.initConfig,
		eng.initInvoker,
		eng.initNotify,
		eng.initProxy,
		eng.serveHTTP,
	)
	return eng
}

func (eng *Admin) initConfig() (err error) {
	cfg.InitCfg()
	xlog.DefaultLogger = xlog.StdConfig("default").Build()
	return
}

func (eng *Admin) initNotify() (err error) {
	if cfg.Cfg.Proxy.Stream.Enable {
		ProxyClient := make(map[string]pb.ProxyClient, 0)
		for _, value := range cfg.Cfg.Proxy.Stream.ProxyAddr {
			gconfig := jgrpc.DefaultConfig()
			gconfig.Address = value
			gconfig.Debug = cfg.Cfg.Proxy.Stream.Debug
			ProxyClient[value] = pb.NewProxyClient(gconfig.Build())
		}
		notify.InitStreamStore(ProxyClient)
		notify.StreamStore.AddRouter(resource.NodeHeartBeat)
	}
	return nil
}

func (eng *Admin) serveHTTP() (err error) {
	serverConfig := xecho.DefaultConfig()
	serverConfig.Host = cfg.Cfg.Server.Host
	serverConfig.Port = cfg.Cfg.Server.Port

	server := serverConfig.Build()
	server.Debug = true

	server.Use(middleware.ProxyGatewayMW)

	apiAdmin(server)
	// 提供api的接口
	apiV1(server)
	err = eng.Serve(server)
	return
}

func (eng *Admin) initInvoker() error {
	invoker.Init()
	service.Init()
	return nil
}

func (eng *Admin) initProxy() error {
	proxy.Init()
	return nil
}
