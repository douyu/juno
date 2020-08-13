package applog

import (
	"github.com/douyu/juno/pkg/cfg"
)

var AppLog applog

// Init ..
func Init() {
	switch cfg.Cfg.AppLog.Mode {
	case "aliyun":

	case "customize":
		AppLog = newCustomize()
	}
	return
}

//&AppLog{
//Aliyun: aliyun.New(cfg.Cfg.AppLog.Aliyun.Key,
//cfg.Cfg.AppLog.Aliyun.Secret,
//cfg.Cfg.AppLog.Aliyun.RoleArn,
//cfg.Cfg.AppLog.Aliyun.RoleSessionName,
//cfg.Cfg.AppLog.Aliyun.LoginURL,
//cfg.Cfg.AppLog.Aliyun.RegionID),
//}
