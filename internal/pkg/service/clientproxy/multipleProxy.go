package clientproxy

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/douyu/jupiter/pkg/util/xgo"

	"github.com/coreos/etcd/clientv3"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/constx"
	"github.com/douyu/juno/pkg/errorconst"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/go-resty/resty/v2"
	"go.uber.org/zap"
)

type multiProxy struct {
	proxyConfigEtcdMap   map[string]*EtcdClient
	proxyRegisterEtcdMap map[string]*EtcdClient
	proxyHTTPMap         map[string]*restyClient
	lock                 sync.RWMutex
}

//initMultiProxy ..
func initMultiProxy() (obj *multiProxy) {
	obj = &multiProxy{
		proxyConfigEtcdMap:   make(map[string]*EtcdClient, 0),
		proxyRegisterEtcdMap: make(map[string]*EtcdClient, 0),
		proxyHTTPMap:         make(map[string]*restyClient, 0),
		lock:                 sync.RWMutex{},
	}
	// init etcd
	obj.initProxyConfigEtcdMap()
	obj.initProxyRegisterEtcdMap()
	// init proxy http server
	obj.initServerProxyHTTPMap()
	// process timing problem
	xgo.Go(func() {
		for {
			time.Sleep(time.Minute)
			obj.reload()
		}
	})
	return
}

func (c *multiProxy) initProxyConfigEtcdMap() {
	c.lock.Lock()
	defer c.lock.Unlock()
	for _, cp := range cfg.Cfg.ClientProxy.MultiProxy {
		if !cp.ConfigEtcd.Enable {
			continue
		}
		uniqZone := view.UniqZone{
			Env:  cp.Env,
			Zone: cp.ZoneCode,
		}
		conn, err := NewEtcdClient(cp.ConfigEtcd.Endpoints, cp.ConfigEtcd.Timeout, cp.ConfigEtcd.BasicAuth, cp.ConfigEtcd.UserName, cp.ConfigEtcd.Password)
		if err != nil {
			xlog.Error("init proxy etcd error", zap.String("unicode", uniqZone.String()), zap.Error(err))
			continue
		}
		xlog.Info("init proxy etcd", zap.String("unicode", uniqZone.String()))
		c.proxyConfigEtcdMap[uniqZone.String()] = conn
	}
	return
}

func (c *multiProxy) initProxyRegisterEtcdMap() {
	c.lock.Lock()
	defer c.lock.Unlock()
	for _, cp := range cfg.Cfg.ClientProxy.MultiProxy {
		if !cp.RegisterEtcd.Enable {
			continue
		}
		uniqZone := view.UniqZone{
			Env:  cp.Env,
			Zone: cp.ZoneCode,
		}
		conn, err := NewEtcdClient(cp.RegisterEtcd.Endpoints, cp.RegisterEtcd.Timeout, cp.RegisterEtcd.BasicAuth, cp.RegisterEtcd.UserName, cp.RegisterEtcd.Password)
		if err != nil {
			xlog.Error("init proxy etcd error", zap.String("unicode", uniqZone.String()), zap.Error(err))
			continue
		}
		xlog.Info("init proxy etcd", zap.String("unicode", uniqZone.String()))
		c.proxyRegisterEtcdMap[uniqZone.String()] = conn
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
		c.proxyHTTPMap[uniqZone.String()] = newRestyClient(constx.ModeMultiple, cp.HTTP.Scheme+"://"+cp.HTTP.ListenAddr)
	}
	return
}

//ConfigEtcdPut ..
func (c *multiProxy) ConfigEtcdPut(uniqZone view.UniqZone, ctx context.Context, key, val string, opts ...clientv3.OpOption) (resp *clientv3.PutResponse, err error) {
	c.lock.RLock()
	conn, ok := c.proxyConfigEtcdMap[uniqZone.String()]
	c.lock.RUnlock()
	if !ok {
		xlog.Error("multi proxy etcd put uniq zone err", zap.String("env", uniqZone.Env), zap.String("zone", uniqZone.Zone))
		err = fmt.Errorf(errorconst.CannotFindClientETCD.Code().String() + errorconst.CannotFindClientETCD.Name())
		return
	}
	return conn.Put(ctx, key, val, opts...)
}

//ConfigEtcdGet ..
func (c *multiProxy) ConfigEtcdGet(uniqZone view.UniqZone, ctx context.Context, key string, opts ...clientv3.OpOption) (resp *clientv3.GetResponse, err error) {
	c.lock.RLock()
	conn, ok := c.proxyConfigEtcdMap[uniqZone.String()]
	c.lock.RUnlock()
	if !ok {
		xlog.Error("multi proxy etcd get uniq zone err", zap.String("env", uniqZone.Env), zap.String("zone", uniqZone.Zone))
		err = fmt.Errorf(errorconst.CannotFindClientETCD.Code().String() + errorconst.CannotFindClientETCD.Name())
		return
	}
	xlog.Info("multiProxy", zap.String("step", "ConfigEtcdGet"), zap.String("key", key), xlog.Any("opts", opts))

	return conn.Get(ctx, key, opts...)
}

//RegisterEtcdPut ..
func (c *multiProxy) RegisterEtcdPut(uniqZone view.UniqZone, ctx context.Context, key, val string, opts ...clientv3.OpOption) (resp *clientv3.PutResponse, err error) {
	c.lock.RLock()
	conn, ok := c.proxyConfigEtcdMap[uniqZone.String()]
	c.lock.RUnlock()
	if !ok {
		xlog.Error("multi proxy etcd put uniq zone err", zap.String("env", uniqZone.Env), zap.String("zone", uniqZone.Zone))
		err = fmt.Errorf(errorconst.CannotFindClientETCD.Code().String() + errorconst.CannotFindClientETCD.Name())
		return
	}
	return conn.Put(ctx, key, val, opts...)
}

//RegisterEtcdGet ..
func (c *multiProxy) RegisterEtcdGet(uniqZone view.UniqZone, ctx context.Context, key string, opts ...clientv3.OpOption) (resp *clientv3.GetResponse, err error) {
	c.lock.RLock()
	conn, ok := c.proxyConfigEtcdMap[uniqZone.String()]
	c.lock.RUnlock()
	if !ok {
		xlog.Error("multi proxy etcd get uniq zone err", zap.String("env", uniqZone.Env), zap.String("zone", uniqZone.Zone))
		err = fmt.Errorf(errorconst.CannotFindClientETCD.Code().String() + errorconst.CannotFindClientETCD.Name())
		return
	}
	xlog.Info("multiProxy", zap.String("step", "ConfigEtcdGet"), zap.String("key", key), xlog.Any("opts", opts))

	return conn.Get(ctx, key, opts...)
}

//HttpGet ..
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

//HttpPost ..
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
	c.lock.Lock()
	defer c.lock.Unlock()
	for _, cp := range cfg.Cfg.ClientProxy.MultiProxy {
		if !cp.ConfigEtcd.Enable {
			continue
		}
		uniqZone := view.UniqZone{
			Zone: cp.ZoneCode,
			Env:  cp.Env,
		}
		if _, ok := c.proxyConfigEtcdMap[uniqZone.String()]; ok {
			continue
		}
		conn, err := NewEtcdClient(cp.ConfigEtcd.Endpoints, cp.ConfigEtcd.Timeout, cp.ConfigEtcd.BasicAuth, cp.ConfigEtcd.UserName, cp.ConfigEtcd.Password)
		if err != nil {
			xlog.Error("init proxy etcd error", zap.String("unicode", uniqZone.String()), zap.Error(err))
			continue
		}
		xlog.Info("init proxy etcd", zap.String("unicode", uniqZone.String()))
		c.proxyConfigEtcdMap[uniqZone.String()] = conn
	}
	return
}
