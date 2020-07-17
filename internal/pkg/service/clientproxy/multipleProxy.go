package clientproxy

import (
	"context"
	"fmt"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/constx"
	"github.com/douyu/juno/pkg/errorconst"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/go-resty/resty/v2"
	"go.etcd.io/etcd/clientv3"
	"sync"
)

type multiPorxy struct {
	proxyEtcdMap map[string]*EtcdClient
	proxyHTTPMap map[string]*RestyClient
	lock         sync.RWMutex
}

func InitMultiProxy() (obj *multiPorxy) {
	obj = &multiPorxy{
		proxyEtcdMap: make(map[string]*EtcdClient, 0),
		proxyHTTPMap: make(map[string]*RestyClient, 0),
		lock:         sync.RWMutex{},
	}
	// init etcd
	obj.initProxyEtcdMap()

	// init proxy http server
	obj.initServerProxyHTTPMap()
	return
	//go obj.reload()
}

func (c *multiPorxy) initProxyEtcdMap() {
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
		conn, err := NewEtcdClient(cp.Etcd.Endpoints, cp.Etcd.Timeout)
		if err != nil {
			continue
		}
		c.proxyEtcdMap[uniqZone.String()] = conn
	}
	return
}

func (c *multiPorxy) initServerProxyHTTPMap() {
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

// ServerProxyHTTPConn ..
func (c *multiPorxy) ServerProxyHTTPConn(uniqZone view.UniqZone) (*RestyClient, error) {

	if conn, ok := c.proxyHTTPMap[uniqZone.String()]; ok {
		return conn, nil
	}
	// reload one time and try again
	return nil, fmt.Errorf(errorconst.CannotFindClientHTTP.Code().String() + errorconst.CannotFindClientHTTP.Name())
}

func (c *multiPorxy) EtcdPut(uniqZone view.UniqZone, ctx context.Context, key, val string, opts ...clientv3.OpOption) (resp *clientv3.PutResponse, err error) {
	c.lock.RLock()
	conn, ok := c.proxyEtcdMap[uniqZone.String()]
	c.lock.RUnlock()
	if !ok {
		err = fmt.Errorf(errorconst.CannotFindClientETCD.Code().String() + errorconst.CannotFindClientETCD.Name())
		return
	}
	return conn.Put(ctx, key, val)
}

func (c *multiPorxy) EtcdGet(uniqZone view.UniqZone, ctx context.Context, key string, opts ...clientv3.OpOption) (resp *clientv3.GetResponse, err error) {
	c.lock.RLock()
	conn, ok := c.proxyEtcdMap[uniqZone.String()]
	c.lock.RUnlock()
	if !ok {
		err = fmt.Errorf(errorconst.CannotFindClientETCD.Code().String() + errorconst.CannotFindClientETCD.Name())
		return
	}
	return conn.Get(ctx, key)
}

func (c *multiPorxy) HttpGet(uniqZone view.UniqZone, req view.ReqHTTPProxy) (resp *resty.Response, err error) {
	c.lock.RLock()
	conn, ok := c.proxyHTTPMap[uniqZone.String()]
	c.lock.RUnlock()
	if !ok {
		err = fmt.Errorf(errorconst.CannotFindClientHTTP.Code().String() + errorconst.CannotFindClientHTTP.Name())
		return
	}
	return conn.Get(req)
}

func (c *multiPorxy) HttpPost(uniqZone view.UniqZone, req view.ReqHTTPProxy) (resp *resty.Response, err error) {
	c.lock.RLock()
	conn, ok := c.proxyHTTPMap[uniqZone.String()]
	c.lock.RUnlock()
	if !ok {
		err = fmt.Errorf(errorconst.CannotFindClientHTTP.Code().String() + errorconst.CannotFindClientHTTP.Name())
		return
	}
	return conn.Post(req)
}

//
//
//func (c *multiPorxy) reload() {
//	for {
//		time.Sleep(time.Minute)
//		c.lock.Lock()
//		defer c.lock.Unlock()
//		for _, cp := range cfg.Cfg.MultiProxy {
//			if !cp.Etcd.Enable {
//				continue
//			}
//			uniqZone := view.UniqZone{
//				Zone: cp.ZoneCode,
//				Env:  cp.Env,
//			}
//			if value, ok := c.proxyEtcdMap[uniqZone.String()]; ok {
//				if value.Error() != nil {
//
//				}
//			}
//			client, err := clientv3.New(clientv3.Config{
//				Endpoints:   cp.Etcd.Endpoints,
//				DialTimeout: time.Duration(cp.Etcd.Timeout) * time.Second,
//			})
//			if err != nil {
//				continue
//			}
//			c.ServerProxyEtcdMap[GenClientProxyName(cp.Env, cp.ZoneCode)] = client
//		}
//		return
//	}
//
//}
