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
	proxyEtcd *EtcdClient
	proxyHTTP *RestyClient
}

func InitSingleProxy() (obj *simplePorxy) {
	obj = &simplePorxy{}
	// init etcd
	obj.initProxyEtcd()
	// init proxy http server
	obj.initProxyHTTP()
	//go obj.reload()
	return
}

func (c *simplePorxy) initProxyEtcd() {
	etcdClient, err := NewEtcdClient(cfg.Cfg.ClientProxy.SingleProxy.Etcd.Endpoints,
		cfg.Cfg.ClientProxy.SingleProxy.Etcd.Timeout,
		cfg.Cfg.ClientProxy.SingleProxy.Etcd.BasicAuth,
		cfg.Cfg.ClientProxy.SingleProxy.Etcd.UserName,
		cfg.Cfg.ClientProxy.SingleProxy.Etcd.Password)
	if err != nil {
		xlog.Error("simple proxy new etcd client error", zap.Error(err), zap.Strings("endpoints", cfg.Cfg.ClientProxy.SingleProxy.Etcd.Endpoints))
		return
	}
	c.proxyEtcd = etcdClient
	return
}

func (c *simplePorxy) initProxyHTTP() {
	c.proxyHTTP = NewRestyClient(constx.ModeSingle, "")
	return
}

func (c *simplePorxy) EtcdPut(uniqZone view.UniqZone, ctx context.Context, key, val string, opts ...clientv3.OpOption) (resp *clientv3.PutResponse, err error) {
	if c.proxyEtcd == nil {
		err = fmt.Errorf("etcd is nil")
		return
	}
	return c.proxyEtcd.Put(ctx, key, val, opts...)
}

func (c *simplePorxy) EtcdGet(uniqZone view.UniqZone, ctx context.Context, key string, opts ...clientv3.OpOption) (resp *clientv3.GetResponse, err error) {
	if c.proxyEtcd == nil {
		err = fmt.Errorf("etcd is nil")
		return
	}
	return c.proxyEtcd.Get(ctx, key, opts...)
}

func (c *simplePorxy) HttpGet(uniqZone view.UniqZone, req view.ReqHTTPProxy) (resp *resty.Response, err error) {
	if c.proxyHTTP == nil {
		err = fmt.Errorf("resty is nil")
		return
	}
	return c.proxyHTTP.Get(req)
}

func (c *simplePorxy) HttpPost(uniqZone view.UniqZone, req view.ReqHTTPProxy) (resp *resty.Response, err error) {
	if c.proxyHTTP == nil {
		err = fmt.Errorf("resty is nil")
		return
	}
	return c.proxyHTTP.Post(req)
}
