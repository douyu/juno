package clientproxy

import (
	"context"

	"github.com/coreos/etcd/clientv3"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/go-resty/resty/v2"
)

type clientProxy interface {
	DefaultEtcdPut(uniqZone view.UniqZone, ctx context.Context, key, val string, opts ...clientv3.OpOption) (resp *clientv3.PutResponse, err error)
	DefaultEtcdGet(uniqZone view.UniqZone, ctx context.Context, key string, opts ...clientv3.OpOption) (resp *clientv3.GetResponse, err error)
	RegisterEtcdPut(uniqZone view.UniqZone, ctx context.Context, key, val string, opts ...clientv3.OpOption) (resp *clientv3.PutResponse, err error)
	RegisterEtcdGet(uniqZone view.UniqZone, ctx context.Context, key string, opts ...clientv3.OpOption) (resp *clientv3.GetResponse, err error)
	DefaultEtcdClients() []*EtcdClient
	DefaultEtcd(uniqZone view.UniqZone) *clientv3.Client
	HttpGet(uniqZone view.UniqZone, req view.ReqHTTPProxy) (resp *resty.Response, err error)
	HttpPost(uniqZone view.UniqZone, req view.ReqHTTPProxy) (resp *resty.Response, err error)
}
