package invoker

import (
	"time"

	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/jupiter/pkg/conf"
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
	ConfgoEtcd, err = clientv3.New(clientv3.Config{
		Endpoints:   conf.GetStringSlice("proxy.etcdv3.confgo.endpoints"),
		DialTimeout: 2 * time.Second,
	})
	if err != nil {
		panic(err.Error())
	}
}
