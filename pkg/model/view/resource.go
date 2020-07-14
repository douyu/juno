package view

import "github.com/douyu/juno/pkg/model/db"

type (
	ReqAppListWithEnv struct {
		SearchText string `query:"searchText"`
		Page       int    `query:"page"`
		PageSize   int    `query:"pageSize"`
	}

	RespAppListWithEnv struct {
		List       []AppListWithEnvItem `json:"list"`
		Pagination Pagination           `json:"pagination"`
	}

	AppListWithEnvItem struct {
		db.AppInfo
		Envs []string `json:"envs"`
	}
)
