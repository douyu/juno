package invoker

import (
	"time"

	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/jupiter/pkg/store/gorm"
	"go.etcd.io/etcd/clientv3"
)

var (
	// JunoMysql mysql instance
	JunoMysql  *gorm.DB
	ConfgoEtcd *clientv3.Client
)

// Init invoker
func Init() {
	if cfg.Cfg.Database.Enable {
		gormConfig := gorm.DefaultConfig()
		gormConfig.DSN = cfg.Cfg.Database.DSN
		JunoMysql = gormConfig.Build()
		JunoMysql.LogMode(cfg.Cfg.Database.Debug)
	}

	var err error
	if cfg.Cfg.Proxy.Etcd.Enable {
		ConfgoEtcd, err = clientv3.New(clientv3.Config{
			Endpoints:   cfg.Cfg.Proxy.Etcd.Endpoints,
			DialTimeout: 2 * time.Second,
		})
		if err != nil {
			panic(err.Error())
		}
	}

}
