package event

const (
	GitEventPushHook         = "Push Hook"
	GitEventTagPushHook      = "Tag Push Hook"
	GitEventIssueHook        = "Issue Hook"
	GitEventMergeRequestHook = "Merge Request Hook"
	GitEventWikiPageHook     = "Wiki Page Hook"
	GitEventPipelineHook     = "Pipeline Hook"
	GitEventJobHook          = "Job Hook"

	// gitlab信息变更
	EventPushHook         = "git_push"
	EventTagPushHook      = "git_tag_push"
	EventIssueHook        = "git_issue"
	EventMergeRequestHook = "git_merge_request"
	EventWikiPageHook     = "git_wiki_page"
	EventPipelineHook     = "git_pipeline"
	EventJobHook          = "git_job"

	// 配置信息变更
	EventConfgoFileCreate    = "confgo_file_create"
	EventConfgoFileUpdate    = "confgo_file_update"
	EventConfgoFileDelete    = "confgo_file_delete"
	EventConfgoFilePublish   = "confgo_file_publish"
	EventConfgoFileRollback  = "confgo_file_rollback"
	EventConfgoItemCreate    = "confgo_item_create"
	EventConfgoItemUpdate    = "confgo_item_update"
	EventConfgoItemDelete    = "confgo_item_delete"
	EventConfgoWatchHttpPush = "confgo_watch_http_push" // juno-agent 回调事件，http长轮询配置推送后触发
	EventConfgoWatchFileSync = "confgo_watch_file_sync" // juno-agent 回调事件，文件同步成功后触发

	EventAppRestart = "app_node_restart"

	// user
	EventCMDBUserCreate = "cmdb_user_create"
	EventCMDBUserDelete = "cmdb_user_delete"
	EventCMDBUserUpdate = "cmdb_user_update"

	// pprof信息的变更
	EventPprofCreate = "pprof_create"

	// grpc的服务治理流控操作
	EventDevopsUpdate     = "devops_update"
	EventGovernRegister   = "devops_register"
	EventDevopsUnregister = "devops_unregister"
	EventGovernRestart    = "devops_restart"
	EventGovernStop       = "devops_stop"
	EventGovernStart      = "devops_start"
	EventDevopsDeploy     = "devops_deploy"
	EventDevopsRollback   = "devops_rollback"

	// cmdb 同步
	EventCMDBAppCreate     = "cmdb_app_create"
	EventCMDBAppDelete     = "cmdb_app_delete"
	EventCMDBAppUpdate     = "cmdb_app_update"
	EventCMDBAppNodeCreate = "cmdb_app_node_create"
	EventCMDBAppNodeDelete = "cmdb_app_node_delete"

	EventCMDBNodeCreate = "cmdb_node_create"
	EventCMDBNodeDelete = "cmdb_node_delete"
	EventCMDBNodeUpdate = "cmdb_node_update"

	EventCMDBZoneCreate = "cmdb_zone_create"
	EventCMDBZoneDelete = "cmdb_zone_delete"
	EventCMDBZoneUpdate = "cmdb_zone_update"

	// grafana事件
	EventGrafanaAlertNotification = "grafana_alert_notification"
)

const (
	SourceConfgo  = "confgo"
	SourceGit     = "git"
	SourceDevops  = "devops"
	SourceCMDB    = "cmdb"
	SourceGrafana = "grafana"
)

var OperationMap = map[string]string{
	EventPushHook:                 "推送",
	EventDevopsDeploy:             "部署",
	EventDevopsRollback:           "回滚",
	EventDevopsUpdate:             "节点更新",
	EventPipelineHook:             "Git Pipeline",
	EventJobHook:                  "Git Job",
	EventConfgoFileCreate:         "配置文件新增",
	EventConfgoFileUpdate:         "配置文件更新",
	EventConfgoFileDelete:         "配置文件删除",
	EventConfgoFilePublish:        "配置文件发布",
	EventConfgoFileRollback:       "配置文件回滚",
	EventConfgoItemCreate:         "配置项新增",
	EventConfgoItemUpdate:         "配置项更新",
	EventConfgoItemDelete:         "配置项删除",
	EventConfgoWatchHttpPush:      "配置文件HTTP长轮询推送成功",
	EventConfgoWatchFileSync:      "配置文件于服务器文件系统同步成功",
	EventCMDBUserCreate:           "用户新增",
	EventCMDBUserDelete:           "用户删除",
	EventCMDBUserUpdate:           "用户更新",
	EventCMDBAppCreate:            "应用新增",
	EventCMDBAppDelete:            "应用删除",
	EventCMDBAppUpdate:            "应用更新",
	EventCMDBAppNodeCreate:        "节点新增",
	EventCMDBAppNodeDelete:        "节点删除",
	EventGovernRegister:           "节点注册",
	EventDevopsUnregister:         "节点注销",
	EventGrafanaAlertNotification: "Grafana报警",
	EventAppRestart:               "应用重启",
}

var SourceMap = map[string]string{
	SourceGit:     "Gitlab",
	SourceConfgo:  "配置中心",
	SourceDevops:  "Devops",
	SourceCMDB:    "CMDB",
	SourceGrafana: "Grafana",
}
