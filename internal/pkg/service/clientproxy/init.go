package clientproxy

import (
	"fmt"
	"sync"
	"time"

	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/errorconst"
	"go.etcd.io/etcd/clientv3"
)

// ClientProxy ..
var ClientProxy *clientproxy

type clientproxy struct {
	EtcdMap map[string]*clientv3.Client
	lock    sync.RWMutex
}

// Init ...
func Init() {
	ClientProxy = &clientproxy{
		EtcdMap: make(map[string]*clientv3.Client, 0),
		lock:    sync.RWMutex{},
	}
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
		ClientProxy.EtcdMap[GenClientProxyName(cp.Env, cp.ZoneCode)] = client
	}
	return
}

// Conn ..
func (c *clientproxy) Conn(env, zoneCode string) (*clientv3.Client, error) {
	c.lock.RLock()
	defer c.lock.RUnlock()
	if conn, ok := c.EtcdMap[GenClientProxyName(env, zoneCode)]; ok {
		return conn, nil
	}
	return nil, fmt.Errorf(errorconst.ParamCannotFindClientProxy.Code().String() + errorconst.ParamCannotFindClientProxy.Name())
}

func GenClientProxyName(env, zoneCode string)string{
	return fmt.Sprintf("%s.%s", env, zoneCode)
}
