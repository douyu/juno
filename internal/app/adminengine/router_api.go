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
	"github.com/douyu/juno/api/apiv1/analysis"
	"github.com/douyu/juno/api/apiv1/confgo"
	"github.com/douyu/juno/api/apiv1/event"
	pprofHandle "github.com/douyu/juno/api/apiv1/pprof"
	"github.com/douyu/juno/api/apiv1/resource"
	"github.com/douyu/juno/api/apiv1/system"
	"github.com/douyu/jupiter/pkg/server/xecho"
)

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

		// 系统设置
		systemGroup.GET("/setting/list", system.SettingList)
		systemGroup.POST("/setting/update", system.SettingUpdate)
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
		//pprofGroup.POST("/config/update", pprofHandle.SetSysConfig)
	}
}
