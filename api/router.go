package router

import (
	"net/http"
	"strings"
	"time"

	"github.com/douyu/juno/api/apiv1/analysis"
	"github.com/douyu/juno/api/apiv1/confgo"
	"github.com/douyu/juno/api/apiv1/event"
	pprofHandle "github.com/douyu/juno/api/apiv1/pprof"
	"github.com/douyu/juno/api/apiv1/resource"
	"github.com/douyu/juno/api/apiv1/system"
	"github.com/douyu/juno/api/apiv1/user"
	"github.com/douyu/juno/internal/pkg/handler/app"
	"github.com/douyu/juno/internal/pkg/handler/static"
	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/middleware"
	"github.com/douyu/juno/internal/pkg/packages/gitlab"
	"github.com/douyu/juno/internal/pkg/packages/proxy"
	"github.com/douyu/juno/internal/pkg/service"
	userSrv "github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/internal/pkg/worker"
	"github.com/douyu/jupiter"
	"github.com/douyu/jupiter/pkg/server/xecho"
	"github.com/go-resty/resty/v2"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

// Admin ...
type Admin struct {
	jupiter.Application
	grpcGovernClient *resty.Client
}

// New ...
func New() *Admin {
	eng := &Admin{
		grpcGovernClient: resty.New().SetDebug(false).SetTimeout(3*time.Second).SetHeader("Content-Type", "application/json;charset=utf-8"),
	}
	_ = eng.Startup(
		eng.initInvoker,
		eng.initProxy,
	)
	eng.serveHTTP()

	gitlab.Init()
	service.Init()
	return eng
}

func (eng *Admin) serveHTTP() {
	server := xecho.StdConfig("http").Build()
	server.Debug = true

	var loginAuthWithJSON echo.MiddlewareFunc // 登录授权,以JSON形式
	var loginAuthRedirect echo.MiddlewareFunc // 登录授权,以Http跳转形式

	// 如果是local环境, 走Debug模式
	loginAuthWithJSON = middleware.LoginAuth("/api/authorize", middleware.RedirectTypeJson).Func()
	loginAuthRedirect = middleware.LoginAuth("/api/authorize", middleware.RedirectTypeHttp).Func()

	server.GET("/", static.File("assets/dist/index.html"), loginAuthRedirect)
	server.Static("/ant/*", "assets/dist")
	server.Static("/pprof/*", "assets/pprof_static")

	echo.NotFoundHandler = func(c echo.Context) error {
		if strings.HasPrefix(c.Request().URL.Path, "/api/") {
			return c.JSON(http.StatusNotFound, http.StatusText(http.StatusNotFound))
		}
		return c.File("assets/dist")
	}

	// 提供api的接口
	apiV1(server)

	g := server.Group("/api/admin")

	// use session
	g.Use(session.Middleware(userSrv.NewSessionStore()))

	g.GET("/api/app/filter/list", app.FilterList)

	// 获取应用信息,该应用机房信息
	g.GET("/api/app/info", app.Info)
	g.GET("/api/app/env", app.Env)

	userGroup := g.Group("/user")
	{
		// user
		userGroup.POST("/login", user.Login)
		userGroup.GET("/logout", user.Logout)
		userGroup.GET("/info", user.Info)
		userGroup.POST("/create", user.Create, loginAuthWithJSON)
		userGroup.POST("/update", user.Update, loginAuthWithJSON)
		userGroup.GET("/list", user.List, loginAuthWithJSON)
		userGroup.POST("/delete", user.Delete, loginAuthWithJSON)

	}

	confgoGroup := g.Group("/confgo", loginAuthWithJSON)
	{
		// Configuration app relation
		confgoGroup.POST("/app_config/info", confgo.GetAppConfigInfo)

		// Configuration file
		confgoGroup.POST("/config/info", confgo.GetAppConfig) // to get an application in an environment is to kv the array and the original profile text
		confgoGroup.POST("/config/create", confgo.CreateConfigFile)

		confgoGroup.POST("/config/delete", confgo.DeleteConfig)
		confgoGroup.POST("/config/publish", confgo.PublishConfig)
		confgoGroup.POST("/config/diff", confgo.DiffAppConfig)
		confgoGroup.POST("/config/rollback", confgo.RollbackConfig)
		confgoGroup.POST("/config/record", confgo.ListAppConfigChanges)
		confgoGroup.POST("/config/related", confgo.GetRelatedResource)

		// Configuration item
		confgoGroup.POST("/item/create", confgo.ItemCreate)
		confgoGroup.POST("/item/check", confgo.ItemCheck)
		confgoGroup.POST("/item/update", confgo.UpdateAppConfigItem)
		confgoGroup.POST("/item/delete", confgo.DelAppConfigItem)
		confgoGroup.POST("/item/rollback", confgo.RollbackConfig)
		confgoGroup.GET("/item/list", confgo.ItemList)

		// Configuration version
		confgoGroup.POST("/version/list", confgo.ListVersions)
		confgoGroup.POST("/version/change", confgo.VersionChange)
		confgoGroup.POST("/version/diff", confgo.VersionChangeOrigin)

		// Configuration fmt
		confgoGroup.POST("/config/fmt/toml", confgo.TomlFormat)

		// Configuration status
		confgoGroup.POST("/config/status/list", confgo.StatusList)    // status list
		confgoGroup.POST("/config/status/sync", confgo.StatusRefresh) // status check

		confgoGroup.GET("/config/statics", confgo.ConfigStatics)

		// Configuration global
		confgoGroup.POST("/global/list/:typ", confgo.ListResource)

		confgoGroup.GET("/tpl/list", confgo.TplList)
		confgoGroup.GET("/tpl/info", confgo.TplInfo)
		confgoGroup.POST("/tpl/create", confgo.TplCreate)
		confgoGroup.POST("/tpl/update", confgo.TplUpdate)
		confgoGroup.POST("/tpl/delete", confgo.TplDelete)

		confgoGroup.POST("/app/restart", confgo.AppRestart)
	}

	resourceGroup := g.Group("/resource", loginAuthWithJSON)
	{
		resourceGroup.GET("/app/info", resource.AppInfo)
		resourceGroup.GET("/app/list", resource.AppList)
		resourceGroup.POST("/app/create", resource.AppCreate)
		resourceGroup.POST("/app/update", resource.AppUpdate)
		resourceGroup.POST("/app/delete", resource.AppDelete)

		resourceGroup.GET("/zone/info", resource.ZoneInfo)
		resourceGroup.GET("/zone/list", resource.ZoneList)
		resourceGroup.POST("/zone/create", resource.ZoneCreate)
		resourceGroup.POST("/zone/update", resource.ZoneUpdate)
		resourceGroup.POST("/zone/delete", resource.ZoneDelete)

		resourceGroup.GET("/node/info", resource.NodeInfo)
		resourceGroup.GET("/node/list", resource.NodeList)
		resourceGroup.POST("/node/create", resource.NodeCreate)
		resourceGroup.POST("/node/update", resource.NodeUpdate)
		resourceGroup.POST("/node/delete", resource.NodeDelete)
		resourceGroup.GET("/node/statics", resource.NodeStatics)

		resourceGroup.GET("/node/transfer/list", resource.NodeTransferList)
		resourceGroup.POST("/node/transfer/put", resource.NodeTransferPut)

		resourceGroup.GET("/app_node/info", resource.AppNodeInfo)
		resourceGroup.GET("/app_node/list", resource.AppNodeList)
		resourceGroup.POST("/app_node/put", resource.AppNodePut)
		resourceGroup.GET("/app_node/transfer/list", resource.AppNodeTransferList)
		resourceGroup.POST("/app_node/transfer/put", resource.AppNodeTransferPut)

		resourceGroup.GET("/app_env_zone/list", resource.AppEnvZoneList)
	}

	analysisGroup := g.Group("/analysis", loginAuthWithJSON)
	{
		analysisGroup.GET("/index", analysis.Index)
		analysisGroup.GET("/topology/select", analysis.TopologySelect)
		analysisGroup.GET("/topology/list", analysis.TopologyList)
		analysisGroup.GET("/topology/relationship", analysis.TopologyRelationship)
	}

	systemGroup := g.Group("/system", loginAuthWithJSON)
	{
		systemGroup.GET("/option/info", system.OptionInfo)
		systemGroup.GET("/option/list", system.OptionList)
		systemGroup.POST("/option/create", system.OptionCreate)
		systemGroup.POST("/option/update", system.OptionUpdate)
		systemGroup.POST("/option/delete", system.OptionDelete)
	}

	eventGroup := g.Group("/event", loginAuthWithJSON)
	{
		eventGroup.GET("/list", event.List)
	}

	pprofGroup := g.Group("/pprof", loginAuthWithJSON)
	{
		pprofGroup.POST("/run", pprofHandle.Run)
		pprofGroup.GET("/list", pprofHandle.FileList)
		pprofGroup.GET("/dep/check", pprofHandle.CheckDep)
		pprofGroup.GET("/dep/install", pprofHandle.InstallDep)
		pprofGroup.GET("/config/list", pprofHandle.GetSysConfig)
		pprofGroup.GET("/config/update", pprofHandle.SetSysConfig)
	}

	eng.Serve(server)
}

func apiV1(server *xecho.Server) {
	v1 := server.Group("/api/v1")
	resourceGroup := v1.Group("/resource")
	{
		// 创建应用
		resourceGroup.POST("/app/put", resource.AppPut)
		resourceGroup.GET("/app/info", resource.AppInfo) // http://127.0.0.1:9999/api/resourceGroup/app/info/1
		resourceGroup.GET("/app/list", resource.AppList) // http://127.0.0.1:9999/api/resourceGroup/app/info/1

		// 创建机房信息
		resourceGroup.POST("/zone/put", resource.ZonePut)
		// 获取机房信息
		resourceGroup.GET("/zone/info", resource.ZoneInfo)
		// 获取机房列表
		resourceGroup.GET("/zone/list", resource.ZoneList)

		// 创建节点
		resourceGroup.POST("/node/put", resource.NodePut)
		// 获取节点信息 identify可以是id，也可以是hostname
		resourceGroup.GET("/node/info", resource.NodeInfo)
		resourceGroup.GET("/node/list", resource.NodeList)
		resourceGroup.GET("/node/transfer/list", resource.NodeTransferList)
		resourceGroup.GET("/node/transfer/put", resource.NodeTransferPut)
		resourceGroup.POST("/node/heartbeat", resource.NodeHeartBeat)

		// 创建应用和节点关系
		resourceGroup.POST("/app_node/put", resource.AppNodePut)
		// 根据应用和节点的id查询，应用节点关系信息
		resourceGroup.GET("/app_node/info", resource.AppNodeInfo)
		// 获取全部应用节点的列表
		// 根据应用的id或者应用名称，获取节点列表
		// 根据节点的hostname，获取应用列表
		resourceGroup.GET("/app_node/list", resource.AppNodeList)
	}

	confgoGroup := v1.Group("/confgo")
	{
		confgoGroup.GET("/app/parse", confgo.ParseGenerator)

		// Configuration app relation
		confgoGroup.POST("/app_config/info", confgo.GetAppConfigInfo)

		// Configuration file
		confgoGroup.POST("/config/info", confgo.GetAppConfig) // to get an application in an environment is to kv the array and the original profile text
		confgoGroup.POST("/config/create", confgo.CreateConfigFile)

		confgoGroup.POST("/config/delete", confgo.DeleteConfig)
		confgoGroup.POST("/config/publish", confgo.PublishConfig)
		confgoGroup.POST("/config/diff", confgo.DiffAppConfig)
		confgoGroup.POST("/config/rollback", confgo.RollbackConfig)
		confgoGroup.POST("/config/record", confgo.ListAppConfigChanges)
		confgoGroup.POST("/config/related", confgo.GetRelatedResource)

		// Configuration item
		confgoGroup.POST("/item/create", confgo.ItemCreate)
		confgoGroup.POST("/item/check", confgo.ItemCheck)
		confgoGroup.POST("/item/update", confgo.UpdateAppConfigItem)
		confgoGroup.POST("/item/delete", confgo.DelAppConfigItem)
		confgoGroup.POST("/item/rollback", confgo.RollbackConfig)
		confgoGroup.GET("/item/list", confgo.ItemList)

		// Configuration version
		confgoGroup.POST("/version/list", confgo.ListVersions)
		confgoGroup.POST("/version/change", confgo.VersionChange)
		confgoGroup.POST("/version/diff", confgo.VersionChangeOrigin)

		// Configuration fmt
		confgoGroup.POST("/config/fmt/toml", confgo.TomlFormat)

		// Configuration status
		confgoGroup.POST("/config/status/list", confgo.StatusList)    // status list
		confgoGroup.POST("/config/status/sync", confgo.StatusRefresh) // status check

		confgoGroup.GET("/config/statics", confgo.ConfigStatics)

		// Configuration global
		confgoGroup.POST("/global/list/:typ", confgo.ListResource)

		confgoGroup.GET("/tpl/list", confgo.TplList)
		confgoGroup.GET("/tpl/info", confgo.TplInfo)
		confgoGroup.POST("/tpl/create", confgo.TplCreate)
		confgoGroup.POST("/tpl/update", confgo.TplUpdate)
		confgoGroup.POST("/tpl/delete", confgo.TplDelete)

		confgoGroup.POST("/app/restart", confgo.AppRestart)
	}

	analysisGroup := v1.Group("/analysis")
	{
		analysisGroup.GET("/index", analysis.Index)
		analysisGroup.GET("/topology/select", analysis.TopologySelect)
		analysisGroup.GET("/topology/list", analysis.TopologyList)
		analysisGroup.GET("/topology/relationship", analysis.TopologyRelationship)
	}

	systemGroup := v1.Group("/system")
	{
		systemGroup.GET("/option/info", system.OptionInfo)
		systemGroup.GET("/option/list", system.OptionList)
		systemGroup.POST("/option/create", system.OptionCreate)
		systemGroup.POST("/option/update", system.OptionUpdate)
		systemGroup.POST("/option/delete", system.OptionDelete)
	}

	eventGroup := v1.Group("/event")
	{
		eventGroup.GET("/list", event.List)
	}

	pprofGroup := v1.Group("/pprof")
	{
		pprofGroup.POST("/run", pprofHandle.Run)
		pprofGroup.GET("/list", pprofHandle.FileList)
		pprofGroup.GET("/dep/check", pprofHandle.CheckDep)
		pprofGroup.GET("/dep/install", pprofHandle.InstallDep)
		pprofGroup.GET("/config/list", pprofHandle.GetSysConfig)
		pprofGroup.GET("/config/update", pprofHandle.SetSysConfig)
	}

}

func (eng *Admin) startJobs() {
	go worker.NewParsePkg().Start()
}

func (eng *Admin) initInvoker() error {
	invoker.Init()
	return nil
}

func (eng *Admin) initProxy() error {
	proxy.Init()
	return nil
}
