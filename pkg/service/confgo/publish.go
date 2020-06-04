package confgo

import (
	"github.com/douyu/juno/pkg/packages/proxy"
	"github.com/douyu/juno/pkg/service/grpcgovern"
	"github.com/douyu/jupiter/pkg/conf"
	"github.com/douyu/jupiter/pkg/store/gorm"
)

type publish struct {
	DB *gorm.DB
}

// 发布key value到etcd mark 多机房通过govern实现
func (p *publish) Publish(env, zoneCode, port, appName, fileName, value string, nodes []string, md5 string) (string, error) {
	if conf.GetString("proxy.mode") == "local" {
		return proxy.Confgo.PutConfigV2(appName, port, env, fileName, "toml", value, nodes, true, md5)
	}
	data, err := grpcgovern.IGrpcGovern.V1ConfigServerPut(env, zoneCode, map[string]interface{}{
		"app_name":      appName,
		"idc_code":      zoneCode,
		"port":          port,
		"file_name":     fileName,
		"format":        "toml",
		"val":           value,
		"instance_list": nodes,
		"enable_global": true,
		"env":           env,
	})
	if err != nil {
		return "", err
	}
	return data.(string), nil
}

// 发布key value到etcd mark 多机房通过govern实现
func (p *publish) Delete(env, zoneCode, key string) (string, error) {
	data, err := grpcgovern.IGrpcGovern.V1ConfigServerDelete(env, zoneCode, key)
	if err != nil {
		return "", err
	}
	return data.(string), nil
}
