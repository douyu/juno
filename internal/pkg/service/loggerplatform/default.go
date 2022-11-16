package loggerplatform

import (
	"context"
	"fmt"

	"github.com/douyu/juno/internal/pkg/service/aliyunlog"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view/logstore"
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

// newAppLogD ..
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

// LogStore get log store
func (a *appLogDefault) LogStore(env, query, typ, appName, aid string, u *db.User) (string, error) {
	project, logStore := a.GetLogStoreName(env, typ, appName)
	query = a.genQuery(env, typ, aid, query, appName)
	return aliyunlog.Instance.CompleteLogSearchUrl(context.TODO(), &aliyunlog.CompleteLogSearchUrlRequest{Region: "华北2（北京）", Project: project, LogStore: logStore, Query: query}, u)

}

// genQuery ...
func (a *appLogDefault) genQuery(env, typ, aid, query, appName string) string {
	switch typ {
	case LogTypConsole:
		return fmt.Sprintf("* and SYSLOG_IDENTIFIER:%s", appName)
	case LogTypJupiter, LogTypBiz:
		if env != "prod" {
			return fmt.Sprintf("* and aid:%s", aid)
		}
	}
	return query
}

// getLogStoreName ...
func (a *appLogDefault) GetLogStoreName(env, typ, appName string) (string, string) {
	var project AppLogDefaultEnvData
	//业务日志进行拦截
	if typ == LogTypBiz {
		list := make([]*logstore.LogStore, 0)
		mysql.Where("app_name = ? and env = ?", appName, env).Find(&list)
		if len(list) > 0 {
			return list[0].Project, list[0].LogStore
		}
	}
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
