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

	configstatics "github.com/douyu/juno/api/apiv1/confgov2/configstatistics"
	"github.com/douyu/juno/api/apiv1/openauth"
	"github.com/douyu/juno/internal/app/core"

	"github.com/douyu/juno/api/apiv1/permission"
	"github.com/douyu/juno/internal/pkg/service/casbin"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/util"

	"github.com/douyu/juno/api/apiv1/analysis"
	"github.com/douyu/juno/api/apiv1/confgo"
	"github.com/douyu/juno/api/apiv1/confgov2"
	"github.com/douyu/juno/api/apiv1/confgov2/configresource"
	"github.com/douyu/juno/api/apiv1/event"
	pprofHandle "github.com/douyu/juno/api/apiv1/pprof"
	"github.com/douyu/juno/api/apiv1/resource"
	"github.com/douyu/juno/api/apiv1/static"
	"github.com/douyu/juno/api/apiv1/system"
	"github.com/douyu/juno/api/apiv1/user"
	"github.com/douyu/juno/internal/app/middleware"
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
	loginAuthWithJSON = middleware.LoginAuth("/user/login", middleware.RedirectTypeJson).Func()
	loginAuthRedirect = middleware.LoginAuth("/user/login", middleware.RedirectTypeHttp).Func()

	// session init
	sessionMW := session.Middleware(userSrv.NewSessionStore())

	var casbinMW echo.MiddlewareFunc
	// casbin init
	if cfg.Cfg.Casbin.Enable {
		casbinMW = middleware.CasbinMiddleware(middleware.CasbinConfig{
			Skipper: middleware.AllowPathPrefixSkipper("/api/admin/public",
				"/api/admin/user/login", "/api/admin/permission/menu/list", "/api/admin/confgov2/config",
				"/api/admin/pprof",
			),
			Enforcer: casbin.Casbin.SyncedEnforcer,
		})
	}

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

		configV2G.GET("/config/list", confgov2.List, configReadQueryMW)                 // 配置文件列表
		configV2G.GET("/config/detail", confgov2.Detail, configReadByIDMW)              // 配置文件内容
		configV2G.POST("/config/create", confgov2.Create, configWriteBodyMW)            // 配置新建
		configV2G.POST("/config/update", confgov2.Update, configWriteByIDMW)            // 配置更新
		configV2G.POST("/config/publish", confgov2.Publish, configWriteByIDMW)          // 配置发布
		configV2G.GET("/config/history", confgov2.History, configReadByIDMW)            // 配置文件历史
		configV2G.POST("/config/delete", confgov2.Delete, configWriteByIDMW)            // 配置删除
		configV2G.GET("/config/diff", confgov2.Diff, configReadByIDMW)                  // 配置文件Diif，返回两个版本的配置内容
		configV2G.GET("/config/instance/list", confgov2.InstanceList, configReadByIDMW) // 配置文件Diif，返回两个版本的配置内容

		configV2G.GET("/config/statics", configstatics.Statics, configReadQueryMW)
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
		analysisGroup.GET("/index", core.Handle(analysis.Index))
		analysisGroup.GET("/topology/select", analysis.TopologySelect)
		analysisGroup.GET("/topology/list", analysis.TopologyList)
		analysisGroup.GET("/topology/relationship", analysis.TopologyRelationship)
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

	openAuthG := g.Group("/openAuth", loginAuthWithJSON)
	{
		openAuthG.GET("/accessToken/list", openauth.ListAccessToken)
		openAuthG.POST("/accessToken/create", openauth.CreateAccessToken)
		openAuthG.POST("/accessToken/delete", openauth.DeleteAccessToken)
	}
}
