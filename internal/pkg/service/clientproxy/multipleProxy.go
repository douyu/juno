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
	defaultConfigEtcdMap map[string]*EtcdClient
	proxyRegisterEtcdMap map[string]*EtcdClient
	proxyHTTPMap         map[string]*restyClient
	lock                 sync.RWMutex
}

//initMultiProxy ..
func initMultiProxy() (obj *multiProxy) {
	obj = &multiProxy{
		defaultConfigEtcdMap: make(map[string]*EtcdClient, 0),
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
		if !cp.DefaultEtcd.Enable {
			continue
		}
		uniqZone := view.UniqZone{
			Env:  cp.Env,
			Zone: cp.ZoneCode,
		}
		conn, err := c.loadEtcdClient(cp.DefaultEtcd, uniqZone)
		if err != nil {
			xlog.Error("init proxy etcd error", zap.String("unicode", uniqZone.String()), zap.Error(err))
			continue
		}
		xlog.Info("init proxy etcd", zap.String("unicode", uniqZone.String()))
		c.defaultConfigEtcdMap[uniqZone.String()] = conn
	}
	return
}

func (c *multiProxy) loadEtcdClient(etcd cfg.Etcd, zone view.UniqZone) (conn *EtcdClient, err error) {
	conn, err = NewEtcdClient(
		clientv3.Config{
			Endpoints:   etcd.Endpoints,
			DialTimeout: etcd.Timeout,
			Username:    etcd.UserName,
			Password:    etcd.Password,
		},
		WithUniqueZone(&zone),
	)
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
		conn, err := c.loadEtcdClient(cp.RegisterEtcd, uniqZone)
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

func (c *multiProxy) DefaultEtcdClients() []*EtcdClient {
	clients := make([]*EtcdClient, 0)
	for _, client := range c.defaultConfigEtcdMap {
		clients = append(clients, client)
	}

	return clients
}

//ConfigEtcdPut ..
func (c *multiProxy) DefaultEtcdPut(uniqZone view.UniqZone, ctx context.Context, key, val string, opts ...clientv3.OpOption) (resp *clientv3.PutResponse, err error) {
	conn, ok := c.getDefaultEtcd(uniqZone)
	if !ok {
		xlog.Error("multi proxy etcd put uniq zone err", zap.String("env", uniqZone.Env), zap.String("zone", uniqZone.Zone))
		err = fmt.Errorf(errorconst.CannotFindClientETCD.Code().String() + errorconst.CannotFindClientETCD.Name())
		return
	}
	return conn.Put(ctx, key, val, opts...)
}

//ConfigEtcdPut ..
func (c *multiProxy) DefaultEtcd(uniqZone view.UniqZone) *clientv3.Client {
	conn, ok := c.getDefaultEtcd(uniqZone)
	if !ok {
		return nil
	}
	return conn.conn
}

//ConfigEtcdGet ..
func (c *multiProxy) DefaultEtcdGet(uniqZone view.UniqZone, ctx context.Context, key string, opts ...clientv3.OpOption) (resp *clientv3.GetResponse, err error) {
	conn, ok := c.getDefaultEtcd(uniqZone)
	if !ok {
		xlog.Error("multi proxy etcd get uniq zone err", zap.String("env", uniqZone.Env), zap.String("zone", uniqZone.Zone))
		err = fmt.Errorf(errorconst.CannotFindClientETCD.Code().String() + errorconst.CannotFindClientETCD.Name())
		return
	}
	xlog.Info("multiProxy", zap.String("step", "DefaultEtcdGet"), zap.String("key", key))

	return conn.Get(ctx, key, opts...)
}

func (c *multiProxy) getDefaultEtcd(uniqZone view.UniqZone) (*EtcdClient, bool) {
	c.lock.RLock()
	defer c.lock.RUnlock()
	conn, ok := c.defaultConfigEtcdMap[uniqZone.String()]
	return conn, ok
}

func (c *multiProxy) getRegisterEtcd(uniqZone view.UniqZone) (*EtcdClient, bool) {
	c.lock.RLock()
	defer c.lock.RUnlock()
	conn, ok := c.proxyRegisterEtcdMap[uniqZone.String()]
	return conn, ok
}

//RegisterEtcdPut ..
func (c *multiProxy) RegisterEtcdPut(uniqZone view.UniqZone, ctx context.Context, key, val string, opts ...clientv3.OpOption) (resp *clientv3.PutResponse, err error) {
	conn, ok := c.getRegisterEtcd(uniqZone)
	if !ok {
		xlog.Error("multi proxy etcd put uniq zone err", zap.String("env", uniqZone.Env), zap.String("zone", uniqZone.Zone))
		err = fmt.Errorf(errorconst.CannotFindClientETCD.Code().String() + errorconst.CannotFindClientETCD.Name())
		return
	}
	return conn.Put(ctx, key, val, opts...)
}

//RegisterEtcdGet ..
func (c *multiProxy) RegisterEtcdGet(uniqZone view.UniqZone, ctx context.Context, key string, opts ...clientv3.OpOption) (resp *clientv3.GetResponse, err error) {
	conn, ok := c.getRegisterEtcd(uniqZone)
	if !ok {
		xlog.Error("multi proxy etcd get uniq zone err", zap.String("env", uniqZone.Env), zap.String("zone", uniqZone.Zone))
		err = fmt.Errorf(errorconst.CannotFindClientETCD.Code().String() + errorconst.CannotFindClientETCD.Name())
		return
	}
	xlog.Info("multiProxy", zap.String("step", "DefaultEtcdGet"), zap.String("key", key))

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
		if !cp.DefaultEtcd.Enable {
			continue
		}
		uniqZone := view.UniqZone{
			Zone: cp.ZoneCode,
			Env:  cp.Env,
		}
		if _, ok := c.defaultConfigEtcdMap[uniqZone.String()]; ok {
			continue
		}
		conn, err := c.loadEtcdClient(cp.DefaultEtcd, uniqZone)
		if err != nil {
			xlog.Error("init proxy etcd error", zap.String("unicode", uniqZone.String()), zap.Error(err))
			continue
		}
		xlog.Info("init proxy etcd", zap.String("unicode", uniqZone.String()))
		c.defaultConfigEtcdMap[uniqZone.String()] = conn
	}
	return
}
