package clientproxy

import (
	"context"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/go-resty/resty/v2"
	"go.etcd.io/etcd/clientv3"
)

type clientProxy interface {
	EtcdPut(uniqZone view.UniqZone, ctx context.Context, key, val string, opts ...clientv3.OpOption) (resp *clientv3.PutResponse, err error)
	EtcdGet(uniqZone view.UniqZone, ctx context.Context, key string, opts ...clientv3.OpOption) (resp *clientv3.GetResponse, err error)
	HttpGet(uniqZone view.UniqZone, req view.ReqHTTPProxy) (resp *resty.Response, err error)
	HttpPost(uniqZone view.UniqZone, req view.ReqHTTPProxy) (resp *resty.Response, err error)
}
