package view

import "github.com/douyu/juno/internal/pkg/model/db"

const (
	GrafanaSettingName   SettingName = "grafana"
	ConfigDepSettingName SettingName = "config_dep"
)

var (
	// 默认的设置值
	SettingFieldConfigs = map[SettingName]SettingFieldConfig{
		GrafanaSettingName: {
			Default: `{"host":"","header_name":"","api_dashboard_addr":"","instance_dashboard_addr":"","overview_dashboard_addr":""}`,
			Validate: func(value string) error {
				return nil
			},
		},
		ConfigDepSettingName: {
			Default: `{"interval":720}`,
			Validate: func(value string) error {
				return nil
			},
		},
	}
)

type (
	// 设置名称
	SettingName string

	// 设置项配置
	SettingFieldConfig struct {
		Default  string                   // 默认值
		Validate func(value string) error // 配置内容检查函数
	}

	// 机房信息
	ReqOptionInfo struct {
		Id          int    `query:"id"`
		OptionTitle string `query:"option_title"`
	}

	ReqOptionList struct {
		CurrentPage int `query:"currentPage"`
		PageSize    int `query:"pageSize"`
	}

	ReqOptionCreate struct {
		db.Option
	}

	ReqOptionUpdate struct {
		db.Option
	}

	ReqOptionDelete struct {
		db.Option
	}

	// 更新设置
	ReqUpdateSettings struct {
		Name    SettingName `json:"name"`
		Content string      `json:"content"`
	}

	SettingGrafana struct {
		Host                  string `json:"host"`
		HeaderName            string `json:"header_name"`
		ApiDashboardAddr      string `json:"api_dashboard_addr"`      // api监控面板路径
		InstanceDashboardAddr string `json:"instance_dashboard_addr"` // 实例监控面板
		OverviewDashboardAddr string `json:"overview_dashboard_addr"` // 概览面板
	}

	SettingConfigDep struct {
		Interval uint `json:"interval"` // 配置依赖解析的
	}
)

func CheckSettingNameValid(settingName SettingName) bool {
	_, ok := SettingFieldConfigs[settingName]
	return ok
}
