package view

import (
	"encoding/json"
	"fmt"

	"github.com/douyu/juno/pkg/model/db"
)

const (
	GrafanaSettingName   SettingName = "grafana"
	ConfigDepSettingName SettingName = "config_dep"
	GatewaySettingName   SettingName = "gateway"
)

var (
	// 对各项配置进行设置，设置项写到此处才能生效
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
		GatewaySettingName: {
			Default: "[]",
			Validate: func(value string) error {
				field := SettingGateway{}
				err := json.Unmarshal([]byte(value), &field)
				if err != nil {
					return err
				}

				// 检查是否有重复项
				settingMap := make(map[string]SettingGatewayItem)
				for _, item := range field {
					if _, ok := settingMap[item.Domain]; ok {
						// 相同的域名存在重复配置
						return fmt.Errorf("域名 %s 存在重复配置", item.Domain)
					}

					settingMap[item.Domain] = item
				}

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
		Validate func(value string) error // 参数检查函数
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

	SettingGateway []SettingGatewayItem

	SettingGatewayItem struct {
		Name    string `json:"name"`    // 设置项名称
		Domain  string `json:"domain"`  // 访问地址，Juno根据这个域名进行代理
		Host    string `json:"host"`    // 被代理的服务真实地址
		Scheme  string `json:"scheme"`  // 被代理的服务的协议
		Timeout uint   `json:"timeout"` // 超时（秒）
		Headers []struct {
			Name  string `json:"name"`
			Value string `json:"value"`
		} `json:"headers"` // header头
	}
)

func CheckSettingNameValid(settingName SettingName) bool {
	_, ok := SettingFieldConfigs[settingName]
	return ok
}

func GetSettingFieldConfig(name SettingName) (SettingFieldConfig, bool) {
	config, ok := SettingFieldConfigs[name]
	return config, ok
}
