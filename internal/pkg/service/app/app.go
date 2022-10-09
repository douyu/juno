package app

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/douyu/juno/internal/pkg/service/clientproxy"
	"github.com/douyu/juno/pkg/errorconst"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	clientv3 "go.etcd.io/etcd/client/v3"
	"go.uber.org/zap"
)

// GovernPort get govern port
func GovernPort(port, env, zoneCode, appName, nodeName string) string {
	xlog.Info("GovernPort", zap.String("step", "one"), zap.String("appName", appName), zap.String("env", env), zap.String("zoneCode", zoneCode), zap.String("port", port), zap.String("nodeName", nodeName))

	if port != "" && port != "0" {
		return port
	}
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	key := fmt.Sprintf("/prometheus/job/%s/%s", appName, nodeName)
	defer cancel()
	resp, err := clientproxy.ClientProxy.DefaultEtcdGet(view.UniqZone{Env: env, Zone: zoneCode}, ctx, key, clientv3.WithPrefix())
	if err != nil {
		xlog.Warn("GovernPort", zap.String("step", "DefaultEtcdGet"), zap.String("appName", appName), zap.String("env", env), zap.String("zoneCode", zoneCode), zap.String("key", key), zap.String("error", err.Error()))
		return port
	}
	xlog.Info("GovernPort", zap.String("step", "two"), zap.Any("key", key))

	if len(resp.Kvs) == 0 {
		err = errorconst.ParamConfigCallbackKvIsZero.Error()
		xlog.Warn("GovernPort", zap.String("step", "resp.Kvs"), zap.String("appName", appName), zap.String("env", env), zap.String("zoneCode", zoneCode), zap.String("key", key), zap.Any("resp", resp))
		return port
	}

	xlog.Info("GovernPort", zap.String("step", "two"), zap.Any("key", key), zap.Any("resp.Kvs", resp.Kvs))

	// publish status, synced status
	for _, item := range resp.Kvs {

		valueArr := strings.Split(string(item.Value), ":")
		if len(valueArr) != 2 {
			return port
		}
		xlog.Warn("GovernPort", zap.String("step", "getPort"), zap.Any("value", valueArr), zap.String("port", valueArr[1]), zap.String("zoneCode", zoneCode), zap.String("key", key), zap.Any("resp", resp))

		return valueArr[1]
	}

	xlog.Info("GovernPort", zap.String("step", "finish"), zap.Any("port", port))
	return port
}
