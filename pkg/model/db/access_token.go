package db

import (
	"time"
)

type ModelT struct {
	ID        uint `gorm:"primary_key"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time `sql:"index"`
}

type (
	AccessToken struct {
		ModelT
		Name   string `json:"name" gorm:"type:varchar(32);uniqueIndex:idx_unique_name;"`
		AppID  string `json:"app_id" gorm:"type:varchar(32);unique;"`
		Secret string `json:"secret" gorm:"type:varchar(64);"`
	}
)

func (AccessToken) TableName() string {
	return "access_token"
}
