package view

import "time"

const (
	// ConfigFormatToml ..
	ConfigFormatToml = "toml"
	// ConfigFormatYaml ..
	ConfigFormatYaml = "yaml"
)

var (
	// ConfigFormats Verified list
	ConfigFormats = []ConfigFormat{ConfigFormatToml, ConfigFormatYaml}
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
		ID          uint       `json:"id"`
		AID         uint       `json:"aid"`
		Name        string     `json:"name"`
		Content     string     `json:"content"`
		Format      string     `json:"format"` // Yaml/Toml
		Env         string     `json:"env"`    // 环境
		Zone        string     `json:"zone"`   // 机房Zone
		CreatedAt   time.Time  `json:"created_time"`
		UpdatedAt   time.Time  `json:"update_time"`
		PublishedAt *time.Time `json:"published"` // 未发布/发布时间
	}

	// ReqCreateConfig ..
	ReqCreateConfig struct {
		AppName  string       `json:"app_name" validate:"required"`
		Env      string       `json:"env" validate:"required"`
		Zone     string       `json:"zone" validate:"required"`
		FileName string       `json:"file_name" validate:"required"` // 文件名(不带后缀)
		Format   ConfigFormat `json:"format" validate:"required"`    // 格式后缀名(比如: toml, yaml)
	}

	// ReqUpdateConfig ..
	ReqUpdateConfig struct {
		ID      uint   `json:"id" validate:"required"`
		Message string `json:"message" validate:"required"`
		Content string `json:"content" validate:"required"`
	}

	// ReqPublishConfig ..
	ReqPublishConfig struct {
		ID      uint    `json:"id" validate:"required"`      // 配置ID
		Version *string `json:"version" validate:"optional"` // 版本号
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
		ID        uint `query:"id" validate:"required"`         // 配置ID
		HistoryID uint `query:"history_id" validate:"required"` // 版本ID
	}

	// RespDiffConfig ..
	RespDiffConfig struct {
		Origin   *RespDetailConfig `json:"origin,omitempty"`
		Modified RespDetailConfig  `json:"modified"`
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

	RespConfigInstanceList []RespConfigInstanceItem

	// RespConfigInstanceItem ..
	RespConfigInstanceItem struct {
		ConfigurationStatusID uint      `json:"configuration_status_id"`
		Env                   string    `json:"env"`
		IP                    string    `json:"ip"`
		HostName              string    `json:"host_name"`
		DeviceID              int       `json:"device_id"`
		RegionCode            string    `json:"region_code"`
		RegionName            string    `json:"region_name"`
		ZoneCode              string    `json:"zone_code"`
		ZoneName              string    `json:"zone_name"`
		ConfigFilePath        string    `json:"config_file_path"`
		ConfigFileUsed        uint      `json:"config_file_used"` // 1 supervisor 2 systemd
		ConfigFileSynced      uint      `json:"config_file_synced"`
		ConfigFileTakeEffect  uint      `json:"config_file_take_effect"`
		SyncAt                time.Time `json:"sync_at"`
		ChangeLog             string    `json:"change_log"`
		Version               string    `json:"version"` // 发布到Juno Proxy的版本号
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
