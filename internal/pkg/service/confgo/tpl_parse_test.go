package confgo

import (
	"fmt"
	"testing"

	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/model/view"
)

func init() {
	//InitViper()
	cfg.InitCfg()
	invoker.Init()
}

func TestParseConfig(t *testing.T) {
	config := `
		[mysqlconfig]
			addr = "127.0.0.1:3306"
			user = "hello"
			password = "world"
		[mysqlconfigs]
			addr = "127.0.0.1:3306"
			user = "hello"
			password = "world"
		[minerva.mysql.juno]
			enable = true
			connMaxLifetime = "300s"
			debug = true
			dsn = "root:root@tcp(127.0.0.1:113306)/juno?charset=utf8&parseTime=True&loc=Local&readTimeout=1s&timeout=1s&writeTimeout=3s"
			level = "panic"
	 		user = "hello"
			password = "world"
 	  [redix.roomclustersimp.shards.alpha.test]
          addr = ["redis://:test:123456@r-xxxxxxxx.redis.rds.aliyuncs.com:6379","redis://10.1.61.15:6001"]
`

	_ = `[minerva.mysql.jupiter]
			enable = true
			connMaxLifetime = "300s"
			debug = true
			dsn = "root:root@tcp(127.0.0.1:3306)/juno?charset=utf8&parseTime=True&loc=Local&readTimeout=1s&timeout=1s&writeTimeout=3s"
			level = "panic"
			maxIdleConns = 50
			maxOpenConns = 100
	  [minerva.grpc.hours]
		  addr = "grpc:wsd-live-srv-hours-go:v1:live"
		  enableTrace = true
		  level = "panic"
		  timeout = "1s"

     [redix.roomclustersimp.shards.alpha.master]
          addr = "redis://10.1.61.15:6001"

     [redix.roomclustersimp.shards.alpha.slaves]
          addr = "redis://:test:123456@r-xxxxxxxx.redis.rds.aliyuncs.com:6379"
 	 
 	  [redix.roomclustersimp.shards.alpha.test]
          addr = ["redis://:test:123456@r-xxxxxxxx.redis.rds.aliyuncs.com:6379","redis://10.1.61.15:6001"]

      [redix.abc.def.uvw.master]
          addr = "redis://10.1.61.15:6001"
	`

	obj := InitCmcToml(invoker.JunoMysql, view.RespOneConfig{
		Content: config,
		Format:  "toml",
	})

	resp, err := obj.ParseConfig()
	if err != nil {
		fmt.Println("err", err)
	}
	for _, v := range resp {
		fmt.Printf("****** item: type=%v, key=%v, dbname=%v, username=%v, password=%v, scheme=%v, ip=%v, port =%v\n",
			v.Type, v.Key, v.DbName, v.UserName, v.Password, v.Scheme, v.Ip, v.Port)
	}
}
