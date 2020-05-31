package proxy

import (
	"github.com/douyu/jupiter/pkg/conf"
	"golang.org/x/sync/errgroup"
	"net"
	"time"

	"github.com/coreos/etcd/clientv3"
	"github.com/coreos/etcd/clientv3/namespace"
	"github.com/coreos/etcd/etcdserver/api/v3election/v3electionpb"
	"github.com/coreos/etcd/etcdserver/api/v3lock/v3lockpb"
	pb "github.com/coreos/etcd/etcdserver/etcdserverpb"
	"github.com/coreos/etcd/pkg/transport"
	"github.com/coreos/etcd/proxy/grpcproxy"

	"github.com/cockroachdb/cmux"
	grpc_prometheus "github.com/grpc-ecosystem/go-grpc-prometheus"
	"google.golang.org/grpc"
)

type grpcProxy struct {
	grpcProxyListenAddr        string
	grpcProxyEndpoints         []string
	grpcProxyCert              string
	grpcProxyKey               string
	grpcProxyCA                string
	grpcProxyNamespace string

	grpcServer *grpc.Server
}

func NewEtcdGrpcProxy() *grpcProxy{
	grpcProxyListenAddr := conf.GetString("clientProxy.etcd.listenAddr")
	if grpcProxyListenAddr == "" {
		grpcProxyListenAddr = "127.0.0.1:23790"
	}

	grpcProxyEndpoints := conf.GetStringSlice("clientProxy.etcd.endpoints")
	if len(grpcProxyEndpoints) == 0 {
		grpcProxyEndpoints = []string{"127.0.0.1:2379"}
	}

	obj := &grpcProxy{
		grpcProxyListenAddr: grpcProxyListenAddr,
		grpcProxyEndpoints: grpcProxyEndpoints,
		grpcProxyCert: conf.GetString("clientProxy.etcd.tls.cert"),
		grpcProxyKey: conf.GetString("clientProxy.etcd.tls.key"),
		grpcProxyCA: conf.GetString("clientProxy.etcd.tls.cacert"),
		grpcProxyNamespace: conf.GetString("clientProxy.etcd.namespace"),
	}
	return obj
}

func (gp *grpcProxy)startGRPCProxy() error {
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

func (gp *grpcProxy)newClientCfg() (*clientv3.Config, error) {
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

	cfg := clientv3.Config{
		Endpoints:   gp.grpcProxyEndpoints,
		DialTimeout: 5 * time.Second,
	}
	if cfgtls != nil {
		clientTLS, err := cfgtls.ClientConfig()
		if err != nil {
			return nil, err
		}
		cfg.TLS = clientTLS
	}

	return &cfg, nil
}

func (gp *grpcProxy)close()  {
	gp.grpcServer.Stop()
}