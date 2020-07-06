package casbin

import (
	"github.com/casbin/casbin/v2"
	"github.com/casbin/casbin/v2/persist"
	"github.com/douyu/juno/pkg/cfg"
	"time"
)

var Casbin *casbin.SyncedEnforcer

// InitCasbin 初始化casbin
func InitCasbin(adapter persist.Adapter) (*casbin.SyncedEnforcer, func(), error) {
	cleanFunc := func() {}
	if !cfg.Cfg.Casbin.Enable {
		return nil, cleanFunc, nil
	}

	config := cfg.Cfg.Casbin
	if config.Model == "" {
		return new(casbin.SyncedEnforcer), nil, nil
	}

	e, err := casbin.NewSyncedEnforcer(config.Model)
	if err != nil {
		return nil, nil, err
	}
	e.EnableLog(config.Debug)

	err = e.InitWithModelAndAdapter(e.GetModel(), adapter)
	if err != nil {
		return nil, nil, err
	}
	e.EnableEnforce(config.Enable)

	if config.AutoLoad {
		e.StartAutoLoadPolicy(time.Duration(config.AutoLoadInternal) * time.Second)
		cleanFunc = func() {
			e.StopAutoLoadPolicy()
		}
	}

	Casbin = e
	return e, cleanFunc, nil
}
