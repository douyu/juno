package clientproxy

import (
	"context"
	"fmt"

	"github.com/coreos/etcd/clientv3"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/constx"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/go-resty/resty/v2"
	"go.uber.org/zap"
)

type simpleProxy struct {
	proxyConfigEtcd   *EtcdClient
	proxyRegisterEtcd *EtcdClient
	proxyHTTP         *restyClient
}

func initSingleProxy() (obj *simpleProxy) {
	obj = &simpleProxy{}
	// init etcd
	obj.initProxyConfigEtcd()
	obj.initProxyRegisterEtcd()
	// init proxy http server
	obj.initProxyHTTP()
	//go obj.reload()
	return
}

func (c *simpleProxy) initProxyConfigEtcd() {
	etcdClient, err := NewEtcdClient(cfg.Cfg.ClientProxy.SingleProxy.ConfigEtcd.Endpoints,
		cfg.Cfg.ClientProxy.SingleProxy.ConfigEtcd.Timeout,
		cfg.Cfg.ClientProxy.SingleProxy.ConfigEtcd.BasicAuth,
		cfg.Cfg.ClientProxy.SingleProxy.ConfigEtcd.UserName,
		cfg.Cfg.ClientProxy.SingleProxy.ConfigEtcd.Password)
	if err != nil {
		xlog.Error("simple proxy new etcd client error", zap.Error(err), zap.Strings("endpoints", cfg.Cfg.ClientProxy.SingleProxy.ConfigEtcd.Endpoints))
		return
	}
	c.proxyConfigEtcd = etcdClient
	return
}

func (c *simpleProxy) initProxyRegisterEtcd() {
	etcdClient, err := NewEtcdClient(cfg.Cfg.ClientProxy.SingleProxy.RegisterEtcd.Endpoints,
		cfg.Cfg.ClientProxy.SingleProxy.RegisterEtcd.Timeout,
		cfg.Cfg.ClientProxy.SingleProxy.RegisterEtcd.BasicAuth,
		cfg.Cfg.ClientProxy.SingleProxy.RegisterEtcd.UserName,
		cfg.Cfg.ClientProxy.SingleProxy.RegisterEtcd.Password)
	if err != nil {
		xlog.Error("simple proxy new etcd client error", zap.Error(err), zap.Strings("endpoints", cfg.Cfg.ClientProxy.SingleProxy.RegisterEtcd.Endpoints))
		return
	}
	c.proxyRegisterEtcd = etcdClient
	return
}

func (c *simpleProxy) initProxyHTTP() {
	c.proxyHTTP = newRestyClient(constx.ModeSingle, "")
	return
}

//ConfigEtcdPut ..
func (c *simpleProxy) ConfigEtcdPut(uniqZone view.UniqZone, ctx context.Context, key, val string, opts ...clientv3.OpOption) (resp *clientv3.PutResponse, err error) {
	if c.proxyConfigEtcd == nil {
		err = fmt.Errorf("etcd is nil")
		return
	}
	return c.proxyConfigEtcd.Put(ctx, key, val, opts...)
}

//ConfigEtcdGet ..
func (c *simpleProxy) ConfigEtcdGet(uniqZone view.UniqZone, ctx context.Context, key string, opts ...clientv3.OpOption) (resp *clientv3.GetResponse, err error) {
	if c.proxyConfigEtcd == nil {
		err = fmt.Errorf("etcd is nil")
		return
	}
	return c.proxyConfigEtcd.Get(ctx, key, opts...)
}

//RegisterEtcdPut ..
func (c *simpleProxy) RegisterEtcdPut(uniqZone view.UniqZone, ctx context.Context, key, val string, opts ...clientv3.OpOption) (resp *clientv3.PutResponse, err error) {
	if c.proxyRegisterEtcd == nil {
		err = fmt.Errorf("etcd is nil")
		return
	}
	return c.proxyRegisterEtcd.Put(ctx, key, val, opts...)
}

//RegisterEtcdGet ..
func (c *simpleProxy) RegisterEtcdGet(uniqZone view.UniqZone, ctx context.Context, key string, opts ...clientv3.OpOption) (resp *clientv3.GetResponse, err error) {
	if c.proxyRegisterEtcd == nil {
		err = fmt.Errorf("etcd is nil")
		return
	}
	return c.proxyRegisterEtcd.Get(ctx, key, opts...)
}

//HttpGet ..
func (c *simpleProxy) HttpGet(uniqZone view.UniqZone, req view.ReqHTTPProxy) (resp *resty.Response, err error) {
	if c.proxyHTTP == nil {
		err = fmt.Errorf("resty is nil")
		return
	}
	return c.proxyHTTP.Get(req)
}

//HttpPost ..
func (c *simpleProxy) HttpPost(uniqZone view.UniqZone, req view.ReqHTTPProxy) (resp *resty.Response, err error) {
	if c.proxyHTTP == nil {
		err = fmt.Errorf("resty is nil")
		return
	}
	return c.proxyHTTP.Post(req)
}
