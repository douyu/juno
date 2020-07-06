package clientproxy

import (
	"fmt"
	"sync"
	"time"

	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/errorconst"
	"github.com/go-resty/resty/v2"
	"go.etcd.io/etcd/clientv3"
)

// ClientProxy ..
var ClientProxy *clientproxy

type clientproxy struct {
	ServerProxyEtcdMap map[string]*clientv3.Client
	ServerProxyHTTPMap map[string]*resty.Client
	lock               sync.RWMutex
}

// Init ...
func Init() {
	ClientProxy = &clientproxy{
		ServerProxyEtcdMap: make(map[string]*clientv3.Client, 0),
		ServerProxyHTTPMap: make(map[string]*resty.Client, 0),
		lock:               sync.RWMutex{},
	}
	// init etcd
	ClientProxy.initServerProxyEtcdMap()

	// init proxy http server
	ClientProxy.initServerProxyHTTPMap()

	go ClientProxy.reload()
	return
}

func (c *clientproxy) initServerProxyEtcdMap() {
	c.lock.Lock()
	defer c.lock.Unlock()
	for _, cp := range cfg.Cfg.ClientProxy {
		if !cp.Etcd.Enable {
			continue
		}
		client, err := clientv3.New(clientv3.Config{
			Endpoints:   cp.Etcd.Endpoints,
			DialTimeout: time.Duration(cp.Etcd.Timeout) * time.Second,
		})
		if err != nil {
			continue
		}
		c.ServerProxyEtcdMap[GenClientProxyName(cp.Env, cp.ZoneCode)] = client
	}
	return
}

func (c *clientproxy) initServerProxyHTTPMap() {
	c.lock.Lock()
	defer c.lock.Unlock()
	for _, cp := range cfg.Cfg.ClientProxy {
		if !cp.HTTP.Enable {
			continue
		}
		client := resty.New().SetDebug(false).SetTimeout(3*time.Second).SetHeader("Content-Type", "application/json;charset=utf-8")
		c.ServerProxyHTTPMap[GenClientProxyName(cp.Env, cp.ZoneCode)] = client
	}
	return
}

// ServerProxyETCDConn ..
func (c *clientproxy) ServerProxyETCDConn(env, zoneCode string) (*clientv3.Client, error) {
	c.lock.RLock()
	defer c.lock.RUnlock()
	if conn, ok := c.ServerProxyEtcdMap[GenClientProxyName(env, zoneCode)]; ok {
		return conn, nil
	}
	// reload one time and try again
	return nil, fmt.Errorf(errorconst.CannotFindClient.Code().String() + errorconst.CannotFindClient.Name())
}

// ServerProxyHTTPConn ..
func (c *clientproxy) ServerProxyHTTPConn(env, zoneCode string) (*resty.Client, error) {
	c.lock.RLock()
	defer c.lock.RUnlock()
	if conn, ok := c.ServerProxyHTTPMap[GenClientProxyName(env, zoneCode)]; ok {
		return conn, nil
	}
	// reload one time and try again
	return nil, fmt.Errorf(errorconst.CannotFindClient.Code().String() + errorconst.CannotFindClient.Name())
}

// GenClientProxyName ..
func GenClientProxyName(env, zoneCode string) string {
	return fmt.Sprintf("%s.%s", env, zoneCode)
}

func (c *clientproxy) reload() {
	for {
		time.Sleep(time.Minute)
		c.lock.Lock()
		defer c.lock.Unlock()
		for _, cp := range cfg.Cfg.ClientProxy {
			if !cp.Etcd.Enable {
				continue
			}
			if _, ok := ClientProxy.ServerProxyEtcdMap[GenClientProxyName(cp.Env, cp.ZoneCode)]; ok {
				continue
			}
			client, err := clientv3.New(clientv3.Config{
				Endpoints:   cp.Etcd.Endpoints,
				DialTimeout: time.Duration(cp.Etcd.Timeout) * time.Second,
			})
			if err != nil {
				continue
			}
			ClientProxy.ServerProxyEtcdMap[GenClientProxyName(cp.Env, cp.ZoneCode)] = client
		}
		return
	}

}
