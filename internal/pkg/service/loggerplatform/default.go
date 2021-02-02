package loggerplatform

import (
	"fmt"
	"github.com/douyu/juno/internal/pkg/service/assist"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/jupiter/pkg/xlog"
)

var AppLogDefault *appLogDefault

type appLogDefault struct {
	dashboardUrl string
	logStoreUrl  string
	data         map[string]AppLogDefaultEnvData
}
type (

	//AppLogDefaultEnvData ..
	AppLogDefaultEnvData struct {
		Project         string
		LogStoreConsole string
		LogStoreJupiter string
		LogStoreBiz     string
	}
)

const (
	LogTypConsole = "console"
	LogTypJupiter = "jupiter"
	LogTypBiz     = "biz"
)

//newAppLogD ..
func newAppLogD() {
	var ald appLogDefault
	ald.dashboardUrl = cfg.Cfg.AppLog.Default.DashboardUrl
	ald.logStoreUrl = cfg.Cfg.AppLog.Default.LogStoreUrl

	var d map[string]AppLogDefaultEnvData
	d = make(map[string]AppLogDefaultEnvData, 0)
	for _, v := range cfg.Cfg.AppLog.Default.Project {
		for _, env := range v.Env {
			d[env] = AppLogDefaultEnvData{
				Project:         v.Project,
				LogStoreConsole: v.LogStoreConsole,
				LogStoreJupiter: v.LogStoreJupiter,
				LogStoreBiz:     v.LogStoreBiz,
			}
		}
	}

	xlog.Info("newAppLogD", xlog.Any("data", d), xlog.Any("project", cfg.Cfg.AppLog.Default.Project))
	ald.data = d
	AppLogDefault = &ald
	return
}

//LogStore get log store
func (a *appLogDefault) LogStore(env, query, typ, appName, aid string) (string, error) {
	project, logStore := a.getLogStoreName(env, typ, appName)
	query = a.genQuery(typ, aid, query, appName)
	return assist.AliyunLog(project, logStore, query)
}

// genQuery ...
func (a *appLogDefault) genQuery(typ, aid, query, appName string) string {
	switch typ {
	case LogTypConsole:
		return fmt.Sprintf("* and SYSLOG_IDENTIFIER:%s", appName)
	case LogTypJupiter, LogTypBiz:
		return fmt.Sprintf("* and aid:%s", aid)
	}
	return query
}

//getLogStoreName ...
func (a *appLogDefault) getLogStoreName(env, typ, appName string) (string, string) {
	var project AppLogDefaultEnvData
	var ok bool
	if project, ok = a.data[env]; !ok {
		return "", ""
	}
	switch typ {
	case LogTypConsole:
		return project.Project, project.LogStoreConsole
	case LogTypJupiter:
		return project.Project, project.LogStoreJupiter
	case LogTypBiz:
		if project.LogStoreBiz == "" {
			return project.Project, appName
		}
		return project.Project, project.LogStoreBiz
	}
	return "", ""
}
