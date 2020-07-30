package app

import (
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/applog"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/labstack/echo/v4"
	"strings"
)

// Dashboard ..
func Dashboard(c echo.Context) (err error) {
	project := c.Param("project")
	dashboard := c.Param("dashboard")
	var data string
	data, err = applog.AppLog.DashboardUrl(project, dashboard)
	if err != nil {
		xlog.Error("Dashboard", xlog.String("step", "query"), xlog.Any("err", "GetDashboard error: "+err.Error()))
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", data)
}

// LogStore ..
func LogStore(c echo.Context) (err error) {
	var logStore = ""
	var query = "*"

	var reqModel ReqLogger
	err = c.Bind(&reqModel)


	// 设置线上project
	project := cfg.GetString("aliLogger.test.project")
	if env == "prod" {
		project = cfg.GetString("aliLogger.prod.project")
	}

	logStore, query = genTyp(typ, env, query, appName, aid)
	query = genQuery(queryTyp, query)

	if env == "prod" {
		user := service.GetUser(c)
		flag, err := service.GitlabAuth(user, appName)
		log.Info("LogStore", "flag", flag, "env", env, "appName", appName, "uint32(user.Uid)", uint32(user.Uid))
		if err != nil {
			log.Error("alilogger.LogStore", "err", "GetBaseLogger error: "+err.Error(), "project", project, "logstore", logStore, "query", query)
			return output.JSON(c, output.MsgErr, err.Error())
		}
		if !flag {
			return output.JSON(c, output.MsgOk, "您没有该项目权限，请联系项目管理员到Gitlab进行授权。", "auth")
		}
	}
	log.Info("LogStore", "project", project, "logStore", logStore, "query", query)
	data, err := service.GrpcGovern.AliLoggerLogStore(project, logStore, query)
	if err != nil {
		log.Error("alilogger.LogStore", "err", "GetBaseLogger error: "+err.Error(), "project", project, "logstore", logStore, "query", query)
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", data)
}

func genTyp(typ, env, query, appName, aid string) (string, string) {
	var logStore string

	if typ == "biz" {
		if env != "prod" {
			logStore = cfg.GetString("aliLogger.test.logStore.biz")
			query = fmt.Sprintf("* and aid:%s and __tag__:__hostname__: app.*.%s.*", aid, env)
		} else {
			logStore = appName
		}
	}

	if typ == "sys" {
		query = "* and SYSLOG_IDENTIFIER:" + appName
		if env != "prod" {
			logStore = cfg.GetString("aliLogger.test.logStore.sys")
		} else {
			logStore = cfg.GetString("aliLogger.prod.logStore.sys")
		}
	}

	if typ == "minerva" {
		query = "* and aid:" + aid
		if env != "prod" {
			logStore = cfg.GetString("aliLogger.test.logStore.minerva")
		} else {
			logStore = cfg.GetString("aliLogger.prod.logStore.minerva")
		}
	}
	return logStore, query
}

func genQuery(typ, query string) string {
	switch typ {
	case "slow":
		query += " and lv: error and msg: slow"
	case "panic":
		query += " and lv: painc"
	case "grpc":
		query += " and mod: yell and msg: access"
	case "echo":
		query += " and mod: echo and msg: access"
	}
	return query
}
