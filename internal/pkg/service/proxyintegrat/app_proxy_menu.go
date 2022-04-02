package proxyintegrat

import (
	"context"

	"github.com/douyu/juno/pkg/model/view/vproxyintegrat"
)

var AppPanelTypeName = map[string]string{
	"jaeger": "链路追踪",
}

type Plugin struct {
	Key  string                 `json:"key"`
	Type string                 `json:"type"`
	Name string                 `json:"name"`
	Meta map[string]interface{} `json:"meta"`
}

//AppProxyMenuList 列表
func AppProxyMenuList(ctx context.Context) (list []Plugin, err error) {
	list = make([]Plugin, 0, 20)
	tmpList := make([]vproxyintegrat.ProxyMenu, 0)

	query := mysql.Table(ProxyMenuTable).Where("delete_time = ? and app_plugin_func = ?", 0, 1)
	err = query.Find(&tmpList).Error
	if err != nil {
		return
	}
	if len(tmpList) == 0 {
		return
	}
	tmpListMap := map[string][]vproxyintegrat.ProxyMenu{}
	for _, item := range tmpList {
		if item.Key == "" || item.Title == "" || item.PanelType == "" || item.ProxyUrl == "" {
			continue
		}
		_, ok := tmpListMap[item.PanelType]
		if ok {
			tmpListMap[item.PanelType] = append(tmpListMap[item.PanelType], item)
		} else {
			tmpListMap[item.PanelType] = []vproxyintegrat.ProxyMenu{item}
		}
	}
	for k, v := range tmpListMap {
		name, ok := AppPanelTypeName[k]
		if !ok {
			continue
		}
		list = append(list, Plugin{
			Type: "webembed",
			Key:  k,
			Name: name,
			Meta: GetPluginMeta(v),
		})
	}
	return
}

func GetPluginMeta(list []vproxyintegrat.ProxyMenu) map[string]interface{} {
	ret := map[string]interface{}{}
	for _, item := range list {
		ret[item.Env] = map[string]string{
			"proxyURL": item.ProxyUrlPattern,
		}
	}
	return ret
}
