// Copyright 2020 Douyu
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package adminengine

import (
	"time"

	"github.com/douyu/juno/api/apiv1/resource"
	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/middleware"
	"github.com/douyu/juno/internal/pkg/service"
	"github.com/douyu/juno/internal/pkg/service/clientproxy"
	"github.com/douyu/juno/internal/pkg/service/notify"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/pb"
	"github.com/douyu/jupiter"
	jgrpc "github.com/douyu/jupiter/pkg/client/grpc"
	"github.com/douyu/jupiter/pkg/server/xecho"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/go-resty/resty/v2"
	"go.uber.org/zap"
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
	err := eng.Startup(
		eng.initConfig,
		eng.initInvoker,
		eng.initNotify,
		eng.initClientProxy,
		eng.serveHTTP,
	)
	if err != nil {
		xlog.Panic("start up error", zap.Error(err))
	}
	return eng
}

func (eng *Admin) initConfig() (err error) {
	cfg.InitCfg()
	xlog.DefaultLogger = xlog.StdConfig("default").Build()
	return
}

func (eng *Admin) initNotify() (err error) {
	for _, cp := range cfg.Cfg.ClientProxy {
		if cp.Stream.Enable {
			ProxyClient := make(map[string]pb.ProxyClient, 0)
			for _, value := range cp.Stream.ProxyAddr {
				gconfig := jgrpc.DefaultConfig()
				gconfig.Address = value
				gconfig.Debug = cp.Stream.Debug
				ProxyClient[value] = pb.NewProxyClient(gconfig.Build())
			}
			notify.InitStreamStore(ProxyClient)
			notify.StreamStore.AddRouter(resource.NodeHeartBeat)
		}
	}

	return nil
}

func (eng *Admin) serveHTTP() (err error) {
	serverConfig := xecho.DefaultConfig()
	serverConfig.Host = cfg.Cfg.Server.Http.Host
	serverConfig.Port = cfg.Cfg.Server.Http.Port

	server := serverConfig.Build()
	server.Debug = true

	server.Use(middleware.ProxyGatewayMW)

	apiAdmin(server)
	// Provide API interface
	apiV1(server)
	err = eng.Serve(server)
	return
}

func (eng *Admin) initInvoker() error {
	invoker.Init()
	service.Init()
	return nil
}

func (eng *Admin) initClientProxy() error {
	clientproxy.Init()
	return nil
}
