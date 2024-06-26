package db

import (
	"time"

	"gorm.io/gorm"
)

type SystemConfig struct {
	Name       string `gorm:"not null;column:name;type:varchar(50);primary_key" json:"name"`
	Content    string `gorm:"not null;column:content;type:longtext" json:"content"`
	CreateTime int64  `gorm:"not null;"json:"create_time"`
	UpdateTime int64  `gorm:"not null;"json:"update_time"`
}

func (SystemConfig) TableName() string {
	return "system_config"
}

func (s *SystemConfig) BeforeCreate(*gorm.DB) error {
	s.CreateTime = time.Now().Unix()
	return nil
}

func (s *SystemConfig) BeforeUpdate(*gorm.DB) error {
	s.UpdateTime = time.Now().Unix()
	return nil
}
