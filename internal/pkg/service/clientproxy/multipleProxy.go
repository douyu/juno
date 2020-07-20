package clientproxy

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/constx"
	"github.com/douyu/juno/pkg/errorconst"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/go-resty/resty/v2"
	"go.etcd.io/etcd/clientv3"
	"go.uber.org/zap"
)

type multiProxy struct {
	proxyEtcdMap map[string]*EtcdClient
	proxyHTTPMap map[string]*RestyClient
	lock         sync.RWMutex
}

func InitMultiProxy() (obj *multiProxy) {
	obj = &multiProxy{
		proxyEtcdMap: make(map[string]*EtcdClient, 0),
		proxyHTTPMap: make(map[string]*RestyClient, 0),
		lock:         sync.RWMutex{},
	}
	// init etcd
	obj.initProxyEtcdMap()

	// init proxy http server
	obj.initServerProxyHTTPMap()
	// process timing problem
	go obj.reload()
	return
}

func (c *multiProxy) initProxyEtcdMap() {
	c.lock.Lock()
	defer c.lock.Unlock()
	for _, cp := range cfg.Cfg.ClientProxy.MultiProxy {
		if !cp.Etcd.Enable {
			continue
		}
		uniqZone := view.UniqZone{
			Env:  cp.Env,
			Zone: cp.ZoneCode,
		}
		conn, err := NewEtcdClient(cp.Etcd.Endpoints, cp.Etcd.Timeout)
		if err != nil {
			xlog.Error("init proxy etcd error", zap.String("unicode", uniqZone.String()), zap.Error(err))
			continue
		}
		xlog.Info("init proxy etcd", zap.String("unicode", uniqZone.String()))
		c.proxyEtcdMap[uniqZone.String()] = conn
	}
	return
}

func (c *multiProxy) initServerProxyHTTPMap() {
	c.lock.Lock()
	defer c.lock.Unlock()
	for _, cp := range cfg.Cfg.ClientProxy.MultiProxy {
		if !cp.HTTP.Enable {
			continue
		}
		uniqZone := view.UniqZone{
			Zone: cp.ZoneCode,
			Env:  cp.Env,
		}
		c.proxyHTTPMap[uniqZone.String()] = NewRestyClient(constx.ModeMultiple, cp.HTTP.Scheme+"://"+cp.HTTP.ListenAddr)
	}
	return
}

func (c *multiProxy) EtcdPut(uniqZone view.UniqZone, ctx context.Context, key, val string, opts ...clientv3.OpOption) (resp *clientv3.PutResponse, err error) {
	c.lock.RLock()
	conn, ok := c.proxyEtcdMap[uniqZone.String()]
	c.lock.RUnlock()
	if !ok {
		xlog.Error("multi proxy etcd put uniq zone err", zap.String("env", uniqZone.Env), zap.String("zone", uniqZone.Zone))
		err = fmt.Errorf(errorconst.CannotFindClientETCD.Code().String() + errorconst.CannotFindClientETCD.Name())
		return
	}
	return conn.Put(ctx, key, val)
}

func (c *multiProxy) EtcdGet(uniqZone view.UniqZone, ctx context.Context, key string, opts ...clientv3.OpOption) (resp *clientv3.GetResponse, err error) {
	c.lock.RLock()
	conn, ok := c.proxyEtcdMap[uniqZone.String()]
	c.lock.RUnlock()
	if !ok {
		xlog.Error("multi proxy etcd get uniq zone err", zap.String("env", uniqZone.Env), zap.String("zone", uniqZone.Zone))
		err = fmt.Errorf(errorconst.CannotFindClientETCD.Code().String() + errorconst.CannotFindClientETCD.Name())
		return
	}
	return conn.Get(ctx, key, opts...)
}

func (c *multiProxy) HttpGet(uniqZone view.UniqZone, req view.ReqHTTPProxy) (resp *resty.Response, err error) {
	c.lock.RLock()
	conn, ok := c.proxyHTTPMap[uniqZone.String()]
	c.lock.RUnlock()
	if !ok {
		xlog.Error("multi proxy http get uniq zone err", zap.String("env", uniqZone.Env), zap.String("zone", uniqZone.Zone))
		err = fmt.Errorf(errorconst.CannotFindClientHTTP.Code().String() + errorconst.CannotFindClientHTTP.Name())
		return
	}
	return conn.Get(req)
}

func (c *multiProxy) HttpPost(uniqZone view.UniqZone, req view.ReqHTTPProxy) (resp *resty.Response, err error) {
	c.lock.RLock()
	conn, ok := c.proxyHTTPMap[uniqZone.String()]
	c.lock.RUnlock()
	if !ok {
		xlog.Error("multi proxy http post uniq zone err", zap.String("env", uniqZone.Env), zap.String("zone", uniqZone.Zone))
		err = fmt.Errorf(errorconst.CannotFindClientHTTP.Code().String() + errorconst.CannotFindClientHTTP.Name())
		return
	}
	return conn.Post(req)
}

func (c *multiProxy) reload() {
	for {
		time.Sleep(time.Minute)
		c.lock.Lock()
		defer c.lock.Unlock()
		for _, cp := range cfg.Cfg.ClientProxy.MultiProxy {
			if !cp.Etcd.Enable {
				continue
			}
			uniqZone := view.UniqZone{
				Zone: cp.ZoneCode,
				Env:  cp.Env,
			}
			if _, ok := c.proxyEtcdMap[uniqZone.String()]; ok {
				continue
			}
			conn, err := NewEtcdClient(cp.Etcd.Endpoints, cp.Etcd.Timeout)
			if err != nil {
				xlog.Error("init proxy etcd error", zap.String("unicode", uniqZone.String()), zap.Error(err))
				continue
			}
			xlog.Info("init proxy etcd", zap.String("unicode", uniqZone.String()))
			c.proxyEtcdMap[uniqZone.String()] = conn
		}
		return
	}

}
