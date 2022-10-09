package clientproxy

import (
	"context"
	"fmt"

	"github.com/douyu/juno/pkg/model/view"
	clientv3 "go.etcd.io/etcd/client/v3"
)

type EtcdClient struct {
	conn *clientv3.Client

	UniqueZone *view.UniqZone
}

type EtcdClientOption func(e *EtcdClient)

// NewEtcdClient ..
func NewEtcdClient(cfg clientv3.Config, options ...EtcdClientOption) (obj *EtcdClient, err error) {
	obj = &EtcdClient{}
	obj.conn, err = clientv3.New(cfg)

	for _, option := range options {
		option(obj)
	}

	return
}

func (e *EtcdClient) Conn() *clientv3.Client {
	return e.conn
}

func (e *EtcdClient) Put(ctx context.Context, key, val string, opts ...clientv3.OpOption) (resp *clientv3.PutResponse, err error) {
	if !whiteKey(key) {
		err = fmt.Errorf("this key is invalid, key %s", key)
		return
	}
	resp, err = e.conn.Put(ctx, key, val, opts...)
	return
}

func (e *EtcdClient) Get(ctx context.Context, key string, opts ...clientv3.OpOption) (resp *clientv3.GetResponse, err error) {
	if !whiteKey(key) {
		return nil, fmt.Errorf("this key is invalid, key %s", key)
	}
	return e.conn.Get(ctx, key, opts...)
}

func whiteKey(key string) bool {
	return true
}

func WithUniqueZone(zone *view.UniqZone) EtcdClientOption {
	return func(e *EtcdClient) {
		e.UniqueZone = zone
	}
}
