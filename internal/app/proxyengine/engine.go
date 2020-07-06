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

	apiproxy "github.com/douyu/juno/api/apiv1/proxy"
	"github.com/douyu/juno/internal/pkg/service/proxy"
	"github.com/douyu/juno/internal/pkg/service/report"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/pb"
	"github.com/douyu/jupiter"
	"github.com/douyu/jupiter/pkg/server/xecho"
	"github.com/douyu/jupiter/pkg/server/xgrpc"
	"github.com/douyu/jupiter/pkg/xlog"
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
		eng.initHeartBeat,
	)
	if err != nil {
		xlog.Panic("start up error", zap.Error(err))
	}
	return eng
}

func (eng *Proxy) initConfig() (err error) {
	cfg.InitCfg()
	xlog.DefaultLogger = xlog.StdConfig("default").Build()
	return
}

func (eng *Proxy) initServerProxy() (err error) {
	proxy.InitStreamStore()
	err = eng.Schedule(proxy.NewProxyGrpcWorker())
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

func apiV1(server *xecho.Server) {
	server.POST("/api/v1/resource/node/heartbeat", apiproxy.NodeHeartBeat)

	// work for juno -> agent
	server.GET("/api/v1/proxy/get", apiproxy.HTTPProxyGET)
	server.POST("/api/v1/proxy/post", apiproxy.HTTPProxyPOST)
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
