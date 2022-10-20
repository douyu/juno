// 配置资源相关

package db

import (
	"time"

	"gorm.io/gorm"
)

type (
	ConfigResource struct {
		ID          uint   `gorm:"column:id;primary_key;auto_increment"`
		UID         uint   `gorm:"column:uid;"`       // 创建人
		IsGlobal    bool   `gorm:"column:is_global;"` // 是否是全局资源
		Name        string `gorm:"column:name;type:varchar(50);"`
		Env         string `gorm:"column:env;type:varchar(30);"`
		ZoneCode    string `gorm:"column:zone_code;type:varchar(50);"`
		Description string `gorm:"column:description;"`
		Visible     bool   `gorm:"column:visible;"`

		Tags   []ConfigResourceTag   `gorm:"foreignKey:ConfigResourceID"`
		Zone   Zone                  `gorm:"foreignKey:zoneCode;association_foreignkey:zoneCode;association_autoupdate:false"`
		User   User                  `gorm:"foreignKey:Username;association_foreignkey:UID;association_autoupdate:false"`
		Values []ConfigResourceValue `gorm:"foreignKey:ConfigResourceID;association_autoupdate:false"`
	}

	ConfigResourceValue struct {
		ID               uint           `gorm:"column:id;primary_key;auto_increment"`
		ConfigResourceID uint           `gorm:"column:config_resource_id;"`
		Value            string         `gorm:"column:value;type:text;"`
		CreatedAt        time.Time      `gorm:"column:created_at;"`
		DeletedAt        gorm.DeletedAt `gorm:"column:deleted_at;"`
	}

	//ConfigResourceTag 资源标签
	ConfigResourceTag struct {
		ID               uint   `gorm:"column:id;primary_key;auto_increment"`
		ConfigResourceID uint   `gorm:"column:config_resource_id;"`
		Value            string `gorm:"column:value;type:varchar(30)"`
	}
)

func (ConfigResource) TableName() string {
	return "config_resource"
}

func (ConfigResourceValue) TableName() string {
	return "config_resource_value"
}

func (ConfigResourceTag) TableName() string {
	return "config_resource_tag"
}
