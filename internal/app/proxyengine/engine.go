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

package proxyengine

import (
	"context"
	"errors"
	"strconv"
	"time"

	apiproxy "github.com/douyu/juno/api/apiv1/proxy"
	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/service/proxy"
	"github.com/douyu/juno/internal/pkg/service/report"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/pb"
	"github.com/douyu/jupiter"
	"github.com/douyu/jupiter/pkg"
	"github.com/douyu/jupiter/pkg/client/etcdv3"
	compound_registry "github.com/douyu/jupiter/pkg/registry/compound"
	etcdv3_registry "github.com/douyu/jupiter/pkg/registry/etcdv3"
	"github.com/douyu/jupiter/pkg/server/xecho"
	"github.com/douyu/jupiter/pkg/server/xgrpc"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/go-playground/validator/v10"
	"go.uber.org/zap"
	"google.golang.org/grpc/metadata"
)

// Proxy ..
type Proxy struct {
	jupiter.Application
}

// New ..
func New() *Proxy {
	eng := &Proxy{}
	err := eng.Startup(
		eng.initConfig,
		eng.initServerProxy,
		eng.serveHTTP,
		eng.serveGRPC,
		eng.serveGovern,
		eng.initHeartBeat,
		eng.defers,
	)
	if err != nil {
		xlog.Panic("start up error", zap.Error(err))
	}
	return eng
}

func (eng *Proxy) initConfig() (err error) {
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
	invoker.Init()
	return
}

func (eng *Proxy) initRegister() (err error) {
	if !cfg.Cfg.Register.Enable {
		return
	}
	config := etcdv3_registry.DefaultConfig()
	config.Endpoints = cfg.Cfg.Register.Endpoints
	config.ConnectTimeout = cfg.Cfg.Register.ConnectTimeout
	config.Secure = cfg.Cfg.Register.Secure
	config.BasicAuth = cfg.Cfg.Register.BasicAuth
	config.UserName = cfg.Cfg.Register.UserName
	config.Password = cfg.Cfg.Register.Password

	eng.SetRegistry(
		compound_registry.New(
			config.BuildRegistry(),
		),
	)
	return
}

func (eng *Proxy) initServerProxy() (err error) {
	proxy.InitStreamStore()
	err = eng.Schedule(proxy.NewProxyGrpcRegisterWorker())
	if err != nil {
		return
	}
	err = eng.Schedule(proxy.NewProxyGrpcConfigWorker())
	if err != nil {
		return
	}
	err = eng.Schedule(proxy.NewProxyHttpWorker())
	if err != nil {
		return
	}
	return
}

// must last
func (eng *Proxy) initHeartBeat() (err error) {
	err = report.Build().ReportAgentStatus()
	return
}

func (eng *Proxy) serveHTTP() (err error) {
	serverConfig := xecho.DefaultConfig()
	serverConfig.Host = cfg.Cfg.ServerProxy.HTTPServer.Host
	serverConfig.Port = cfg.Cfg.ServerProxy.HTTPServer.Port

	server := serverConfig.Build()
	server.Debug = true
	server.Validator = &FormValidator{validator: validator.New()}
	apiV1(server)

	err = eng.Serve(server)
	if err != nil {
		return
	}
	return
}

func (eng *Proxy) serveGRPC() (err error) {
	serverConfig := xgrpc.DefaultConfig()
	serverConfig.Host = cfg.Cfg.ServerProxy.GrpcServer.Host
	serverConfig.Port = cfg.Cfg.ServerProxy.GrpcServer.Port

	server := serverConfig.Build()

	pb.RegisterProxyServer(server.Server, new(ProxyGrpc))
	err = eng.Serve(server)
	if err != nil {
		return
	}
	return
}

func (eng *Proxy) serveGovern() (err error) {
	config := etcdv3.DefaultConfig()
	config.Endpoints = cfg.Cfg.Register.Endpoints
	config.ConnectTimeout = cfg.Cfg.Register.ConnectTimeout
	config.Secure = cfg.Cfg.Register.Secure
	config.UserName = cfg.Cfg.Register.UserName
	config.Password = cfg.Cfg.Register.Password
	config.BasicAuth = cfg.Cfg.Register.BasicAuth

	client := config.Build()

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*2)
	defer cancel()
	addr := cfg.Cfg.Server.Govern.Host + ":" + strconv.Itoa(cfg.Cfg.Server.Govern.Port)
	// todo optimize, jupiter will after support metric
	_, err = client.Put(ctx, "/prometheus/job/"+pkg.Name()+"/"+pkg.HostName(), addr)
	if err != nil {
		xlog.Panic(err.Error())
	}
	eng.SetGovernor(cfg.Cfg.ServerProxy.GovernServer.Host + ":" + strconv.Itoa(cfg.Cfg.ServerProxy.GovernServer.Port))
	err = client.Close()
	if err != nil {
		xlog.Panic(err.Error())
	}
	return
}

func apiV1(server *xecho.Server) {
	server.POST("/*", apiproxy.ProxyPost)
	server.POST("/api/v1/resource/node/heartbeat", apiproxy.NodeHeartBeat)
	server.POST("/api/v1/testworker/platform/dispatch", apiproxy.DispatchTask)
	server.POST("/api/v1/testworker/platform/consume", apiproxy.ConsumeTask)
	server.POST("/api/v1/testworker/platform/taskStatusUpdate", apiproxy.TaskStatusUpdate)

	//// work for juno -> agent
	//server.GET("/api/v1/configuration/takeEffect", apiproxy.ConfigurationTakeEffect)
	//server.POST("/api/v1/configuration/used", apiproxy.ConfigurationUsed)
	//
	//// pprof info
	//server.POST("/api/v1/pprof/info", apiproxy.PprofInfo)
}

// ProxyGrpc ..
type ProxyGrpc struct{}

// GetFromContext 根据一个grpc的context获取出Session.
func getFromContext(ctx context.Context) (uint32, error) {
	md, _ := metadata.FromIncomingContext(ctx)
	gids := md["gid"]
	if len(gids) == 0 {
		return uint32(0), errors.New("gid")
	}

	gid, _ := strconv.Atoi(gids[0])
	return uint32(gid), nil
}

// Notify ..
func (*ProxyGrpc) Notify(stream pb.Proxy_NotifyServer) error {
	_, err := getFromContext(stream.Context())
	if err != nil {
		xlog.Error("err conninfo notify", zap.Error(err))
		return err
	}
	go func() {
		// todo
		<-stream.Context().Done()
		// 链接结束做什么
		proxy.StreamStore.DeleteStream()
	}()
	proxy.StreamStore.AddStream(stream)
	for {
		req, err := stream.Recv()
		if err != nil {
			break
		}

		// todo switch msgid ,response msg
		err = stream.Send(&pb.NotifyResp{
			Msg: []byte("hello world"),
		})
		if err != nil {
			xlog.Error("recv error", zap.Error(err))
		}
		xlog.Debug("recv info", xlog.Any("info", req))
	}
	return nil
}

func (eng *Proxy) defers() (err error) {
	eng.Defer(func() error {
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
	})
	return nil
}
