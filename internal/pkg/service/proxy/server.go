package proxy

import (
	"net/http"

	"github.com/douyu/juno/pkg/cfg"
	"github.com/labstack/gommon/log"
)

type HttpWorker struct {
	server *http.Server
}

func NewProxyHttpWorker() *HttpWorker {
	server := &http.Server{
		Addr:    cfg.Cfg.ServerProxy.Prometheus.ListenAddr,
		Handler: NewHTTPProxy()}
	return &HttpWorker{
		server: server,
	}
}

// Run ..
func (worker *HttpWorker) Run() error {
	log.Infof("listening for http proxy client requests on %s", cfg.Cfg.ServerProxy.Prometheus.ListenAddr)
	return worker.server.ListenAndServe()
}

// Stop the worker
func (worker *HttpWorker) Stop() error {
	log.Infof("stopping for http proxy")
	return worker.server.Close()
}

type GrpcWorker struct {
	server *grpcProxy
}

func NewProxyGrpcWorker() *GrpcWorker {
	return &GrpcWorker{
		server: NewEtcdGrpcProxy(),
	}
}

func (worker *GrpcWorker) Run() error {
	log.Infof("listening for grpc proxy client requests on %s", worker.server.grpcProxyListenAddr)
	return worker.server.startGRPCProxy()
}

func (worker *GrpcWorker) Stop() error {
	log.Infof("stopping for grpc proxy")
	worker.server.close()
	return nil
}
