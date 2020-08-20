package clientproxy

import (
	"context"

	"github.com/douyu/juno/pkg/model/view"
	"github.com/go-resty/resty/v2"
	"go.etcd.io/etcd/clientv3"
)

type clientProxy interface {
	ConfigEtcdPut(uniqZone view.UniqZone, ctx context.Context, key, val string, opts ...clientv3.OpOption) (resp *clientv3.PutResponse, err error)
	ConfigEtcdGet(uniqZone view.UniqZone, ctx context.Context, key string, opts ...clientv3.OpOption) (resp *clientv3.GetResponse, err error)
	RegisterEtcdPut(uniqZone view.UniqZone, ctx context.Context, key, val string, opts ...clientv3.OpOption) (resp *clientv3.PutResponse, err error)
	RegisterEtcdGet(uniqZone view.UniqZone, ctx context.Context, key string, opts ...clientv3.OpOption) (resp *clientv3.GetResponse, err error)
	HttpGet(uniqZone view.UniqZone, req view.ReqHTTPProxy) (resp *resty.Response, err error)
	HttpPost(uniqZone view.UniqZone, req view.ReqHTTPProxy) (resp *resty.Response, err error)
}
