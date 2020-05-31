package proxy

import (
	"github.com/douyu/jupiter/pkg/conf"
	"github.com/labstack/gommon/log"
	"net/http"
)

type HttpWorker struct {
	server *http.Server
}

func NewProxyHttpWorker() *HttpWorker {
	server := &http.Server{
		Addr: conf.GetString("clientProxy.http.listenAddr"),
		Handler: NewHttpProxy()}
	return &HttpWorker{
		server: server,
	}
}

func (worker *HttpWorker) Run() error {
	log.Infof("listening for http proxy client requests on %s", conf.GetString("clientProxy.http.listenAddr"))
	return worker.server.ListenAndServe()
}

func (worker *HttpWorker) Stop() error{
	// stop the worker
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

func (worker *GrpcWorker) Stop() error{
	log.Infof("stopping for grpc proxy")
	worker.server.close()
	return nil
}