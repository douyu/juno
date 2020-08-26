package view

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/go-playground/validator"
)

const (
	VersionSettingName      string = "version"
	ConfigDepSettingName    string = "config_dep"
	EtcdSettingName         string = "etcd"
	GrafanaSettingName      string = "grafana"
	GatewaySettingName      string = "gateway"
	K8SClusterSettingName   string = "k8s_cluster"
	TestPlatformSettingName string = "test_platform"
)

var (
	// todo can't global config
	// 对各项配置进行设置，设置项写到此处才能生效
	SettingFieldConfigs = map[string]SettingFieldConfig{
		VersionSettingName: {
			Default: `[]`,
			Validate: func(value string) error {
				return nil
			},
		},
		EtcdSettingName: {
			Default: `[]`,
			Validate: func(value string) error {
				return nil
			},
		},
		GrafanaSettingName: {
			Default: `{"host":"","header_name":"",scheme:""}`,
			Validate: func(value string) error {
				setting := SettingGrafana{}
				err := json.Unmarshal([]byte(value), &setting)
				if err != nil {
					return err
				}

				scheme := strings.ToLower(setting.Scheme)
				if scheme != "http" && scheme != "https" {
					return fmt.Errorf("无效的协议: %s", scheme)
				}

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
		K8SClusterSettingName: {
			Default: "{\"list\":[]}",
			Validate: func(value string) error {
				data := SettingK8SCluster{}
				err := json.Unmarshal([]byte(value), &data)
				if err != nil {
					return err
				}

				err = validator.New().Struct(&data)
				if err != nil {
					return err
				}

				return nil
			},
		},
		TestPlatformSettingName: {
			Default: "{\"enable\":false}",
			Validate: func(value string) error {
				data := SettingTestPlatform{}

				err := json.Unmarshal([]byte(value), &data)
				if err != nil {
					return err
				}

				err = validator.New().Struct(&data)
				if err != nil {
					return err
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

	SettingGrafana struct {
		Host       string `json:"host"`
		Scheme     string `json:"scheme"`
		HeaderName string `json:"header_name"`
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

	SettingK8SCluster struct {
		List []struct {
			Name     string   `json:"name" validate:"required"`
			Env      []string `json:"env" validate:"required"`
			ZoneCode string   `json:"zone_code" validate:"required"`
			ZoneName string   `json:"zone_name" validate:"required"`
		} `json:"list"`
	}

	SettingTestPlatform struct {
		Enable bool
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
