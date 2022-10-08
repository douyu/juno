package etcdHandle

import (
	"context"
	"strings"
	"time"

	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/clientproxy"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/labstack/echo/v4"
	clientv3 "go.etcd.io/etcd/client/v3"
	"go.uber.org/zap"
)

// List ..
func List(c echo.Context) error {
	req := view.ReqGetEtcdList{}
	resp := make([]view.RespEtcdInfo, 0)

	if err := c.Bind(&req); err != nil {
		return output.JSON(c, output.MsgErr, "bind req is error:"+err.Error())
	}

	if req.Prefix == "" || req.ZoneCode == "" || req.Env == "" {
		return output.JSON(c, output.MsgErr, "参数错误: env, prefix, ZoneCode均不能为空", resp)
	}

	if req.ZoneCode == "all" {
		return output.JSON(c, output.MsgOk, "success", resp)
	}

	resp, err := list(req)
	if err != nil {
		return output.JSON(c, output.MsgErr, "查询失败："+err.Error())
	}

	return output.JSON(c, output.MsgOk, "success", resp)
}

// protable格式化etcd数据返回
func ProTableList(c *core.Context) error {
	req := view.ReqGetEtcdList{}
	resp := make([]view.RespEtcdInfo, 0)

	if err := c.Bind(&req); err != nil {
		return output.JSON(c, output.MsgErr, "bind req is error:"+err.Error())
	}

	if req.Prefix == "" || req.ZoneCode == "" || req.Env == "" {
		return output.JSON(c, output.MsgErr, "参数错误: env, prefix, ZoneCode均不能为空", resp)
	}

	if req.ZoneCode == "all" {
		return output.JSON(c, output.MsgOk, "success", resp)
	}

	resp, err := list(req)
	if err != nil {
		return output.JSON(c, output.MsgErr, "查询失败："+err.Error())
	}

	total := len(resp)
	res := output.ProTableResult{
		Success: true,
		Total:   total,
		Data:    resp,
	}
	return c.OutputJSON(output.MsgOk, "", c.WithData(res))
}

func list(req view.ReqGetEtcdList) (resp []view.RespEtcdInfo, err error) {
	resp = make([]view.RespEtcdInfo, 0)
	key := req.Prefix
	if req.AppName != "" {
		key = req.Prefix + req.AppName + req.Suffix
	}

	if req.ServiceName != "" {
		req.ServiceName = strings.ReplaceAll(req.ServiceName, "$", "%24")
		key = req.Prefix + req.ServiceName + req.Suffix
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	registerRes, err := clientproxy.ClientProxy.RegisterEtcdGet(view.UniqZone{Env: req.Env, Zone: req.ZoneCode}, ctx, key, clientv3.WithPrefix())
	if err != nil {
		xlog.Error("etcdList", zap.String("step", "RegisterEtcdGet"),
			zap.String("appName", req.AppName), zap.String("env", req.Env),
			zap.String("zoneCode", req.ZoneCode), zap.String("key", key),
			zap.String("error", err.Error()))
		return
	}

	res, err := clientproxy.ClientProxy.DefaultEtcdGet(view.UniqZone{Env: req.Env, Zone: req.ZoneCode}, ctx, key, clientv3.WithPrefix())
	if err != nil {
		xlog.Error("etcdList", zap.String("step", "DefaultEtcdGet"),
			zap.String("appName", req.AppName), zap.String("env", req.Env),
			zap.String("zoneCode", req.ZoneCode), zap.String("key", key),
			zap.String("error", err.Error()))
		return
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

	for _, item := range registerRes.Kvs {
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
	return
}
