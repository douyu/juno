package adminengine

import (
	"net/http"
	"strings"

	"github.com/douyu/juno/api/apiv1/analysis"
	"github.com/douyu/juno/api/apiv1/app"
	"github.com/douyu/juno/api/apiv1/confgo"
	"github.com/douyu/juno/api/apiv1/confgov2"
	"github.com/douyu/juno/api/apiv1/confgov2/configresource"
	"github.com/douyu/juno/api/apiv1/event"
	pprofHandle "github.com/douyu/juno/api/apiv1/pprof"
	"github.com/douyu/juno/api/apiv1/resource"
	"github.com/douyu/juno/api/apiv1/static"
	"github.com/douyu/juno/api/apiv1/system"
	"github.com/douyu/juno/api/apiv1/user"
	"github.com/douyu/juno/internal/pkg/middleware"
	"github.com/douyu/juno/internal/pkg/service/grafana"
	userSrv "github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/jupiter/pkg/server/xecho"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

func apiAdmin(server *xecho.Server) {
	var loginAuthWithJSON echo.MiddlewareFunc // 登录授权,以JSON形式
	var loginAuthRedirect echo.MiddlewareFunc // 登录授权,以Http跳转形式

	// If it is a local environment, go to Debug mode
	loginAuthWithJSON = middleware.LoginAuth("/api/authorize", middleware.RedirectTypeJson).Func()
	loginAuthRedirect = middleware.LoginAuth("/api/authorize", middleware.RedirectTypeHttp).Func()

	// session init
	sessionMW := session.Middleware(userSrv.NewSessionStore())

	// static file
	server.GET("/", static.File("assets/dist/index.html"), sessionMW, loginAuthRedirect)
	server.Static("/ant/*", "assets/dist")
	server.Static("/pprof/*", "assets/pprof_static")

	echo.NotFoundHandler = func(c echo.Context) error {
		if strings.HasPrefix(c.Request().URL.Path, "/api/") {
			return c.JSON(http.StatusNotFound, http.StatusText(http.StatusNotFound))
		}
		return c.File("assets/dist")
	}

	// grafana proxy
	groupGrafana := server.Group("/grafana", sessionMW, loginAuthRedirect)
	{
		AllMethods := []string{http.MethodGet, http.MethodPost, http.MethodPatch, http.MethodDelete,
			http.MethodHead, http.MethodTrace, http.MethodPut, http.MethodConnect, http.MethodOptions}
		groupGrafana.Match(AllMethods, "", grafana.Proxy)
		groupGrafana.Match(AllMethods, "/", grafana.Proxy)
		groupGrafana.Match(AllMethods, "/*", grafana.Proxy)
	}

	g := server.Group("/api/admin")
	g.Use(sessionMW) // use session
	g.GET("/api/app/filter/list", app.FilterList)
	g.GET("/api/app/info", app.Info) // Get application information, the application room information
	g.GET("/api/app/env", app.Env)
	g.GET("/api/system", app.Info)

	userGroup := g.Group("/user")
	{
		// user
		userGroup.POST("/login", user.Login)
		userGroup.GET("/login/:oauth", user.LoginOauth)
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

	configV2G := g.Group("/confgov2", loginAuthWithJSON)
	{
		g := configV2G
		g.GET("/config/list", confgov2.List)        // 配置文件列表
		g.GET("/config/detail", confgov2.Detail)    // 配置文件内容
		g.POST("/config/create", confgov2.Create)   // 配置新建
		g.POST("/config/update", confgov2.Update)   // 配置更新
		g.POST("/config/publish", confgov2.Publish) // 配置发布
		g.GET("/config/history", confgov2.History)  // 配置文件历史
		g.POST("/config/delete", confgov2.Delete)   // 配置删除
		g.GET("/config/diff", confgov2.Diff)        // 配置文件Diif，返回两个版本的配置内容

		resourceG := g.Group("/resource")
		resourceG.GET("/list", configresource.List)
		resourceG.POST("/create", configresource.Create)
		resourceG.GET("/detail", configresource.Detail)
		resourceG.GET("/getByName", configresource.GetByName)
		resourceG.POST("/createVersion", configresource.CreateVersion)
		resourceG.POST("/batchCheckVersion", configresource.BatchCheckVersion)
		resourceG.GET("/tags", configresource.Tags)
		g.GET("/config/instance/list", confgov2.InstanceList) // 配置文件Diif，返回两个版本的配置内容
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
		resourceGroup.GET("/zone/zone_env", resource.ZoneEnv)

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
	g.GET("/system/config", system.Config) // 不走路由
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
	}
}
