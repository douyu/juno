package provider

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/tidwall/gjson"

	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/appevent"
	"github.com/douyu/juno/internal/pkg/service/clientproxy"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/model"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/event"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/labstack/echo/v4"
	"go.etcd.io/etcd/api/v3/mvccpb"
	clientv3 "go.etcd.io/etcd/client/v3"
)

func ConfiguratorsUpdate(c echo.Context) (err error) {
	reqModel := view.ReqConfiguratorsPut{}
	if err = c.Bind(&reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	isJupApp := isJupiterKey(reqModel.RegKey, reqModel.Env, reqModel.IdcCode)

	info := model.ConfiguratorsEtcdInfo{
		RegKey: reqModel.RegKey,
		Labels: struct {
			Enable   string `json:"enable"`
			Env      string `json:"env"`
			Group    string `json:"group"`
			Hostname string `json:"hostname"`
			Weight   string `json:"weight"`
		}{
			Env:    reqModel.Env,
			Enable: reqModel.Enable,
			Group:  reqModel.Group,
			Weight: reqModel.Weight,
		},
	}
	//修改provide的etcd的key
	ctx2, _ := context.WithTimeout(context.Background(), time.Second*3)
	resp, err := clientproxy.ClientProxy.DefaultEtcdGet(view.UniqZone{Env: reqModel.Env, Zone: reqModel.IdcCode}, ctx2, reqModel.RegKey, clientv3.WithPrefix())
	if err != nil || len(resp.Kvs) <= 0 {
		xlog.Error("provider.ConfiguratorsUpdate", xlog.Any("err", err), xlog.Any("req", reqModel), xlog.Any("info", info))
		return
	}
	if isJupApp == true {
		valMap := map[string]interface{}{}
		err = json.Unmarshal(resp.Kvs[0].Value, &valMap)
		if err != nil {
			return
		}
		valMap["enable"] = false
		if reqModel.Enable == "true" {
			valMap["enable"] = true
		}
		valMap["labels"] = map[string]string{
			"enable": reqModel.Enable,
		}

		valStr, _ := json.Marshal(valMap)
		ctx3, _ := context.WithTimeout(context.Background(), time.Second*3)
		_, err = clientproxy.ClientProxy.RegisterEtcdPut(view.UniqZone{Env: reqModel.Env, Zone: reqModel.IdcCode}, ctx3, reqModel.RegKey, string(valStr))
		if err != nil {
			return
		}
	} else {
		//minerva
		oneAddr := model.ProviderEtcdInfo{}
		err = json.Unmarshal(resp.Kvs[0].Value, &oneAddr)
		if err != nil {
			return
		}
		oneAddr.Enable = false
		oneAddr.Labels.Enable = "false"
		if reqModel.Enable == "true" {
			oneAddr.Labels.Enable = "true"
			oneAddr.Enable = true
		}

		valStr, _ := json.Marshal(oneAddr)
		ctx3, _ := context.WithTimeout(context.Background(), time.Second*3)
		_, err = clientproxy.ClientProxy.RegisterEtcdPut(view.UniqZone{Env: reqModel.Env, Zone: reqModel.IdcCode}, ctx3, reqModel.RegKey, string(valStr))
		if err != nil {
			return
		}
	}

	bData, err := json.Marshal(info)
	if err != nil {
		xlog.Info("provider.ConfiguratorsUpdate", xlog.Any("err", "Marshal error: "+err.Error()), xlog.Any("req", reqModel), xlog.Any("info", info))
		return output.JSON(c, output.MsgErr, err.Error())
	}

	//更新etcd
	ctx, _ := context.WithTimeout(context.Background(), time.Second*3)
	regKey := strings.ReplaceAll(reqModel.RegKey, "providers", "configurators")
	splitIndex := strings.Index(regKey, ":")
	if splitIndex < 0 || splitIndex+3 >= len(regKey) {
		err = errors.New("reg key is wrong")
		xlog.Error("ConfiguratorsUpdate", xlog.Any("step", "update provider"), xlog.Any("err", err.Error()), xlog.Any("reqModel", reqModel))
		return
	}
	regPre := regKey[:splitIndex]
	host := regKey[splitIndex+3:]
	key := regPre + ":///?host=" + host
	flag := strings.HasPrefix(regKey, fmt.Sprintf(model.ConfiguratorsKeyName, reqModel.AppName))
	if !flag {
		err = errors.New("reg key is wrong2")
		xlog.Error("ConfiguratorsUpdate", xlog.Any("step", "update provider"), xlog.Any("err", err.Error()), xlog.Any("reqModel", reqModel))
		return
	}

	ret, err := clientproxy.ClientProxy.RegisterEtcdPut(view.UniqZone{Env: reqModel.Env, Zone: reqModel.IdcCode}, ctx, key, string(bData))
	if err != nil {
		xlog.Error("ConfiguratorsUpdate", xlog.Any("step", "update provider"), xlog.Any("err", err.Error()), xlog.Any("reqModel", reqModel))
		return
	}

	userInfo := user.GetUser(c)
	appevent.AppEvent.PutEvent(db.AppEvent{
		ID:            0,
		AppName:       reqModel.AppName,
		Aid:           0,
		ZoneCode:      reqModel.IdcCode,
		Env:           cfg.Cfg.App.Mode,
		UserName:      userInfo.Nickname,
		UID:           userInfo.Uid,
		Operation:     event.EventDevopsUpdate,
		OperationName: event.OperationMap[event.EventDevopsUpdate],
		Source:        event.SourceDevops,
		Metadata:      string(bData),
	})
	return output.JSON(c, output.MsgOk, "success", ret)
}

func AggregationList(c echo.Context) error {
	req := view.ReqList{}
	var err error
	err = c.Bind(&req)
	if err != nil {
		return output.JSON(c, output.MsgErr, "bind req is error")
	}
	if req.AppName == "" || req.IdcCode == "" || req.Env == "" {
		return output.JSON(c, output.MsgErr, "param is empty")
	}
	configList, err := GetGrpcConfig(req.Env, req.IdcCode, req.AppName)
	if err != nil {
		xlog.Error("provider.AggregationList", xlog.Any("step", "GetGrpcConfig"), xlog.Any("err", err.Error()), xlog.Any("req", req))
		return output.JSON(c, output.MsgErr, "empty configList")
	}
	xlog.Info("provider.AggregationList", xlog.Any("step", "GetGrpcConfig"), xlog.Any("configList", configList), xlog.Any("req", req))

	ctx, _ := context.WithTimeout(context.Background(), time.Second*30)

	ke := fmt.Sprintf(model.ProviderV2GrpcKeyName, req.AppName)

	resp, err := clientproxy.ClientProxy.RegisterEtcdGet(view.UniqZone{Env: req.Env, Zone: req.IdcCode}, ctx, ke, clientv3.WithPrefix())
	if err != nil {
		xlog.Info("provider.AggregationList", xlog.Any("step", "get providers"), xlog.Any("err", err.Error()), xlog.Any("req", req))
		return output.JSON(c, output.MsgErr, "DefaultEtcdGet is empty")
	}
	kvs := resp.Kvs

	addrs := make([]model.ProviderEtcdInfo, 0)
	var key model.RegisterKeyInterface
	var arrs []string
	var tmpErr error
	for _, value := range kvs {
		oneAddr := model.ProviderEtcdInfo{
			RawValue: string(value.Key),
			RegKey:   string(value.Key),
		}
		if key, err = model.NewRegisterKey(value.Key); err != nil {
			// TODO
			xlog.Error("provider.AggregationList", xlog.Any("tmpErr", err.Error()), xlog.Any("req", req))
			continue
		}

		xlog.Info("provider.AggregationList", xlog.Any("step", "NewRegisterKey"), xlog.Any("key", key), xlog.Any("req", req))

		arrs, tmpErr = parseAddr(key.Address())
		if tmpErr != nil {
			xlog.Error("provider.AggregationList", xlog.Any("tmpErr", tmpErr.Error()), xlog.Any("req", req))
			continue
		}
		if len(arrs) < 2 {
			xlog.Error("provider.AggregationList", xlog.Any("arrs", "arrs err"), xlog.Any("req", req))
			continue
		}

		key.Address()
		oneAddr.Ip = arrs[0]
		oneAddr.Port = arrs[1]
		oneAddr.Address = key.Address()
		oneAddr.Type = "grpc"
		isJupApp := isJupiterKey(oneAddr.RegKey, req.Env, req.IdcCode)
		pk := key.(*model.ProviderInfo)
		if err = pk.ParseValue(value.Value, isJupApp); err != nil {
			err = errors.New("ParseGovernValue,err:" + err.Error())
			return output.JSON(c, output.MsgErr, err.Error(), "ParseValue err")
		}
		if pk.Enable() == "true" {
			oneAddr.Enable = true
		}
		oneAddr.Labels.Enable = pk.Enable()
		oneAddr.Labels.Weight = pk.Weight()
		oneAddr.Labels.Group = pk.Group()
		addrs = append(addrs, oneAddr)

		xlog.Info("provider.AggregationList", xlog.Any("step", "key.(*model.ProviderInfo)"), xlog.Any("pk", pk),
			xlog.Any("pk", pk.Meta),
			xlog.Any("req", req),
			xlog.Any("oneAddr.Labels.Enable", oneAddr.Labels.Enable),
			xlog.Any("oneAddr", oneAddr),
			xlog.Any("value.Value", string(value.Value)))

	}

	list := []model.AggregationRegister{}
	// todo config 有脏数据是感知不到的
	// 合并注册和治理键
	for _, regItem := range addrs {
		regKey := regItem.Address
		oneInfo := model.AggregationRegister{
			Provider: regItem,
			Aggregation: model.AggregationInfo{
				Type:    regItem.Type,
				Ip:      regItem.Ip,
				Port:    regItem.Port,
				Address: regItem.Address,
				RegKey:  regItem.RegKey,
			},
		}
		// 初始值由provider赋值
		oneInfo.Aggregation.Labels = regItem.Labels
		xlog.Info("provider.AggregationList", xlog.Any("step", "addrs"), xlog.Any("regItem.Labels", regItem.Labels), xlog.Any("req", req))

		for _, configItem := range configList {
			if regKey == configItem.Address {
				oneInfo.Configurators = configItem
				// 用config覆盖provider数据
				oneInfo.Aggregation.Labels.Enable = oneInfo.Configurators.Labels.Enable
				oneInfo.Aggregation.Labels.Group = oneInfo.Configurators.Labels.Group
				oneInfo.Aggregation.Labels.Weight = oneInfo.Configurators.Labels.Weight
			}
		}

		list = append(list, oneInfo)
	}

	return output.JSON(c, output.MsgOk, "success", list)
}

func parseAddr(addr string) (arrs []string, err error) {
	arrs = strings.Split(addr, ":")
	if len(arrs) != 2 {
		err = errors.New("length is error")
		return
	}
	return
}

func GetGrpcConfig(env, idCode, appName string) (addrs []model.ConfiguratorsEtcdInfo, err error) {
	addrs = make([]model.ConfiguratorsEtcdInfo, 0)
	var kvs []*mvccpb.KeyValue

	ke := fmt.Sprintf(model.ConfiguratorsGrpcKeyName, appName)
	ctx, _ := context.WithTimeout(context.Background(), time.Second*3)
	resp, err := clientproxy.ClientProxy.RegisterEtcdGet(view.UniqZone{Env: env, Zone: idCode}, ctx, ke, clientv3.WithPrefix())
	if err != nil {
		xlog.Error("GetGrpcConfig", xlog.Any("step", "ConfiguratorsGrpcKeyName"), xlog.Any("err", err.Error()))
		return
	}

	kvs = resp.Kvs

	var key model.RegisterKeyInterface
	var arrs []string
	var tmpErr error
	for _, value := range kvs {
		oneAddr := model.ConfiguratorsEtcdInfo{
			RawValue: string(value.Key),
			RegKey:   string(value.Key),
		}
		if key, err = model.NewRegisterKey(value.Key); err != nil {
			// TODO
			continue
		}

		arrs, tmpErr = parseAddr(key.Address())
		if tmpErr != nil {
			continue
		}
		key.Address()
		oneAddr.Ip = arrs[0]
		oneAddr.Port = arrs[1]
		oneAddr.Address = key.Address()
		oneAddr.Type = "grpc"

		pk := key.(*model.ConfigInfo)
		if err = pk.ParseValue(value.Value); err != nil {
			err = errors.New("ParseGovernValue,err:" + err.Error())
			return
		}
		oneAddr.Labels.Enable = pk.Enable()
		oneAddr.Labels.Weight = pk.Weight()
		oneAddr.Labels.Group = pk.Group()
		addrs = append(addrs, oneAddr)
	}
	return addrs, nil
}

func isJupiterKey(key, env, idcCode string) (b bool) {
	ctx, _ := context.WithTimeout(context.Background(), time.Second*3)
	resp, err := clientproxy.ClientProxy.RegisterEtcdGet(view.UniqZone{Env: env, Zone: idcCode}, ctx, key, clientv3.WithPrefix())
	if err != nil {
		xlog.Error("isJupiterKey", xlog.Any("step", "get providers isJupiterKey"), xlog.Any("err", err.Error()))
		return
	}
	kvs := resp.Kvs

	for _, value := range kvs {
		val := string(value.Value)
		jupiterVersion := gjson.Get(val, "metadata.jupiterVersion").String()
		if jupiterVersion != "" {
			//说明provider注册进去的key是jupiter
			b = true
			return
		}
	}
	return
}
