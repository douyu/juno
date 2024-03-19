package loggerplatform

import (
	"context"
	"fmt"

	"github.com/douyu/juno/internal/pkg/service/aliyunlog"
	"github.com/douyu/juno/internal/pkg/service/huaweilog"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view/logstore"
	"github.com/douyu/jupiter/pkg/conf"
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
	project, logStore, logType := a.GetLogStoreName(env, typ, appName)
	query = a.genQuery(env, typ, aid, query, appName)
	if logType > 0 || conf.GetBool("huawei.allEnable") {
		req := &huaweilog.CompleteLogSearchUrlRequest{Region: "华北2（北京）", Project: project, LogStore: logStore, Query: query}
		return huaweilog.Instance.CompleteLogSearchUrl(context.TODO(), req, u)
	}
	return aliyunlog.Instance.CompleteLogSearchUrl(context.TODO(), &aliyunlog.CompleteLogSearchUrlRequest{Region: "华北2（北京）", Project: project, LogStore: logStore, Query: query}, u)

}

// genQuery ...
func (a *appLogDefault) genQuery(env, typ, aid, query, appName string) string {
	switch typ {
	case LogTypConsole:
		return fmt.Sprintf("* and SYSLOG_IDENTIFIER:%s", appName)
	case LogTypJupiter, LogTypBiz:
		if env != "prod" {
			return fmt.Sprintf("aid:%s", aid)
		}
	}
	return query
}

// getLogStoreName ...
func (a *appLogDefault) GetLogStoreName(env, typ, appName string) (projectName string, logStoreName string, logType int) {
	var project AppLogDefaultEnvData
	//业务日志进行拦截
	if typ == LogTypBiz {
		list := make([]*logstore.LogStore, 0)
		mysql.Where("app_name = ? and env = ?", appName, env).Find(&list)
		if len(list) > 0 {
			projectName, logStoreName, logType = list[0].Project, list[0].LogStore, list[0].LogType
			return
		}
	}
	var ok bool
	if project, ok = a.data[env]; !ok {
		return
	}
	switch typ {
	case LogTypConsole:
		projectName, logStoreName, logType = project.Project, project.LogStoreConsole, 0
		return
	case LogTypJupiter:
		projectName, logStoreName, logType = project.Project, project.LogStoreJupiter, 0
		return
	case LogTypBiz:
		if project.LogStoreBiz == "" {
			projectName, logStoreName, logType = project.Project, appName, 0
			return
		}
		projectName, logStoreName, logType = project.Project, project.LogStoreBiz, 0
		return
	}
	return
}
