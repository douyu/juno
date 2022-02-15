package proxyintegrat

import (
	"sync"

	"github.com/douyu/juno/pkg/model/view/vproxyintegrat"
	"github.com/jinzhu/gorm"
)

var (
	mysql          *gorm.DB
	lock           sync.RWMutex
	proxyConfigMap map[string]vproxyintegrat.ProxyManage
)

//ProxyMenuTable 数据库表
const ProxyMenuTable = "proxy_menu"

const ProxyManageTable = "proxy_manage"

// Init ..
func Init(d *gorm.DB) {
	mysql = d
	RefreshProxyConfig()
}
