package clientproxy

import (
	"context"
	"fmt"

	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/constx"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/go-resty/resty/v2"
	"go.etcd.io/etcd/clientv3"
	"go.uber.org/zap"
)

type simplePorxy struct {
	proxyConfigEtcd   *EtcdClient
	proxyRegisterEtcd *EtcdClient
	proxyHTTP         *restyClient
}

func initSingleProxy() (obj *simplePorxy) {
	obj = &simplePorxy{}
	// init etcd
	obj.initProxyConfigEtcd()
	obj.initProxyRegisterEtcd()
	// init proxy http server
	obj.initProxyHTTP()
	//go obj.reload()
	return
}

func (c *simplePorxy) initProxyConfigEtcd() {
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

func (c *simplePorxy) initProxyRegisterEtcd() {
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

func (c *simplePorxy) initProxyHTTP() {
	c.proxyHTTP = newRestyClient(constx.ModeSingle, "")
	return
}

//ConfigEtcdPut ..
func (c *simplePorxy) ConfigEtcdPut(uniqZone view.UniqZone, ctx context.Context, key, val string, opts ...clientv3.OpOption) (resp *clientv3.PutResponse, err error) {
	if c.proxyConfigEtcd == nil {
		err = fmt.Errorf("etcd is nil")
		return
	}
	return c.proxyConfigEtcd.Put(ctx, key, val, opts...)
}

//ConfigEtcdGet ..
func (c *simplePorxy) ConfigEtcdGet(uniqZone view.UniqZone, ctx context.Context, key string, opts ...clientv3.OpOption) (resp *clientv3.GetResponse, err error) {
	if c.proxyConfigEtcd == nil {
		err = fmt.Errorf("etcd is nil")
		return
	}
	return c.proxyConfigEtcd.Get(ctx, key, opts...)
}

//RegisterEtcdPut ..
func (c *simplePorxy) RegisterEtcdPut(uniqZone view.UniqZone, ctx context.Context, key, val string, opts ...clientv3.OpOption) (resp *clientv3.PutResponse, err error) {
	if c.proxyRegisterEtcd == nil {
		err = fmt.Errorf("etcd is nil")
		return
	}
	return c.proxyRegisterEtcd.Put(ctx, key, val, opts...)
}

//RegisterEtcdGet ..
func (c *simplePorxy) RegisterEtcdGet(uniqZone view.UniqZone, ctx context.Context, key string, opts ...clientv3.OpOption) (resp *clientv3.GetResponse, err error) {
	if c.proxyRegisterEtcd == nil {
		err = fmt.Errorf("etcd is nil")
		return
	}
	return c.proxyRegisterEtcd.Get(ctx, key, opts...)
}

//HttpGet ..
func (c *simplePorxy) HttpGet(uniqZone view.UniqZone, req view.ReqHTTPProxy) (resp *resty.Response, err error) {
	if c.proxyHTTP == nil {
		err = fmt.Errorf("resty is nil")
		return
	}
	return c.proxyHTTP.Get(req)
}

//HttpPost ..
func (c *simplePorxy) HttpPost(uniqZone view.UniqZone, req view.ReqHTTPProxy) (resp *resty.Response, err error) {
	if c.proxyHTTP == nil {
		err = fmt.Errorf("resty is nil")
		return
	}
	return c.proxyHTTP.Post(req)
}
