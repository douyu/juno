package view

import "github.com/douyu/juno/internal/pkg/model/db"

// ReqToolList ...
type ReqToolList struct {
	CurrentPage int    `json:"currentPage" form:"currentPage"`
	ShowNum     int    `json:"showNum"  form:"showNum"`
	QueryObj    string `json:"queryObj" form:"queryObj"`
}

// ReqToolDedail ...
type ReqToolDedail struct {
	Id int `json:"id" form:"id"`
}

// RespToolList ...
type RespToolList struct {
	CurrentPage int            `json:"currentPage"`
	TotalPage   int            `json:"totalPage"`
	ShowNum     int            `json:"showNum"`
	List        []*db.ToolInfo `json:"list"`
}

// RespToolDetail ...
type RespToolDetail struct {
	Id         uint64 `gorm:"primary_key"`
	Name       string
	Url        string
	PicUrl     string
	Desc       string
	CreateTime int64
}
