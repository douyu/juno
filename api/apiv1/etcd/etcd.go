package etcdHandle

import (
	"context"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/clientproxy"
	"github.com/douyu/juno/pkg/errorconst"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/labstack/echo/v4"
	"go.etcd.io/etcd/clientv3"
	"go.uber.org/zap"
	"strings"
	"time"
)

//
func List(c echo.Context) error {
	req := view.ReqGetEtcdList{}
	resp := make([]view.RespEtcdInfo, 0)

	if err := c.Bind(&req); err != nil {
		return output.JSON(c, output.MsgErr, "bind req is error:"+err.Error())
	}

	if req.Prefix == "" || req.ZoneCode == "" || req.Env == "" {
		return output.JSON(c, output.MsgErr, "参数错误: env, prefix, ZoneCode均不能为空", resp)
	}

	key := req.Prefix
	if req.AppName != "" {
		key = req.Prefix + req.AppName + req.Suffix
	}

	if req.ServiceName != "" {
		req.ServiceName = strings.ReplaceAll(req.ServiceName, "$", "%24")
		key = req.Prefix + req.ServiceName + req.Suffix
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)

	defer cancel()
	res, err := clientproxy.ClientProxy.EtcdGet(view.UniqZone{Env: req.Env, Zone: req.ZoneCode}, ctx, key, clientv3.WithPrefix())
	if err != nil {
		xlog.Error("etcdList", zap.String("step", "EtcdGet"), zap.String("appName", req.AppName), zap.String("env", req.Env), zap.String("zoneCode", req.ZoneCode), zap.String("key", key), zap.String("error", err.Error()))
		return output.JSON(c, output.MsgErr, "EtcdGet error:"+err.Error(), resp)
	}
	if len(res.Kvs) == 0 {
		err = errorconst.ParamConfigCallbackKvIsZero.Error()
		xlog.Warn("etcdList", zap.String("step", "resp.Kvs"), zap.String("appName", req.AppName), zap.String("env", req.Env), zap.String("zoneCode", req.ZoneCode), zap.String("key", key), zap.Any("res", res))
		return output.JSON(c, output.MsgErr, "EtcdGet kv is 0 error", resp)
	}

	for _, item := range res.Kvs {
		row := view.RespEtcdInfo{
			Key:            string(item.Key),
			CreateRevision: item.CreateRevision,
			ModRevision:    item.ModRevision,
			Version:        item.Version,
			Value:          string(item.Value),
			Lease:          item.Lease,
		}
		xlog.Debug("etcdList", zap.String("step", "for.resp.Kvs"), zap.Any("row", row), zap.Any("item", item))

		resp = append(resp, row)
	}

	return output.JSON(c, output.MsgOk, "success", resp)
}
