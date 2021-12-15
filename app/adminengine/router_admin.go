// Copyright 2020 Douyu
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package adminengine

import (
	"net/http"
	"strings"

	"github.com/douyu/juno/api/apiv1/provider"

	"github.com/douyu/juno/api/apiv1/analysis"
	"github.com/douyu/juno/api/apiv1/confgo"
	"github.com/douyu/juno/api/apiv1/confgov2"
	"github.com/douyu/juno/api/apiv1/confgov2/configresource"
	configstatics "github.com/douyu/juno/api/apiv1/confgov2/configstatistics"
	"github.com/douyu/juno/api/apiv1/cronjob"
	etcdHandle "github.com/douyu/juno/api/apiv1/etcd"
	"github.com/douyu/juno/api/apiv1/event"
	"github.com/douyu/juno/api/apiv1/loggerplatform"
	"github.com/douyu/juno/api/apiv1/openauth"
	"github.com/douyu/juno/api/apiv1/permission"
	pprofHandle "github.com/douyu/juno/api/apiv1/pprof"
	"github.com/douyu/juno/api/apiv1/resource"
	"github.com/douyu/juno/api/apiv1/static"
	"github.com/douyu/juno/api/apiv1/system"
	"github.com/douyu/juno/api/apiv1/test/grpc"
	http2 "github.com/douyu/juno/api/apiv1/test/http"
	"github.com/douyu/juno/api/apiv1/test/platform"
	"github.com/douyu/juno/api/apiv1/user"
	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/app/middleware"
	"github.com/douyu/juno/internal/pkg/service/casbin"
	"github.com/douyu/juno/internal/pkg/service/grafana"
	userSrv "github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/util"
	"github.com/douyu/jupiter/pkg/server/xecho"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	vmiddleware "github.com/labstack/echo/v4/middleware"
)

func apiAdmin(server *xecho.Server) {
	var loginAuthWithJSON echo.MiddlewareFunc // Login authorization, in JSON form
	var loginAuthRedirect echo.MiddlewareFunc // Login authorization, in the form of Http jump

	// If it is a local environment, go to Debug mode
	loginAuthWithJSON = middleware.LoginAuth("/user/login", middleware.RedirectTypeJson).Func()
	loginAuthRedirect = middleware.LoginAuth("/user/login", middleware.RedirectTypeHttp).Func()

	// session init
	sessionMW := session.Middleware(userSrv.NewSessionStore())

	var casbinMW echo.MiddlewareFunc
	// casbin init
	if cfg.Cfg.Casbin.Enable {
		casbinMW = middleware.CasbinMiddleware(middleware.CasbinConfig{
			Skipper: middleware.AllowPathPrefixSkipper("/api/admin/public",
				"/api/admin/user/login",
				"/api/admin/permission/menu/list",
				"/api/admin/confgov2/config",
				"/api/admin/pprof",
			),
			Enforcer: casbin.Casbin.SyncedEnforcer,
		})
	}

	server.Use(vmiddleware.GzipWithConfig(vmiddleware.GzipConfig{
		Level: 5,
	}))

	// static file
	flag, err := util.IsFileExists("assets/dist")
	if err != nil || !flag {
		panic("assets/dist not exist")
	}

	server.GET("/", static.File("assets/dist/index.html"), sessionMW, loginAuthRedirect)
	server.Static("/ant/*", "assets/dist")
	server.Static("/pprof/*", cfg.Cfg.Pprof.StorePath)

	echo.NotFoundHandler = func(c echo.Context) error {
		if strings.HasPrefix(c.Request().URL.Path, "/api/") {
			return c.JSON(http.StatusNotFound, http.StatusText(http.StatusNotFound))
		}
		return c.File("assets/dist")
	}

	// grafana proxy
	groupGrafana := server.Group("/grafana", sessionMW, loginAuthRedirect, middleware.GrafanaAuthMW)
	{
		AllMethods := []string{http.MethodGet, http.MethodPost, http.MethodPatch, http.MethodDelete,
			http.MethodHead, http.MethodTrace, http.MethodPut, http.MethodConnect, http.MethodOptions}
		groupGrafana.Match(AllMethods, "", grafana.Proxy)
		groupGrafana.Match(AllMethods, "/", grafana.Proxy)
		groupGrafana.Match(AllMethods, "/*", grafana.Proxy)
	}

	g := server.Group("/api/admin")
	g.Use(sessionMW) // use session
	if cfg.Cfg.Casbin.Enable {
		g.Use(casbinMW) // use casbin
	}

	publicGroup := g.Group("/public")
	{
		// public
		publicGroup.GET("/system/config", system.Config)
		publicGroup.GET("/user/logout", user.Logout, loginAuthWithJSON)
		publicGroup.GET("/user/info", core.Handle(user.Info), loginAuthWithJSON)

		// 应用浏览记录
		publicGroup.GET("/user/appViewHistory", user.GetAppViewHistory)
		publicGroup.POST("/user/appViewHistory", user.PostAppViewHistory)

		// 用户在某个应用下使用的一些配置，比如监控版本等选择
		publicGroup.GET("/user/appConfig", user.GetAppConfig)
		publicGroup.POST("/user/appConfig", user.PostAppConfig)

		// 记录用户访问的页面信息
		publicGroup.GET("/user/tabVisit", user.GetTabVisit)
		publicGroup.POST("/user/tabVisit", user.PostTabVisit)
	}

	userGroup := g.Group("/user")
	{
		// user
		userGroup.POST("/login", user.Login)
		userGroup.GET("/login/:oauth", user.LoginOauth)
		userGroup.POST("/create", user.Create, loginAuthWithJSON)
		userGroup.POST("/update", user.Update, loginAuthWithJSON)
		userGroup.GET("/list", user.List, loginAuthWithJSON)
		userGroup.POST("/delete", user.Delete, loginAuthWithJSON)

	}

	confgoGroup := g.Group("/confgo", loginAuthWithJSON)
	{
		confgoGroup.GET("/tpl/list", confgo.TplList)
		confgoGroup.GET("/tpl/info", confgo.TplInfo)
		confgoGroup.POST("/tpl/create", confgo.TplCreate)
		confgoGroup.POST("/tpl/update", confgo.TplUpdate)
		confgoGroup.POST("/tpl/delete", confgo.TplDelete)
	}

	configV2G := g.Group("/confgov2", loginAuthWithJSON)
	{
		// 根据请求获取应用环境信息，并进行权限验证
		configReadQueryMW := middleware.CasbinAppMW(middleware.ParseAppEnvFromContext, db.AppPermConfigRead)
		configWriteBodyMW := middleware.CasbinAppMW(middleware.ParseAppEnvFromContext, db.AppPermConfigWrite)
		configReadByIDMW := middleware.CasbinAppMW(middleware.ParseAppEnvFromConfigID, db.AppPermConfigRead)
		configWriteByIDMW := middleware.CasbinAppMW(middleware.ParseAppEnvFromConfigID, db.AppPermConfigWrite)
		configReadInstanceMW := middleware.CasbinAppMW(middleware.ParseAppEnvFromConfigID, db.AppPermConfigReadInstance)

		configV2G.POST("/config/lock", core.Handle(confgov2.Lock), configWriteByIDMW)                                      // 获取配置编辑锁
		configV2G.POST("/config/unlock", core.Handle(confgov2.Unlock), configWriteByIDMW)                                  // 解锁配置
		configV2G.GET("/config/list", confgov2.List, configReadQueryMW)                                                    // 配置文件列表
		configV2G.GET("/config/detail", confgov2.Detail, configReadByIDMW)                                                 // 配置文件内容
		configV2G.POST("/config/create", confgov2.Create, configWriteBodyMW)                                               // 配置新建
		configV2G.POST("/config/update", confgov2.Update, configWriteByIDMW)                                               // 配置更新
		configV2G.POST("/config/publish", core.Handle(confgov2.Publish), configWriteByIDMW)                                // 配置发布
		configV2G.GET("/config/history", confgov2.History, configReadByIDMW)                                               // 配置文件历史
		configV2G.POST("/config/delete", confgov2.Delete, configWriteByIDMW)                                               // 配置删除
		configV2G.GET("/config/diff", confgov2.Diff, configReadByIDMW)                                                     // 配置文件Diif，返回两个版本的配置内容
		configV2G.GET("/config/instance/list", confgov2.InstanceList, configReadByIDMW)                                    // 配置文件Diif，返回两个版本的配置内容
		configV2G.GET("/config/instance/configContent", core.Handle(confgov2.InstanceConfigContent), configReadInstanceMW) // 读取机器上的配置文件
		configV2G.GET("/config/statics", configstatics.Statics)                                                            // 全局的统计信息，不走应用权限

		configV2G.POST("/app/action", confgov2.AppAction, configWriteBodyMW)

		resourceG := configV2G.Group("/resource")
		resourceG.GET("/list", configresource.List)
		resourceG.POST("/create", configresource.Create)
		resourceG.GET("/detail", configresource.Detail)
		resourceG.GET("/getByName", configresource.GetByName)
		resourceG.POST("/createVersion", configresource.CreateVersion)
		resourceG.POST("/batchCheckVersion", configresource.BatchCheckVersion)
		resourceG.GET("/tags", configresource.Tags)

	}

	resourceGroup := g.Group("/resource", loginAuthWithJSON)
	{
		resourceGroup.GET("/app/info", resource.AppInfo)
		resourceGroup.GET("/app/list", resource.AppList)
		resourceGroup.GET("/app/listWithEnv", resource.AppListWithEnv)
		resourceGroup.GET("/app/frameVersion", resource.GetFrameVersion)
		resourceGroup.POST("/app/create", resource.AppCreate)
		resourceGroup.POST("/app/update", resource.AppUpdate)
		resourceGroup.POST("/app/delete", resource.AppDelete)
		resourceGroup.GET("/app/grpcAddrList", core.Handle(resource.GrpcAddrList))
		resourceGroup.GET("/app/httpAddrList", core.Handle(resource.HttpAddrList))

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
		resourceGroup.GET("/app_node/listSync", resource.AppNodeListSync)
		resourceGroup.POST("/app_node/put", resource.AppNodePut)
		resourceGroup.GET("/app_node/transfer/list", resource.AppNodeTransferList)
		resourceGroup.POST("/app_node/transfer/put", resource.AppNodeTransferPut)

		resourceGroup.GET("/app_env_zone/list", resource.AppEnvZoneList)
	}

	// 测试平台组
	testGroup := g.Group("/test", loginAuthWithJSON)
	{
		// GRPC 测试
		grpcG := testGroup.Group("/grpc")
		{
			//grpcG.GET("/proto/methods", nil)        // 获取 PB Method 列表
			grpcG.GET("/proto", core.Handle(grpc.Proto))                                 // PB 列表
			grpcG.GET("/proto/methods/detail", core.Handle(grpc.MethodDetail))           // PB Method 详情
			grpcG.POST("/proto/bind", core.Handle(grpc.BindProtoToApp))                  // 绑定 PB 到应用
			grpcG.GET("/appServiceTree", core.Handle(grpc.AppServiceTree))               // app > pb-service 树
			grpcG.GET("/services", core.Handle(grpc.Services))                           // services -> method -> use-cases tree
			grpcG.GET("/useCases", core.Handle(grpc.UseCases))                           // pb-method > use-cases 树
			grpcG.POST("/useCases/create", core.Handle(grpc.CreateUseCase))              // 创建用例
			grpcG.POST("/useCases/update", core.Handle(grpc.UpdateUseCase))              // 更新用例
			grpcG.POST("/useCases/delete", core.Handle(grpc.DeleteUseCase))              // 删除用例
			grpcG.GET("/useCases/detail", core.Handle(grpc.UseCaseDetail))               // 获取用例详情
			grpcG.POST("/request/send", core.Handle(grpc.SendRequest))                   // 发送 GRPC 请求
			grpcG.GET("/request/history", core.Handle(grpc.RequestHistory))              // 请求历史
			grpcG.GET("/request/history/detail", core.Handle(grpc.RequestHistoryDetail)) // 历史详情
		}

		httpG := testGroup.Group("/http")
		{
			httpG.POST("/collections/create", core.Handle(http2.CreateCollection)) // 创建 Collection
			httpG.GET("/collections", core.Handle(http2.CollectionList))           // Collection->用例 列表
			httpG.POST("/collections/delete", core.Handle(http2.DeleteCollection)) // 删除 collection
			httpG.GET("/useCases/detail", core.Handle(http2.UseCaseDetail))        // 用例详情
			httpG.POST("/useCases/create", core.Handle(http2.CreateUseCase))       // 创建用例
			httpG.POST("/useCases/update", core.Handle(http2.UpdateUseCase))       // 更新用例
			httpG.POST("/useCases/delete", core.Handle(http2.DeleteUseCase))       // 删除用例
			httpG.POST("/request/send", core.Handle(http2.SendRequest))            // 发送请求
			httpG.GET("/request/history", core.Handle(http2.RequestHistory))       // 请求历史
			httpG.GET("/request/history/detail", core.Handle(http2.RequestDetail)) // 请求历史详情
		}

		// 自动化测试平台
		platformG := testGroup.Group("/platform")
		{
			platformG.POST("/pipeline/create", core.Handle(platform.CreatePipeline))
			platformG.GET("/pipeline/list", core.Handle(platform.ListPipeline))
			platformG.POST("/pipeline/update", core.Handle(platform.UpdatePipeline))
			platformG.POST("/pipeline/run", core.Handle(platform.RunPipeline))
			platformG.GET("/pipeline/tasks", core.Handle(platform.TaskList))
			platformG.POST("/pipeline/delete", core.Handle(platform.DeletePipeline))
			platformG.GET("/pipeline/tasks/steps", core.Handle(platform.TaskSteps))
			platformG.GET("/worker/zones", core.Handle(platform.WorkerZones))
		}
	}

	cronjobG := g.Group("/cronjob", loginAuthWithJSON)
	{
		// Job
		cronjobG.GET("/list", core.Handle(cronjob.ListJob))
		cronjobG.POST("/create", core.Handle(cronjob.CreateJob))
		cronjobG.POST("/update", core.Handle(cronjob.UpdateJob))
		cronjobG.POST("/delete", core.Handle(cronjob.DeleteJob))
		cronjobG.POST("/dispatch", core.Handle(cronjob.Dispatch)) // 手动触发操作

		// Task
		taskG := cronjobG.Group("/task")
		taskG.GET("/list", core.Handle(cronjob.ListTask))     // 任务列表
		taskG.GET("/detail", core.Handle(cronjob.DetailTask)) // 任务详情（日志等）
	}

	analysisGroup := g.Group("/analysis", loginAuthWithJSON)
	{
		analysisGroup.GET("/index", core.Handle(analysis.Index))
		analysisGroup.GET("/topology/select", analysis.TopologySelect)
		analysisGroup.GET("/topology/list", analysis.TopologyList)
		analysisGroup.GET("/topology/relationship", analysis.TopologyRelationship)
		analysisGroup.GET("/deppkg/list", analysis.DependenceList)
		analysisGroup.GET("/register/list", core.Handle(etcdHandle.ProTableList))
	}

	systemGroup := g.Group("/system", loginAuthWithJSON)
	{
		systemGroup.GET("/menu", system.MenuList)
		systemGroup.GET("/option/info", system.OptionInfo)
		systemGroup.GET("/option/list", system.OptionList)
		systemGroup.POST("/option/create", system.OptionCreate)
		systemGroup.POST("/option/update", system.OptionUpdate)
		systemGroup.POST("/option/delete", system.OptionDelete)

		// 系统设置
		systemGroup.GET("/setting/list", system.SettingList)
		systemGroup.POST("/setting/update", system.SettingUpdate)
	}

	permissionG := g.Group("/permission", loginAuthWithJSON)
	{
		// 用户列表
		permissionG.GET("/user/list", permission.ListUser)
		// 用户组列表
		permissionG.GET("/user/group/list", permission.ListUserGroup)
		// 修改用户组
		permissionG.GET("/user/group/update", permission.UpdateUserGroup)
		// 管理用户所在组
		permissionG.POST("/user/changeGroup", permission.ChangeUserGroup)
		// 分配用户组接口权限
		permissionG.POST("/user/group/setApiPermission", permission.SetAPIPerm)
		// 分配用户组应用权限
		permissionG.POST("/user/group/setAppPermission", permission.SetAppPerm)
		// 分配用户组菜单权限
		permissionG.POST("/user/group/setMenuPermission", permission.SetMenuPerm)
		// 获取用户有权限的菜单列表
		permissionG.GET("/user/group/menuPermission", permission.GetMenuPerm)
		// 获取用户组有权限的接口列表
		permissionG.GET("/user/group/apiPermission", permission.GetAPIPerm)
		// 获取用户组有权限的应用列表
		permissionG.GET("/user/group/appPermission", permission.GetAppPerm)

		// 应用权限列表
		permissionG.GET("/appPermissions", permission.AppPermissionList)

		// 应用组列表
		permissionG.GET("/app/group", permission.ListAppGroup)
		// 修改应用组
		permissionG.POST("/app/group/update", permission.UpdateAppGroup)
		// 分配应用所在组
		permissionG.POST("/app/changeGroup", permission.ChangeAppGroup)

		// 菜单列表
		permissionG.GET("/menu/list", permission.ListMenu)
		// 菜单-API权限树
		permissionG.GET("/permissionTree", permission.MenuAPITree)
	}

	eventGroup := g.Group("/event", loginAuthWithJSON)
	{
		eventGroup.GET("/list", event.List)
	}

	pprofGroup := g.Group("/pprof", loginAuthWithJSON)
	{
		mwRunPProfAuth := middleware.CasbinAppMW(middleware.ParseAppEnvFromContext, db.AppPermPProfRun)
		mwReadPProfAuth := middleware.CasbinAppMW(middleware.ParseAppEnvFromContext, db.AppPermPProfRead)

		pprofGroup.POST("/run", pprofHandle.Run, mwRunPProfAuth)
		pprofGroup.GET("/list", pprofHandle.FileList, mwReadPProfAuth)
		pprofGroup.GET("/dep/check", pprofHandle.CheckDep)

		// 和应用无关的接口
		pprofGroup.GET("/config/list", pprofHandle.GetSysConfig)
	}

	etcdGroup := g.Group("/etcd")
	{
		etcdGroup.GET("/list", etcdHandle.List)
	}

	grpcGroup := g.Group("/grpc")
	{
		grpcGroup.GET("/aggregation/list", provider.AggregationList)
		grpcGroup.POST("/configurators/update", provider.ConfiguratorsUpdate)
	}

	openAuthG := g.Group("/openAuth", loginAuthWithJSON)
	{
		openAuthG.GET("/accessToken/list", openauth.ListAccessToken)
		openAuthG.POST("/accessToken/create", openauth.CreateAccessToken)
		openAuthG.POST("/accessToken/delete", openauth.DeleteAccessToken)
	}

	loggerGroup := g.Group("/logger", loginAuthWithJSON)
	{
		loggerGroup.GET("/logstore", core.Handle(loggerplatform.LogStore))
	}
}
