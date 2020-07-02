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
		AID uint   `json:"aid"`
		Env string `json:"env"`
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
		ID uint `json:"id"`
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
		AID      uint         `json:"aid"`
		Env      string       `json:"env"`
		Zone     string       `json:"zone"`
		FileName string       `json:"file_name"` // 文件名(不带后缀)
		Format   ConfigFormat `json:"format"`    // 格式后缀名(比如: toml, yaml)
	}

	// ReqUpdateConfig ..
	ReqUpdateConfig struct {
		ID      uint   `json:"id"`
		Message string `json:"message"`
		Content string `json:"content"`
	}

	// ReqPublishConfig ..
	ReqPublishConfig struct {
		ID      uint    `json:"id"`      // 配置ID
		Version *string `json:"version"` // 版本号
	}

	// ReqHistoryConfig ..
	ReqHistoryConfig struct {
		ID   uint `json:"id"` // 配置文件ID
		Size uint `json:"size"`
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
		UserName        string    `json:"user_name"`
		ChangeLog       string    `json:"change_log"`
		ConfigurationID uint      `json:"configuration_id"`
		Version         string    `json:"version"` // 发布到Juno Proxy的版本号
		CreatedAt       time.Time `json:"created_at"`
	}

	// ReqDiffConfig ..
	ReqDiffConfig struct {
		ID uint `json:"id"`
	}

	// RespDiffConfig ..
	RespDiffConfig struct {
		Origin   *RespDetailConfig `json:"origin,omitempty"`
		Modified RespDetailConfig  `json:"modified"`
	}

	// ReqDeleteConfig ..
	ReqDeleteConfig struct {
		ID uint `json:"id"`
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
		Timestamp int64  `json:"timestamp"`
		Version   string `json:"version"`
		Format    string `json:"format"`
		Path      string `json:"path"`
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
