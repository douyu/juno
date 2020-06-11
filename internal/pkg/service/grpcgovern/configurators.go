package grpcgovern

import (
	"errors"
)

// 将appname设置config的value
func (g *GrpcGovern) ConfiguratorsPut(env, zoneCode string, appName string, regKey string, value string) (ret interface{}, err error) {
	params := map[string]string{
		"appName": appName,
		"regKey":  regKey,
		"value":   value,
	}
	resp := struct {
		Code    int         `json:"code"`
		Message string      `json:"msg"`
		Data    interface{} `json:"data"`
	}{}
	err = g.Post(env, zoneCode, UrlConfigurators, params, &resp)
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
