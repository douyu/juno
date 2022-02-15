package proxyintegrat

import "github.com/douyu/juno/pkg/model/view/vproxyintegrat"

// RefreshProxyConfig
func RefreshProxyConfig() (err error) {
	list := make([]vproxyintegrat.ProxyManage, 0)
	query := mysql.Table(ProxyManageTable).Where("delete_time = ?", 0)
	query.Find(&list)
	tmpConfigMap := make(map[string]vproxyintegrat.ProxyManage)
	for _, item := range list {
		tmpConfigMap[item.SubPath] = item
	}
	lock.Lock()
	proxyConfigMap = tmpConfigMap
	lock.Unlock()
	return nil
}
