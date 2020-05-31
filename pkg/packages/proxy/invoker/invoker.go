package invoker

import (
	"fmt"
	"github.com/douyu/jupiter/pkg/conf"
	"time"

	"go.etcd.io/etcd/clientv3"
)

var (
	ConfgoEtcd *clientv3.Client
)

func Init() {
	var err error
	fmt.Println("111", conf.GetStringSlice("proxy.etcdv3.confgo.endpoints"))
	ConfgoEtcd, err = clientv3.New(clientv3.Config{
		Endpoints:   conf.GetStringSlice("proxy.etcdv3.confgo.endpoints"),
		DialTimeout: 2 * time.Second,
	})
	if err != nil {
		panic(err.Error())
	}
}
