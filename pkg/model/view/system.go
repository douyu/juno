package view

import (
	"encoding/json"
	"fmt"

	"github.com/douyu/juno/pkg/model/db"
)

const (
	ConfigDepSettingName string = "config_dep"
)

var (
	// todo can't global config
	// 对各项配置进行设置，设置项写到此处才能生效
	SettingFieldConfigs = map[string]SettingFieldConfig{
		"version": {
			Default: `[]`,
			Validate: func(value string) error {
				return nil
			},
		},
		"etcd": {
			Default: `[]`,
			Validate: func(value string) error {
				return nil
			},
		},
		"grafana": {
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
		"gateway": {
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
		Name    string `json:"name"`
		Content string `json:"content"`
	}

	SettingGrafana []SettingGrafanaItem // 多个监控版本

	SettingGrafanaItem struct {
		Version    string                    `json:"version"`
		Host       string                    `json:"host"` // Grafana 地址
		HeaderName string                    `json:"header_name"`
		Field      []SettingGrafanaDashboard `json:"field"`
	}

	SettingGrafanaDashboard struct {
		Name  string `json:"name"`  // Dashboard 名称
		Value string `json:"value"` // Dashboard 路由
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

func CheckSettingNameValid(settingName string) bool {
	_, ok := SettingFieldConfigs[settingName]
	return ok
}

func GetSettingFieldConfig(name string) (SettingFieldConfig, bool) {
	config, ok := SettingFieldConfigs[name]
	return config, ok
}
