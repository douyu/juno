package etcdHandle

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/douyu/juno/internal/app/core"

	"github.com/coreos/etcd/clientv3"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/clientproxy"
	"github.com/douyu/juno/pkg/errorconst"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

//List ..
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

	resp = list(req)
	return output.JSON(c, output.MsgOk, "success", resp)
}

//protable格式化etcd数据返回
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
	resp = list(req)
	total := len(resp)
	res := output.ProTableResult{
		Success: true,
		Total:   total,
		Data:    resp,
	}
	return c.OutputJSON(output.MsgOk, "", c.WithData(res))
}

func list(req view.ReqGetEtcdList) (resp []view.RespEtcdInfo) {
	resp = make([]view.RespEtcdInfo, 0)
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
	registerRes, registerErr := clientproxy.ClientProxy.RegisterEtcdGet(view.UniqZone{Env: req.Env, Zone: req.ZoneCode}, ctx, key, clientv3.WithPrefix())
	res, err := clientproxy.ClientProxy.ConfigEtcdGet(view.UniqZone{Env: req.Env, Zone: req.ZoneCode}, ctx, key, clientv3.WithPrefix())
	if err != nil || registerErr != nil {
		errSrt := fmt.Sprintf("configErr: %s; registerErr: %s", err.Error(), registerErr.Error())
		xlog.Error("etcdList", zap.String("step", "ConfigEtcdGet"), zap.String("appName", req.AppName), zap.String("env", req.Env), zap.String("zoneCode", req.ZoneCode), zap.String("key", key), zap.String("error", errSrt))
		return
	}

	if len(res.Kvs) == 0 && len(registerRes.Kvs) == 0 {
		err = errorconst.ParamConfigCallbackKvIsZero.Error()
		xlog.Warn("etcdList", zap.String("step", "resp.Kvs"), zap.String("appName", req.AppName), zap.String("env", req.Env), zap.String("zoneCode", req.ZoneCode), zap.String("key", key), zap.Any("res", res))
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
