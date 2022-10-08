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

package proxy

import (
	"net"
	"time"

	"github.com/cockroachdb/cmux"
	"github.com/douyu/juno/pkg/cfg"
	grpc_prometheus "github.com/grpc-ecosystem/go-grpc-prometheus"
	pb "go.etcd.io/etcd/api/v3/etcdserverpb"
	"go.etcd.io/etcd/client/pkg/v3/transport"
	clientv3 "go.etcd.io/etcd/client/v3"
	"go.etcd.io/etcd/client/v3/namespace"
	"go.etcd.io/etcd/server/v3/etcdserver/api/v3election/v3electionpb"
	"go.etcd.io/etcd/server/v3/etcdserver/api/v3lock/v3lockpb"
	"go.etcd.io/etcd/server/v3/proxy/grpcproxy"
	"golang.org/x/sync/errgroup"
	"google.golang.org/grpc"
)

type grpcProxy struct {
	grpcProxyListenAddr string
	grpcProxyEndpoints  []string
	grpcProxyCert       string
	grpcProxyKey        string
	grpcProxyCA         string
	grpcProxyNamespace  string
	grpcProxyUserName   string
	grpcProxyPassword   string
	grpcServer          *grpc.Server
}

// NewEtcdGrpcProxy ..
func NewEtcdGrpcProxy(etcdConf cfg.Etcd) *grpcProxy {

	grpcProxyListenAddr := etcdConf.ListenAddr
	if grpcProxyListenAddr == "" {
		grpcProxyListenAddr = "127.0.0.1:23790"
	}

	grpcProxyEndpoints := etcdConf.Endpoints
	if len(grpcProxyEndpoints) == 0 {
		grpcProxyEndpoints = []string{"127.0.0.1:2379"}
	}

	obj := &grpcProxy{
		grpcProxyListenAddr: grpcProxyListenAddr,
		grpcProxyEndpoints:  grpcProxyEndpoints,
		grpcProxyCert:       etcdConf.TLS.Cert,
		grpcProxyKey:        etcdConf.TLS.Key,
		grpcProxyCA:         etcdConf.TLS.CaCert,
		grpcProxyNamespace:  etcdConf.Namespace,
		grpcProxyUserName:   etcdConf.UserName,
		grpcProxyPassword:   etcdConf.Password,
	}
	return obj
}

func (gp *grpcProxy) startGRPCProxy() error {

	l, err := net.Listen("tcp", gp.grpcProxyListenAddr)
	if err != nil {
		return err
	}
	if l, err = transport.NewKeepAliveListener(l, "tcp", nil); err != nil {
		return err
	}
	defer func() {
		l.Close()
	}()
	m := cmux.New(l)

	cfg, err := gp.newClientCfg()
	if err != nil {
		return err
	}

	client, err := clientv3.New(*cfg)
	if err != nil {
		return err
	}

	if len(gp.grpcProxyNamespace) > 0 {
		client.KV = namespace.NewKV(client.KV, gp.grpcProxyNamespace)
		client.Watcher = namespace.NewWatcher(client.Watcher, gp.grpcProxyNamespace)
		client.Lease = namespace.NewLease(client.Lease, gp.grpcProxyNamespace)
	}

	kvp, _ := grpcproxy.NewKvProxy(client)
	watchp, _ := grpcproxy.NewWatchProxy(client)
	leasep, _ := grpcproxy.NewLeaseProxy(client)
	mainp := grpcproxy.NewMaintenanceProxy(client)
	authp := grpcproxy.NewAuthProxy(client)
	electionp := grpcproxy.NewElectionProxy(client)
	lockp := grpcproxy.NewLockProxy(client)

	server := grpc.NewServer(
		grpc.StreamInterceptor(grpc_prometheus.StreamServerInterceptor),
		grpc.UnaryInterceptor(grpc_prometheus.UnaryServerInterceptor),
	)
	pb.RegisterKVServer(server, kvp)
	pb.RegisterWatchServer(server, watchp)
	pb.RegisterLeaseServer(server, leasep)
	pb.RegisterMaintenanceServer(server, mainp)
	pb.RegisterAuthServer(server, authp)
	v3electionpb.RegisterElectionServer(server, electionp)
	v3lockpb.RegisterLockServer(server, lockp)

	grpcl := m.Match(cmux.HTTP2())
	gp.grpcServer = server
	var eg errgroup.Group
	eg.Go(
		func() error {
			return server.Serve(grpcl)
		})
	eg.Go(
		func() error {
			return m.Serve()
		})

	return eg.Wait()
}

func (gp *grpcProxy) newClientCfg() (*clientv3.Config, error) {
	// set tls if any one tls option set
	var cfgtls *transport.TLSInfo
	tlsinfo := transport.TLSInfo{}
	if gp.grpcProxyCert != "" {
		tlsinfo.CertFile = gp.grpcProxyCert
		cfgtls = &tlsinfo
	}

	if gp.grpcProxyKey != "" {
		tlsinfo.KeyFile = gp.grpcProxyKey
		cfgtls = &tlsinfo
	}

	if gp.grpcProxyCA != "" {
		tlsinfo.CAFile = gp.grpcProxyCA
		cfgtls = &tlsinfo
	}

	etcdConfig := clientv3.Config{
		Endpoints:   gp.grpcProxyEndpoints,
		DialTimeout: 5 * time.Second,
		Username:    gp.grpcProxyUserName,
		Password:    gp.grpcProxyPassword,
	}
	if cfgtls != nil {
		clientTLS, err := cfgtls.ClientConfig()
		if err != nil {
			return nil, err
		}
		etcdConfig.TLS = clientTLS
	}

	return &etcdConfig, nil
}

func (gp *grpcProxy) close() {
	gp.grpcServer.Stop()
}
