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
	"github.com/douyu/juno/api/apiv1/resource"
	"github.com/douyu/juno/internal/app/middleware"
	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/service"
	"github.com/douyu/juno/internal/pkg/service/clientproxy"
	"github.com/douyu/juno/internal/pkg/service/notify"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/pb"
	"github.com/douyu/jupiter"
	jgrpc "github.com/douyu/jupiter/pkg/client/grpc"
	"github.com/douyu/jupiter/pkg/flag"
	"github.com/douyu/jupiter/pkg/server/xecho"
	"github.com/douyu/jupiter/pkg/xlog"
	"go.uber.org/zap"
	"strconv"
)

var (
	mockFlag    bool
	clearFlag   bool
	installFlag bool
	runFlag     bool
)

// Admin ...
type Admin struct {
	jupiter.Application
}

// New ...
func New() *Admin {
	flag.Register(&flag.BoolFlag{
		Name:    "install",
		Usage:   "--install",
		EnvVar:  "Juno_Install",
		Default: false,
		Action:  func(name string, fs *flag.FlagSet) {},
	})

	flag.Register(&flag.BoolFlag{
		Name:    "mock",
		Usage:   "--mock",
		EnvVar:  "Juno_Mock",
		Default: false,
		Action:  func(name string, fs *flag.FlagSet) {},
	})

	flag.Register(&flag.BoolFlag{
		Name:    "clear",
		Usage:   "--clear",
		EnvVar:  "Juno_Clear",
		Default: false,
		Action:  func(name string, fs *flag.FlagSet) {},
	})

	eng := &Admin{}
	err := eng.Startup(
		eng.parseFlag,
		eng.initConfig,
		eng.initInvoker,
		eng.migrateDB,
		eng.initNotify,
		eng.initClientProxy,
		eng.serveHTTP,
		eng.serveGovern,
	)
	if err != nil {
		xlog.Panic("start up error", zap.Error(err))
	}
	return eng
}

func (eng *Admin) parseFlag() error {
	mockFlag = flag.Bool("mock")
	clearFlag = flag.Bool("clear")
	installFlag = flag.Bool("install")
	if !installFlag && !mockFlag && !clearFlag {
		runFlag = true
	}
	return nil
}

func (eng *Admin) initConfig() (err error) {
	cfg.InitCfg()
	xlog.DefaultLogger = xlog.StdConfig("default").Build()
	return
}

func (eng *Admin) initNotify() (err error) {
	if !runFlag {
		return
	}
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
	if !runFlag {
		return
	}
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

func (eng *Admin) serveGovern() (err error) {
	if !runFlag {
		return
	}
	eng.SetGovernor(cfg.Cfg.Server.Govern.Host + ":" + strconv.Itoa(cfg.Cfg.Server.Govern.Port))
	return
}

func (eng *Admin) initInvoker() (err error) {
	invoker.Init()
	err = service.Init()
	return
}

func (eng *Admin) initClientProxy() (err error) {
	if !runFlag {
		return
	}
	clientproxy.Init()
	return
}
