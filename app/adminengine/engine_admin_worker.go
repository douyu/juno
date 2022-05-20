package adminengine

import (
	"time"

	"github.com/douyu/juno/internal/pkg/service"
	"github.com/douyu/juno/internal/pkg/service/appDep"
	"github.com/douyu/juno/internal/pkg/service/confgo"
	"github.com/douyu/juno/internal/pkg/service/k8s"
	"github.com/douyu/juno/internal/pkg/service/proxyintegrat"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/jupiter/pkg/worker/xcron"
)

func (eng *Admin) initParseWorker() (err error) {
	if cfg.Cfg.App.Mode == "local" {
		return
	}

	// 获取配置解析依赖时间
	interval := confgo.ConfuSrv.GetConfigParseWorkerTime()
	// 默认值 7200s
	if interval == 0 {
		interval = 7200
	}

	cron := xcron.StdConfig("parse").Build()
	cron.Schedule(xcron.Every(time.Second*time.Duration(interval)), xcron.FuncJob(confgo.ConfuSrv.ConfigParseWorker))
	return eng.Schedule(cron)
}

func (eng *Admin) initVersionWorker() (err error) {
	if cfg.Cfg.App.Mode == "local" {
		return
	}
	cron := xcron.StdConfig("parse").Build()
	cron.Schedule(xcron.Every(time.Hour*12), xcron.FuncJob(appDep.AppDep.SyncAppVersion))
	return eng.Schedule(cron)
}

// 每隔一天清理三个月前的 用户浏览记录数据
func (eng *Admin) initUserVisitWorker() (err error) {
	if cfg.Cfg.App.Mode == "local" {
		return
	}
	cron := xcron.StdConfig("parse").Build()
	cron.Schedule(xcron.Every(time.Hour*12), xcron.FuncJob(user.User.CronCleanUserVisitRecord))
	return eng.Schedule(cron)
}

// 每隔12小时同步k8s列表
func (eng *Admin) initK8sListWorker() (err error) {
	if cfg.Cfg.App.Mode == "local" {
		return
	}
	cron := xcron.DefaultConfig().Build()
	cron.Schedule(xcron.Every(time.Hour*12), xcron.FuncJob(k8s.SyncAll))
	return eng.Schedule(cron)
}

func (eng *Admin) refreshProxyManage() (err error) {
	refreshManage := xcron.DefaultConfig().Build()
	refreshManage.Schedule(xcron.Every(time.Minute), xcron.FuncJob(proxyintegrat.RefreshProxyConfig))
	err = eng.Schedule(refreshManage)
	if err != nil {
		return err
	}
	return
}

//刷新阿里云日志
func (eng *Admin) refreshAliyunLogMenu() (err error) {
	refreshMenuDataConfig := xcron.DefaultConfig()
	refreshMenuDataConfig.ImmediatelyRun = true
	refreshMenuData := refreshMenuDataConfig.Build()
	refreshMenuData.Schedule(xcron.Every(time.Minute), xcron.FuncJob(service.AliyunLog.RefreshMenuData))
	err = eng.Schedule(refreshMenuData)
	if err != nil {
		return err
	}
	return
}
