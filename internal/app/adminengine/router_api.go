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
	"github.com/douyu/juno/api/apiv1/confgov2"
	etcdHandle "github.com/douyu/juno/api/apiv1/etcd"
	"github.com/douyu/juno/api/apiv1/event"
	pprofHandle "github.com/douyu/juno/api/apiv1/pprof"
	"github.com/douyu/juno/api/apiv1/resource"
	"github.com/douyu/juno/api/apiv1/system"
	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/app/middleware"
	"github.com/douyu/jupiter/pkg/server/xecho"
)

func apiV1(server *xecho.Server) {

	server.POST("/api/v1/resource/node/heartbeat", resource.NodeHeartBeat)

	v1 := server.Group("/api/v1", middleware.OpenAuth)
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

		// 创建应用和节点关系
		resourceGroup.POST("/app_node/put", resource.AppNodePut)
		// 根据应用和节点的id查询，应用节点关系信息
		resourceGroup.GET("/app_node/info", resource.AppNodeInfo)
		// 获取全部应用节点的列表
		// 根据应用的id或者应用名称，获取节点列表
		// 根据节点的hostname，获取应用列表
		resourceGroup.GET("/app_node/list", resource.AppNodeList)

		resourceGroup.GET("/app_env_zone/list", resource.AppEnvZoneList)
	}

	configurationGroup := v1.Group("/confgo")
	{
		configurationGroup.GET("/config/list", confgov2.List)                  // 配置文件列表
		configurationGroup.GET("/config/detail", confgov2.Detail)              // 配置文件内容
		configurationGroup.GET("/config/diff", confgov2.Diff)                  // 配置文件Diif，返回两个版本的配置内容
		configurationGroup.GET("/config/instance/list", confgov2.InstanceList) // 配置发布后各实例同步状态
		configurationGroup.GET("/config/history", confgov2.History)            // 配置文件历史
		configurationGroup.POST("/config/create", confgov2.Create)             // 配置新建
		configurationGroup.POST("/config/update", confgov2.Update)             // 配置更新
		configurationGroup.POST("/config/publish", confgov2.Publish)           // 配置发布
		configurationGroup.POST("/config/delete", confgov2.Delete)             // 配置删除
	}

	analysisGroup := v1.Group("/analysis")
	{
		analysisGroup.GET("/index", core.Handle(analysis.Index))
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
		pprofGroup.GET("/config/list", pprofHandle.GetSysConfig)
		//pprofGroup.POST("/config/update", pprofHandle.SetSysConfig)
	}

	etcdGroup := v1.Group("/etcd")
	{
		etcdGroup.GET("/list", etcdHandle.List)
	}
}
