package grpcgovern

import (
	"errors"
	"fmt"

	"github.com/douyu/jupiter/pkg/conf"

	"github.com/douyu/juno/internal/pkg/model/db"
	"github.com/douyu/juno/internal/pkg/packages/proxy"
)

// V1ConfigServerPut 发送配置信息
func (g *GrpcGovern) V1ConfigServerPut(env, zoneCode string, params map[string]interface{}) (ret interface{}, err error) {
	resp := struct {
		Code    int         `json:"code"`
		Message string      `json:"msg"`
		Data    interface{} `json:"data"`
	}{}
	err = g.Post(env, zoneCode, UrlConfigServerPut, params, &resp)
	if err != nil {
		return ret, err
	}

	if resp.Code != 0 {
		err = errors.New("error" + resp.Message)
		return
	}

	ret = resp.Data
	return
}

// V1ConfigServerPut 发送配置信息
func (g *GrpcGovern) V1ConfigServerDelete(env, zoneCode string, key string) (ret interface{}, err error) {
	resp := struct {
		Code    int         `json:"code"`
		Message string      `json:"msg"`
		Data    interface{} `json:"data"`
	}{}
	err = g.Post(env, zoneCode, fmt.Sprintf(UrlEtcdInfo, key, "config"), nil, &resp)
	if err != nil {
		return ret, err
	}

	if resp.Code != 0 {
		err = errors.New("error" + resp.Message)
		return
	}

	ret = resp.Data
	return
}

// GetBatchSupervisorInfo 获取配置中心基础信息
func (g *GrpcGovern) GetBatchPmtInfo(caid int, app *db.CmcAppView, param []db.AppNodeAgentView) (ret []db.CmcUseStatus, err error) {
	if conf.GetString("proxy.mode") == "local" {
		return proxy.Confgo.GetBatchUsingInfo(caid, app, param)
	}

	//resp := struct {
	//	Code    int               `json:"code"`
	//	Message string            `json:"msg"`
	//	Data    []db.CmcUseStatus `json:"data"`
	//}{}
	//err = g.Get(env, zoneCode, fmt.Sprintf(UrlConfigServerInfo, appName, typ, param), nil, &resp)
	//if err != nil {
	//	return ret, err
	//}
	//
	//if resp.Code != 0 {
	//	err = errors.New("error" + resp.Message)
	//	return
	//}
	//
	//ret = resp.Data
	return
}

// GetConfigStatus
func (g *GrpcGovern) GetConfigStatus(env, zoneCode string, appName, param string) (ret []db.ConfigStatus, err error) {
	if conf.GetString("proxy.mode") == "local" {
		return proxy.Confgo.GetConfigStatus(appName, param)
	}

	resp := struct {
		Code    int               `json:"code"`
		Message string            `json:"msg"`
		Data    []db.ConfigStatus `json:"data"`
	}{}
	err = g.Get(env, zoneCode, fmt.Sprintf(UrlConfigServerInfo, appName, 0, param), nil, &resp)
	if err != nil {
		return ret, err
	}

	if resp.Code != 0 {
		err = errors.New("error" + resp.Message)
		return
	}

	ret = resp.Data
	return
}
