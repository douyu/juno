package clientproxy

import (
	"context"
	"fmt"
	"go.etcd.io/etcd/clientv3"
	"time"
)

type EtcdClient struct {
	conn *clientv3.Client
}

func NewEtcdClient(endpoints []string, timeout time.Duration) (obj *EtcdClient, err error) {
	obj = &EtcdClient{}
	obj.conn, err = clientv3.New(clientv3.Config{
		Endpoints:   endpoints,
		DialTimeout: timeout,
	})
	return
}

func (e *EtcdClient) Put(ctx context.Context, key, val string, opts ...clientv3.OpOption) (resp *clientv3.PutResponse, err error) {
	if !whiteKey(key) {
		err = fmt.Errorf("this key is invalid, key %s", key)
		return
	}
	resp, err = e.conn.Put(ctx, key, val)
	return
}

func (e *EtcdClient) Get(ctx context.Context, key string, opts ...clientv3.OpOption) (resp *clientv3.GetResponse, err error) {
	if !whiteKey(key) {
		return nil, fmt.Errorf("this key is invalid, key %s", key)
	}
	return e.conn.Get(ctx, key)
}

func whiteKey(key string) bool {
	return true
}
