// 配置中心相关表

package db

import (
	"fmt"
	"time"

	"gorm.io/gorm"
)

type (
	// Configuration Application configuration
	Configuration struct {
		ID            uint           `gorm:"column:id;primary_key" json:"id"`
		AID           uint           `gorm:"column:aid" json:"aid"`
		Name          string         `gorm:"column:name;type:varchar(32)" json:"name"`
		Content       string         `gorm:"column:content;type:longtext" json:"content"`
		Format        string         `gorm:"column:format;type:varchar(20)" json:"format"` // Yaml/Toml
		Env           string         `gorm:"column:env;type:varchar(20)" json:"env"`       // 环境
		Zone          string         `gorm:"column:zone;type:varchar(50)" json:"zone"`     // 机房Zone
		Version       string         `gorm:"column:version;type:varchar(50)" json:"version"`
		CreatedAt     time.Time      `gorm:"column:created_at" json:"created_at"`
		AccessTokenID uint           `gorm:"access_token_id" json:"access_token_id"` // AccessToken 授权ID
		UID           uint           `gorm:"column:uid" json:"uid"`                  // 操作用户ID
		UpdatedAt     time.Time      `gorm:"column:updated_at" json:"updated_at"`
		DeletedAt     gorm.DeletedAt `gorm:"column:deleted_at" json:"deleted_at"`
		PublishedAt   *time.Time     `gorm:"column:published_at" json:"published_at"` // 未发布/发布时间
		LockUid       uint           `gorm:"column:lock_uid" json:"lock_uid"`         // 正在编辑用户
		LockAt        *time.Time     `gorm:"column:lock_at" json:"lock_at"`

		App AppInfo `gorm:"foreignKey:aid" json:"-"`
	}

	// ConfigurationHistory Application configuration release history version
	ConfigurationHistory struct {
		ID              uint           `gorm:"column:id;primary_key" json:"id"`
		AccessTokenID   uint           `gorm:"access_token_id" json:"access_token_id"` // AccessToken 授权ID
		UID             uint           `gorm:"column:uid" json:"uid"`                  // 操作用户ID
		ConfigurationID uint           `gorm:"column:configuration_id" json:"configuration_id"`
		ChangeLog       string         `gorm:"column:change_log;type:longtext" json:"change_log"` // 变更说明文字
		Content         string         `gorm:"column:content;type:longtext" json:"content"`       // 配置内容
		Version         string         `gorm:"column:version;type:varchar(50)" json:"version"`    // 版本号
		CreatedAt       time.Time      `gorm:"column:created_at" json:"created_at"`
		DeletedAt       gorm.DeletedAt `gorm:"column:deleted_at" json:"deleted_at"`

		User             *User                           `json:"-" gorm:"foreignKey:uid;association_foreignkey:uid"`
		AccessToken      *AccessToken                    `json:"-" gorm:"foreignKey:access_token_id;association_foreignkey:id"`
		Configuration    *Configuration                  `json:"-" gorm:"foreignKey:configuration_id;"`
		ResourceRelation []ConfigurationResourceRelation `json:"-" gorm:"association_foreignkey:configuration_history_id"`
	}

	//ConfigurationResourceRelation relate configuration and resource
	ConfigurationResourceRelation struct {
		ID                     uint       `gorm:"column:id;primary_key" json:"id"`
		CreatedAt              time.Time  `gorm:"column:created_at" json:"created_at"`
		DeletedAt              *time.Time `gorm:"column:deleted_at" json:"deleted_at"`
		ConfigurationHistoryID uint       `gorm:"column:configuration_history_id" json:"configuration_history_id"` // 配置版本ID
		ConfigResourceValueID  uint       `gorm:"column:config_resource_value_id" json:"config_resource_value_id"` // 配置资源值ID
	}

	// ConfigurationPublish Publish record
	ConfigurationPublish struct {
		ID            uint `gorm:"column:id;primary_key" json:"id"`
		UID           uint `gorm:"column:uid" json:"uid"`                  // 操作用户ID
		AccessTokenID uint `gorm:"access_token_id" json:"access_token_id"` // AccessToken 授权ID

		ConfigurationID        uint      `gorm:"column:configuration_id" json:"configuration_id"`
		ConfigurationHistoryID uint      `gorm:"column:configuration_history_id" json:"configuration_history_id"`
		ApplyInstance          string    `gorm:"column:apply_instance" json:"apply_instance"`
		FilePath               string    `gorm:"column:file_path" json:"file_path"`
		CreatedAt              time.Time `gorm:"column:created_at" json:"created_at"`

		User                 *User                 `json:"-" gorm:"foreignKey:UID;association_foreignkey:Username"`
		Configuration        *Configuration        `json:"-" gorm:"foreignKey:ConfigurationID;"`
		ConfigurationHistory *ConfigurationHistory `json:"-" gorm:"foreignKey:ConfigurationHistoryID;association_foreignkey:configuration_history_id"`
	}

	// ConfigurationStatus ..
	ConfigurationStatus struct {
		ID                     uint      `gorm:"column:id;primary_key" json:"id"`
		ConfigurationID        uint      `gorm:"column:configuration_id" json:"configuration_id"`
		ConfigurationPublishID uint      `gorm:"column:configuration_publish_id" json:"configuration_publish_id"`
		HostName               string    `gorm:"column:host_name" json:"host_name"`
		Used                   uint      `gorm:"column:used" json:"used"`               // 命令行是否使用了配置路径
		Synced                 uint      `gorm:"column:synced" json:"synced"`           // 配置下发是否成功
		TakeEffect             uint      `gorm:"column:take_effect" json:"take_effect"` // 配置是否生效
		CreatedAt              time.Time `gorm:"column:created_at" json:"created_at"`
		UpdateAt               time.Time `gorm:"column:update_at" json:"update_at"`

		ConfigurationPublish *ConfigurationPublish `json:"-" gorm:"foreignKey:ConfigurationPublishID;association_foreignkey:ID"`
	}
	// ConfigurationClusterStatus ..
	ConfigurationClusterStatus struct {
		ID                     uint      `gorm:"column:id;primary_key" json:"id"`
		ConfigurationID        uint      `gorm:"column:configuration_id" json:"configuration_id"`
		ConfigurationPublishID uint      `gorm:"column:configuration_publish_id" json:"configuration_publish_id"`
		ClusterName            string    `gorm:"column:cluster_name" json:"cluster_name"`
		Used                   uint      `gorm:"column:used" json:"used"`               // 命令行是否使用了配置路径
		Synced                 uint      `gorm:"column:synced" json:"synced"`           // 配置下发是否成功
		TakeEffect             uint      `gorm:"column:take_effect" json:"take_effect"` // 配置是否生效
		CreatedAt              time.Time `gorm:"column:created_at" json:"created_at"`
		UpdateAt               time.Time `gorm:"column:update_at" json:"update_at"`
	}
)

// TableName ..
func (Configuration) TableName() string {
	return "configuration"
}

// ProtoID ..
func (c Configuration) FileName() string {
	return fmt.Sprintf("%s.%s", c.Name, c.Format)
}

// TableName ..
func (ConfigurationHistory) TableName() string {
	return "configuration_history"
}

// TableName ..
func (ConfigurationPublish) TableName() string {
	return "configuration_publish"
}

// TableName ..
func (ConfigurationStatus) TableName() string {
	return "configuration_status"
}

// TableName ..
func (ConfigurationResourceRelation) TableName() string {
	return "configuration_resource_relation"
}

// TableName ..
func (ConfigurationClusterStatus) TableName() string {
	return "configuration_cluster_status"
}
