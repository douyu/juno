package invoker

import (
	"github.com/douyu/jupiter/pkg/conf"
	"github.com/douyu/jupiter/pkg/store/gorm"
	// _ "github.com/jinzhu/gorm/dialects/mysql"
)

var (
	// JunoMysql mysql instance
	JunoMysql *gorm.DB
)

// Init invoker
func Init() {
	JunoMysql = gorm.StdConfig("juno").Build()
	JunoMysql.LogMode(conf.GetBool("jupiter.mysql.juno.debug"))
}
