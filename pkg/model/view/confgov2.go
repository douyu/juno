package view

import (
	"time"
)

const (
	// ConfigFormatToml ..
	ConfigFormatToml = "toml"
	// ConfigFormatYaml ..
	ConfigFormatYaml = "yaml"
	// INI格式
	ConfigFormatINI = "ini"

	// ConfigureUsedType ..
	ConfigureUsedTypeSupervisor = 1
	ConfigureUsedTypeSystemd    = 2
)

var (
	// ConfigFormats Verified list
	ConfigFormats = []ConfigFormat{ConfigFormatToml, ConfigFormatYaml, ConfigFormatINI}
)

type (
	// ReqListConfig ..
	ReqListConfig struct {
		AppName string `query:"app_name" validate:"required"`
		Env     string `query:"env" validate:"required"`
	}

	// RespListConfig ..
	RespListConfig []RespListConfigItem

	// RespListConfigItem Does not contain configuration content to prevent configuration from being too long
	RespListConfigItem struct {
		ID          uint       `json:"id"`
		AID         uint       `json:"aid"`
		Name        string     `json:"name"`
		Format      string     `json:"format"` // Yaml/Toml
		Env         string     `json:"env"`    // 环境
		Zone        string     `json:"zone"`   // 机房Zone
		CreatedAt   time.Time  `json:"created_time"`
		UpdatedAt   time.Time  `json:"update_time"`
		DeletedAt   *time.Time `json:"deleted_at"`
		PublishedAt *time.Time `json:"published"` // 未发布/发布时间
	}

	// ReqDetailConfig ..
	ReqDetailConfig struct {
		ID uint `json:"id" validate:"required"`
	}

	// RespDetailConfig Contains configuration content
	RespDetailConfig struct {
		ID              uint       `json:"id"`
		AID             uint       `json:"aid"`
		Name            string     `json:"name"`
		Content         string     `json:"content"`
		Format          string     `json:"format"` // Yaml/Toml
		Env             string     `json:"env"`    // 环境
		Zone            string     `json:"zone"`   // 机房Zone
		CreatedAt       time.Time  `json:"created_time"`
		UpdatedAt       time.Time  `json:"update_time"`
		PublishedAt     *time.Time `json:"published"`         // 未发布/发布时间
		CurrentEditUser *User      `json:"current_edit_user"` //当前正在编辑的用户名
	}

	// ReqCreateConfig ..
	ReqCreateConfig struct {
		AppName  string       `json:"app_name" validate:"required"`
		Env      string       `json:"env" validate:"required"`
		Zone     string       `json:"zone" validate:"required"`
		FileName string       `json:"file_name" validate:"required"`                  // 文件名(不带后缀)
		Format   ConfigFormat `json:"format" validate:"required,oneof=yaml toml ini"` // 格式后缀名(比如: toml, yaml)
	}

	// ReqUpdateConfig ..
	ReqUpdateConfig struct {
		ID      uint   `json:"id" validate:"required"`
		Message string `json:"message" validate:"required"`
		Content string `json:"content" validate:"required"`
	}

	// ReqPublishConfig ..
	ReqPublishConfig struct {
		ID       uint     `json:"id" validate:"required"` // 配置ID
		HostName []string `json:"host_name"`              // 发布的实例机器名称的列表，如果为空，则发布所有机器
		Version  *string  `json:"version"`                // 版本号
		PubK8S   bool     `json:"pub_k8s"`                // 是否发布集群
	}

	// ReqHistoryConfig ..
	ReqHistoryConfig struct {
		ID   uint `json:"id" validate:"required"` // 配置文件ID
		Size uint `json:"size" validate:"required"`
		Page uint `json:"page"`
	}

	// RespHistoryConfig ..
	RespHistoryConfig struct {
		Pagination Pagination              `json:"pagination"`
		List       []RespHistoryConfigItem `json:"list"`
	}

	// RespHistoryConfigItem ..
	RespHistoryConfigItem struct {
		ID              uint      `json:"id"`
		UID             uint      `json:"uid"` // 发布人ID
		AccessTokenID   uint      `json:"access_token_id"`
		AccessTokenName string    `json:"access_token_name"`
		UserName        string    `json:"user_name"`
		ChangeLog       string    `json:"change_log"`
		ConfigurationID uint      `json:"configuration_id"`
		Version         string    `json:"version"` // 发布到Juno Proxy的版本号
		CreatedAt       time.Time `json:"created_at"`
	}

	// ReqDiffConfig ..
	ReqDiffConfig struct {
		ID             uint   `query:"id"`             // 配置ID
		HistoryID      uint   `query:"history_id"`     // 版本ID
		AppName        string `query:"appName"`        // 应用名称
		Env            string `query:"env"`            // 环境
		ServiceVersion string `query:"serviceVersion"` // 服务器版本
		PublishVersion string `query:"publishVersion"` // 发布版本
	}
	// RespDiffConfig ..
	RespDiffConfig struct {
		Origin   *RespDetailConfig `json:"origin,omitempty"`
		Modified RespDetailConfig  `json:"modified"`
	}

	// ReqDiffReleaseConfig ..
	ReqDiffReleaseConfig struct {
		AppName string   `query:"appName" validate:"required"` // 应用名
		Env     string   `query:"env" validate:"required"`     // 环境
		Ips     []string `query:"ips" validate:"required"`     // ips
	}
	// RespDiffReleaseConfig ..
	RespDiffReleaseConfig struct {
		HasNew      bool `query:"hasNew"` // 服务器配置与发布配置是否一致；true：一直，false：不一致
		DiffUrlList []DiffUrlList `query:"diffUrlList"`
	}

	DiffUrlList struct {
		Name    string `query:"name"`    // 配置文件名称
		DiffUrl string `query:"diffUrl"` // diff链接地址
	}

	// ReqDeleteConfig ..
	ReqDeleteConfig struct {
		ID uint `json:"id" validate:"required"`
	}

	ReqConfigInstanceList struct {
		ConfigurationID uint   `json:"id" query:"id" validate:"required"`
		Env             string `json:"env" query:"env" validate:"required"`
		ZoneCode        string `json:"zone_code" query:"zone_code" validate:"required"`
	}

	ReqAppAction struct {
		Action   string `json:"action" query:"action" validate:"required"`
		Typ      uint   `json:"typ" query:"typ" validate:"required"`
		NodeName string `json:"node_name" query:"node_name" validate:"required"`
		AppName  string `json:"app_name" query:"app_name" validate:"required"`
		ZoneCode string `json:"zone_code" query:"zone_code" validate:"required"`
		Env      string `json:"env" query:"env" validate:"required"`
	}

	RespAppAction struct {
		Code int         `json:"code"`
		Msg  string      `json:"msg"`
		Data interface{} `json:"data"`
	}

	RespConfigInstanceList []RespConfigInstanceItem

	// RespConfigInstanceItem ..
	RespConfigInstanceItem struct {
		ConfigurationStatusID uint   `json:"configuration_status_id"`
		Env                   string `json:"env"`
		IP                    string `json:"ip"`
		HostName              string `json:"host_name"`
		DeviceID              int    `json:"device_id"`
		RegionCode            string `json:"region_code"`
		RegionName            string `json:"region_name"`
		ZoneCode              string `json:"zone_code"`
		ZoneName              string `json:"zone_name"`
		ConfigFilePath        string `json:"config_file_path"`
		ConfigFileUsed        uint   `json:"config_file_used"` // 1 supervisor 2 systemd
		ConfigFileSynced      uint   `json:"config_file_synced"`
		ConfigFileTakeEffect  uint   `json:"config_file_take_effect"`
		SyncAt                string `json:"sync_at"`
		ChangeLog             string `json:"change_log"`
		Version               string `json:"version"` // 发布到Juno Proxy的版本号
	}

	// ConfigFormat ..
	ConfigFormat string

	// ReqConfigPublish configuration publish request struct
	ReqConfigPublish struct {
		AppName      string   `json:"app_name"`
		ZoneCode     string   `json:"zone_code"`
		Port         string   `json:"port"`
		FileName     string   `json:"file_name"`
		Format       string   `json:"format"`
		Content      string   `json:"content"`
		InstanceList []string `json:"instance_list"`
		Env          string   `json:"env"`
		Version      string   `json:"version"`
		PubK8S       bool     `json:"pub_k8s"`
	}

	ReqReadInstanceConfig struct {
		ConfigID uint   `query:"id" validate:"required"`
		HostName string `query:"host_name" validate:"required"`
	}

	ReqLockConfig struct {
		ConfigID uint `query:"id" validate:"required"`
	}

	RespReadInstanceConfigItem struct {
		ConfigID uint   `json:"config_id"`
		FileName string `json:"file_name"`
		Content  string `json:"content"`
		Error    string `json:"error"`
	}

	// ConfigurationPublishData ..
	ConfigurationPublishData struct {
		Content  string   `json:"content"`
		Metadata Metadata `json:"metadata"`
	}

	// Metadata ..
	Metadata struct {
		Timestamp int64    `json:"timestamp"`
		Version   string   `json:"version"`
		Format    string   `json:"format"`
		Paths     []string `json:"paths"`
	}

	// ConfigurationStatus ..
	ConfigurationStatus struct {
		// etcd store data
		FileName   string `json:"file_name"`
		Version    string `json:"md5"`
		Hostname   string `json:"hostname"`
		Env        string `json:"env"`
		Timestamp  int64  `json:"timestamp"`
		IP         string `json:"ip"`
		HealthPort string `json:"health_port"`

		// attach key
		ZoneCode      string `json:"zone_code"`
		EffectVersion string `json:"effect_version"`
	}

	// JunoAgent ..
	JunoAgent struct {
		HostName string `json:"host_name"`
		IPPort   string `json:"ip"`
	}

	// UsedStatusResp ..
	UsedStatusResp struct {
		IsUsed int `json:"is_used"`
	}

	// EnvStatic ..
	EnvStatic struct {
		Env string `json:"env"`
		Cnt int    `json:"cnt"`
	}

	// CmcCnt ..
	CmcCnt struct {
		DayTime string `json:"day_time" gorm:"day_time"`
		Cnt     int    `gorm:"cnt" json:"cnt"`
	}

	AppAction struct {
		Action   string `json:"action" query:"action"`
		AppName  string `json:"app_name" query:"app_name"`
		NodeName string `json:"node_name" query:"node_name"`
		Typ      uint   `json:"typ" query:"typ"`
	}
)

//CheckConfigFormat 检查配置文件格式是否符合要求
func CheckConfigFormat(format ConfigFormat) bool {
	for _, item := range ConfigFormats {
		if item == format {
			return true
		}
	}

	return false
}
