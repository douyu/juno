package view

import "time"

const (
	ConfigFormatToml = "toml"
	ConfigFormatYaml = "yaml"
)

var (
	// 验证的列表
	ConfigFormats = []ConfigFormat{ConfigFormatToml, ConfigFormatYaml}
)

type (
	ReqListConfig struct {
		AID uint   `json:"aid"`
		Env string `json:"env"`
	}

	RespListConfig []RespListConfigItem

	// 不包含配置内容，防止配置过长
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

	ReqDetailConfig struct {
		ID uint `json:"id"`
	}

	// 包含配置内容
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

	ReqCreateConfig struct {
		AID      uint         `json:"aid"`
		Env      string       `json:"env"`
		Zone     string       `json:"zone"`
		FileName string       `json:"file_name"` // 文件名(不带后缀)
		Format   ConfigFormat `json:"format"`    // 格式后缀名(比如: toml, yaml)
	}

	ReqUpdateConfig struct {
		ID      uint   `json:"id"`
		Message string `json:"message"`
		Content string `json:"content"`
	}

	ReqPublishConfig struct {
		ID      uint    `json:"id"`      // 配置ID
		Version *string `json:"version"` // 版本号
	}

	ReqHistoryConfig struct {
		ID   uint `json:"id"` // 配置文件ID
		Size uint `json:"size"`
		Page uint `json:"page"`
	}

	RespHistoryConfig struct {
		Pagination Pagination              `json:"pagination"`
		List       []RespHistoryConfigItem `json:"list"`
	}

	RespHistoryConfigItem struct {
		ID              uint      `json:"id"`
		UID             uint      `json:"uid"` // 发布人ID
		UserName        string    `json:"user_name"`
		ChangeLog       string    `json:"change_log"`
		ConfigurationID uint      `json:"configuration_id"`
		Version         string    `json:"version"` // 发布到Juno Proxy的版本号
		CreatedAt       time.Time `json:"created_at"`
	}

	ReqDiffConfig struct {
		ID uint `json:"id"`
	}

	RespDiffConfig struct {
		Origin   *RespDetailConfig `json:"origin,omitempty"`
		Modified RespDetailConfig  `json:"modified"`
	}

	ReqDeleteConfig struct {
		ID uint `json:"id"`
	}

	ReqConfigInstanceList struct {
		AID  uint   `json:"aid"`
		Env  string `json:"env"`
		Zone string `json:"zone"`
	}

	RespConfigInstanceList []RespConfigInstanceItem

	RespConfigInstanceItem struct {
		Env                  string    `json:"env"`
		IP                   string    `json:"ip"`
		HostName             string    `json:"host_name"`
		DeviceID             int       `json:"device_id"`
		RegionCode           string    `json:"region_code"`
		RegionName           string    `json:"region_name"`
		ZoneCode             string    `json:"zone_code"`
		ZoneName             string    `json:"zone_name"`
		ConfigFilePath       string    `json:"config_file_path"`
		ConfigFileUsed       bool      `json:"config_file_used"`
		ConfigFileSynced     bool      `json:"config_file_synced"`
		ConfigFileTakeEffect bool      `json:"config_file_take_effect"`
		SyncAt               time.Time `json:"sync_at"`
	}

	ConfigFormat string
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
