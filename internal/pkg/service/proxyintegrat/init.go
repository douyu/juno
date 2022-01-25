package proxyintegrat

import "github.com/jinzhu/gorm"

var (
	mysql *gorm.DB
)

//ProxyMenuTable 数据库表
const ProxyMenuTable = "proxy_menu"

// Init ..
func Init(d *gorm.DB) {
	mysql = d
}
