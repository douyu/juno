package db

import "github.com/douyu/jupiter/pkg/store/gorm"

type (
	AccessToken struct {
		gorm.Model
		Name   string `json:"name" gorm:"type:varchar(32);uniqueIndex:idx_unique_name;"`
		AppID  string `json:"app_id" gorm:"type:varchar(32);unique;"`
		Secret string `json:"secret" gorm:"type:varchar(64);"`
	}
)

func (AccessToken) TableName() string {
	return "access_token"
}
