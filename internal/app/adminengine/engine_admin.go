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
	"context"
	"strconv"
	"time"

	"github.com/douyu/juno/api/apiv1/resource"
	"github.com/douyu/juno/api/apiv1/test/platform"
	"github.com/douyu/juno/api/apiv1/worker"
	"github.com/douyu/juno/internal/app/middleware"
	"github.com/douyu/juno/internal/pkg/install"
	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/service"
	"github.com/douyu/juno/internal/pkg/service/appDep"
	"github.com/douyu/juno/internal/pkg/service/clientproxy"
	"github.com/douyu/juno/internal/pkg/service/confgo"
	"github.com/douyu/juno/internal/pkg/service/notify"
	"github.com/douyu/juno/internal/pkg/service/openauth"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/constx"
	"github.com/douyu/juno/pkg/pb"
	"github.com/douyu/jupiter"
	"github.com/douyu/jupiter/pkg"
	"github.com/douyu/jupiter/pkg/client/etcdv3"
	jgrpc "github.com/douyu/jupiter/pkg/client/grpc"
	"github.com/douyu/jupiter/pkg/flag"
	"github.com/douyu/jupiter/pkg/server/governor"
	"github.com/douyu/jupiter/pkg/server/xecho"
	"github.com/douyu/jupiter/pkg/worker/xcron"
	"github.com/douyu/jupiter/pkg/xlog"
)

// Admin ...
type Admin struct {
	jupiter.Application
	mockFlag    bool
	clearFlag   bool
	installFlag bool
	runFlag     bool
	hostFlag    string
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
		eng.migrateDB,
		eng.initClientProxy,
		eng.initInvoker,
		eng.cmdMock,
		eng.initNotify,
		eng.serveHTTP,
		eng.serveGovern,
		eng.defers,
		eng.initParseWorker,
		eng.initVersionWorker,
		eng.initUserVisitWorker,
	)

	if err != nil {
		xlog.Panic("start up error: " + err.Error())
	}
	return eng
}

func (eng *Admin) parseFlag() error {
	eng.mockFlag = flag.Bool("mock")
	eng.clearFlag = flag.Bool("clear")
	eng.installFlag = flag.Bool("install")
	eng.hostFlag = flag.String("host")
	if !eng.installFlag && !eng.mockFlag && !eng.clearFlag {
		eng.runFlag = true
	}
	return nil
}

func (eng *Admin) initConfig() (err error) {
	cfg.InitCfg()
	jupiterConfig := xlog.DefaultConfig()
	jupiterConfig.Name = cfg.Cfg.Logger.System.Name
	jupiterConfig.Debug = cfg.Cfg.Logger.System.Debug
	jupiterConfig.Level = cfg.Cfg.Logger.System.Level
	jupiterConfig.Dir = cfg.Cfg.Logger.System.Dir
	jupiterConfig.Async = cfg.Cfg.Logger.System.Async
	xlog.JupiterLogger = jupiterConfig.Build()
	//
	bizConfig := xlog.DefaultConfig()
	bizConfig.Name = cfg.Cfg.Logger.Biz.Name
	bizConfig.Debug = cfg.Cfg.Logger.Biz.Debug
	bizConfig.Level = cfg.Cfg.Logger.Biz.Level
	bizConfig.Dir = cfg.Cfg.Logger.Biz.Dir
	bizConfig.Async = cfg.Cfg.Logger.Biz.Async
	xlog.DefaultLogger = bizConfig.Build()
	return
}

func (eng *Admin) initNotify() (err error) {
	if !eng.runFlag {
		return
	}
	for _, cp := range cfg.Cfg.ClientProxy.MultiProxy {
		if cp.Stream.Enable {
			ProxyClient := make(map[string]pb.ProxyClient, 0)
			for _, value := range cp.Stream.ProxyAddr {
				gconfig := jgrpc.DefaultConfig()
				gconfig.Address = value
				gconfig.Debug = cp.Stream.Debug
				ProxyClient[value] = pb.NewProxyClient(gconfig.Build())
			}
			notify.InitStreamStore(ProxyClient)
			notify.StreamStore.AddRouter(constx.MsgNodeHeartBeatResp, resource.NodeHeartBeat)
			notify.StreamStore.AddRouter(constx.MsgTestStepUpdateResp, platform.TaskStepStatusUpdate)
			notify.StreamStore.AddRouter(constx.MsgWorkerHeartBeatResp, worker.Heartbeat)
		}
	}
	return nil
}

func (eng *Admin) serveHTTP() (err error) {
	if !eng.runFlag {
		return
	}
	serverConfig := xecho.DefaultConfig()
	serverConfig.Host = cfg.Cfg.Server.Http.Host
	if eng.hostFlag != "" {
		serverConfig.Host = eng.hostFlag
	}
	serverConfig.Port = cfg.Cfg.Server.Http.Port
	server := serverConfig.Build()
	server.Debug = true

	server.Use(middleware.ProxyGatewayMW)

	server.Validator = NewValidator()

	// Provide Admin API interface
	apiAdmin(server)
	// Provide Open API interface
	apiV1(server)
	err = eng.Serve(server)
	return
}

func (eng *Admin) serveGovern() (err error) {
	if !eng.runFlag {
		return
	}
	config := etcdv3.DefaultConfig()
	config.Endpoints = cfg.Cfg.Register.Endpoints
	config.ConnectTimeout = cfg.Cfg.Register.ConnectTimeout
	config.Secure = cfg.Cfg.Register.Secure

	client := config.Build()

	host := cfg.Cfg.Server.Govern.Host
	if eng.hostFlag != "" {
		host = eng.hostFlag
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*2)
	defer cancel()
	addr := host + ":" + strconv.Itoa(cfg.Cfg.Server.Govern.Port)
	// todo optimize, jupiter will after support metric
	_, err = client.Put(ctx, "/prometheus/job/"+pkg.Name()+"/"+pkg.HostName(), addr)
	if err != nil {
		xlog.Panic(err.Error())
	}

	server := governor.RawConfig("server.govern").Build()
	err = eng.Serve(server)

	if err != nil {
		return err
	}

	//eng.SetGovernor(cfg.Cfg.Server.Govern.Host + ":" + strconv.Itoa(cfg.Cfg.Server.Govern.Port))
	err = client.Close()
	if err != nil {
		return err
	}
	return
}

func (eng *Admin) initInvoker() (err error) {
	invoker.Init()
	err = service.Init()
	if err != nil {
		return err
	}

	if eng.installFlag {
		// 服务注册完之后再mock数据
		install.MustMockSysTemSetData()
	}
	return
}

func (eng *Admin) initClientProxy() (err error) {
	clientproxy.Init()
	return
}

func (eng *Admin) defers() (err error) {
	if !eng.runFlag {
		return
	}
	config := etcdv3.DefaultConfig()
	config.Endpoints = cfg.Cfg.Register.Endpoints
	config.ConnectTimeout = cfg.Cfg.Register.ConnectTimeout
	config.Secure = cfg.Cfg.Register.Secure
	client := config.Build()
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*2)
	defer cancel()
	// todo optimize, jupiter will after support metric
	_, err = client.Delete(ctx, "/prometheus/job/"+pkg.Name()+"/"+pkg.HostName())
	if err != nil {
		xlog.Panic(err.Error())
	}
	err = client.Close()
	if err != nil {
		xlog.Panic(err.Error())
	}
	return nil
}

func (eng *Admin) initWorker() (err error) {
	{ // 定时刷新AccessToken任务
		accessTokenUpdateCron := xcron.DefaultConfig().Build()
		accessTokenUpdateCron.Schedule(xcron.Every(time.Minute), xcron.FuncJob(openauth.OpenAuthService.IntervalUpdateTokens))

		err = eng.Schedule(accessTokenUpdateCron)
		if err != nil {
			return err
		}
	}
	return
}

func (eng *Admin) initParseWorker() (err error) {
	// 获取配置解析依赖时间
	interval := confgo.ConfuSrv.GetConfigParseWorkerTime()
	// 默认值 7200s
	if interval == 0 {
		interval = 7200
	}

	cron := xcron.StdConfig("parse").Build()
	cron.Schedule(xcron.Every(time.Second*time.Duration(interval)), xcron.FuncJob(confgo.ConfuSrv.ConfigParseWorker))
	return eng.Schedule(cron)
}

func (eng *Admin) initVersionWorker() (err error) {
	cron := xcron.StdConfig("parse").Build()
	cron.Schedule(xcron.Every(time.Hour*12), xcron.FuncJob(appDep.AppDep.SyncAppVersion))
	return eng.Schedule(cron)
}

// 每隔一天清理三个月前的 用户浏览记录数据
func (eng *Admin) initUserVisitWorker() (err error) {
	cron := xcron.StdConfig("parse").Build()
	cron.Schedule(xcron.Every(time.Hour*12), xcron.FuncJob(user.User.CronCleanUserVisitRecord))
	return eng.Schedule(cron)
}
