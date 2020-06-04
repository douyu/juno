package db

import (
	"database/sql/driver"
	"encoding/json"
	"time"
)

type BoardAuth struct {
	Id        int   `gorm:"not null;"json:"id"`
	Did       int   `gorm:"not null;"json:"did"`
	Uid       int   `gorm:"not null;"json:"uid"`
	CreatedAt int64 `gorm:"not null;"json:"createdAt"`
}

func (t *BoardAuth) TableName() string {
	return "board_auth"
}

// 大盘信息表 ...
type Board struct {
	Id        int        `gorm:"not null;"json:"id"`
	Name      string     `gorm:"not null;"json:"name"`
	Src       string     `gorm:"not null;"json:"src"`
	MetaData  MetaData   `gorm:"not null;type:json"json:"metaData"`
	IsEnable  bool       `gorm:"not null;"json:"isEnable"`
	IsCommon  bool       `gorm:"not null;"json:"isCommon"`
	CreatedAt int64      `gorm:"not null;"json:"createdAt"`
	UpdatedAt int64      `gorm:"not null;"json:"updatedAt"`
	DeletedAt *time.Time `gorm:"index"json:"deletedAt"`
}

func (t *Board) TableName() string {
	return "board"
}

type MetaData struct {
	Width      int `gorm:"not null;"json:"width"`
	Height     int `gorm:"not null;"json:"height"`
	MarginLeft int `gorm:"not null;"json:"marginLeft"`
	MarginTop  int `gorm:"not null;"json:"marginTop"`
}

func (c MetaData) Value() (driver.Value, error) {
	b, err := json.Marshal(c)
	return string(b), err
}

func (c *MetaData) Scan(input interface{}) error {
	return json.Unmarshal(input.([]byte), c)
}
