package invoker

import (
	"github.com/douyu/jupiter/pkg/conf"
	"github.com/douyu/jupiter/pkg/store/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

var (
	JunoMysql *gorm.DB
)

func Init() {
	JunoMysql = gorm.StdConfig("juno").Build()

	JunoMysql.LogMode(conf.GetBool("jupiter.mysql.juno.debug"))

}
