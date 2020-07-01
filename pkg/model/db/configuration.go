// 配置中心相关表

package db

import (
	"fmt"
	"time"
)

type (
	// Configuration Application configuration
	Configuration struct {
		ID          uint       `gorm:"column:id;primary_key" json:"id"`
		AID         uint       `gorm:"column:aid" json:"aid"`
		Name        string     `gorm:"column:name;type:varchar(20)" json:"name"`
		Content     string     `gorm:"column:content;type:longtext" json:"content"`
		Format      string     `gorm:"column:format;type:varchar(20)" json:"format"` // Yaml/Toml
		Env         string     `gorm:"column:env;type:varchar(20)" json:"env"`       // 环境
		Zone        string     `gorm:"column:zone;type:varchar(50)" json:"zone"`     // 机房Zone
		CreatedAt   time.Time  `gorm:"column:created_at" json:"created_at"`
		UpdatedAt   time.Time  `gorm:"column:updated_at" json:"updated_at"`
		DeletedAt   *time.Time `gorm:"column:deleted_at" json:"deleted_at"`
		PublishedAt *time.Time `gorm:"column:published_at" json:"published_at"` // 未发布/发布时间
	}

	// ConfigurationHistory Application configuration release history version
	ConfigurationHistory struct {
		ID              uint      `gorm:"column:id;primary_key" json:"id"`
		UID             uint      `gorm:"column:uid" json:"uid"` // 操作用户ID
		ConfigurationID uint      `gorm:"column:configuration_id" json:"configuration_id"`
		ChangeLog       string    `gorm:"column:change_log;type:longtext" json:"change_log"` // 变更说明文字
		Content         string    `gorm:"column:content;type:longtext" json:"content"`       // 配置内容
		Version         string    `gorm:"column:version;type:varchar(50)" json:"version"`    // 版本号
		CreatedAt       time.Time `gorm:"column:created_at" json:"created_at"`

		User          *User          `json:"-" gorm:"foreignKey:UID;association_foreignkey:Uid"`
		Configuration *Configuration `json:"-" gorm:"foreignKey:ConfigurationID;"`
	}

	// ConfigurationPublish Publish record
	ConfigurationPublish struct {
		ID                     int       `gorm:"column:id" json:"id"`
		UID                    uint      `gorm:"column:uid" json:"uid"` // 操作用户ID
		ConfigurationID        uint      `gorm:"column:configuration_id" json:"configuration_id"`
		ConfigurationHistoryID uint      `gorm:"column:configuration_history_id" json:"configuration_history_id"`
		ApplyInstance          string    `gorm:"column:apply_instance" json:"apply_instance"`
		FilePath               string    `gorm:"column:file_path" json:"file_path"`
		CreatedAt              time.Time `gorm:"column:created_at" json:"created_at"`

		User                 *User                 `json:"-" gorm:"foreignKey:UID;association_foreignkey:Uid"`
		Configuration        *Configuration        `json:"-" gorm:"foreignKey:ConfigurationID;"`
		ConfigurationHistory *ConfigurationHistory `json:"-" gorm:"foreignKey:ConfigurationHistoryID;association_foreignkey:configuration_history_id"`
	}
)

// TableName ..
func (Configuration) TableName() string {
	return "configuration"
}

// FileName ..
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
