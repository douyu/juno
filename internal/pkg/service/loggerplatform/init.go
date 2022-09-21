package loggerplatform

import (
	"errors"

	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/errorconst"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/jinzhu/gorm"
)

var (
	mysql *gorm.DB
)

const (
	appLogModeDefault = "default"
	appLogModeAliyun  = "aliyun"
)

//Init ,,
func Init(d *gorm.DB) {
	mysql = d
	if !cfg.Cfg.AppLog.Enable {
		xlog.Info("loggerplatform", xlog.String("enable", "false"))
		return
	}
	switch cfg.Cfg.AppLog.Mode {
	case "default":
		newAppLogD()
	}
}

//LogStore ..
func LogStore(param view.ReqAliyunLogDefault, u *db.User) (string, error) {
	switch cfg.Cfg.AppLog.Mode {
	case appLogModeDefault:
		return AppLogDefault.LogStore(param.Env, param.Query, param.Typ, param.AppName, param.Aid, u)
	case appLogModeAliyun:
		return "", errors.New("阿里云日志还未支持")
	}
	return "", errorconst.AppLogModeError.Error()
}
