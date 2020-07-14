package db

import "github.com/jinzhu/gorm"

type (
	CasbinGroupType string

	CasbinPolicyGroup struct {
		gorm.Model
		GroupName string `gorm:"type:varchar(30);not null;" json:"group_name"`

		Uid     int    `gorm:"not null;index;"json:"uid"`
		AppName string `gorm:"type:varchar(255);not null;"json:"app_name"`
		AppEnv  string `gorm:"type:varchar(30);not null";json:"app_env"`
		URL     string `gorm:"type:varchar(255);not null;" json:"url"`

		Type string `gorm:"not null;"json:"type"`
	}
)

var (
	CasbinGroupTypeUser = "user"
	CasbinGroupTypeApp  = "app"
	CasbinGroupTypeMenu = "url"
)

func (c CasbinPolicyGroup) TableName() string {
	return "casbin_policy_group"
}
