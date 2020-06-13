package db

// ToolInfo ...
type ToolInfo struct {
	Id         uint64 `gorm:"not null;primary_key;comment:'id'"`
	Name       string `gorm:"not null;comment:'工具名'"json:"name"`
	Url        string `gorm:"not null;comment:'工具地址'"json:"url"`
	PicUrl     string `gorm:"not null;comment:'图片地址'"json:"picUrl"`
	Desc       string `gorm:"not null;comment:'工具描述'"json:"desc"`
	CreateTime int64  `gorm:"not null;comment:'创建时间'"json:"createTime"`
}

// TableName ...
func (ToolInfo) TableName() string {
	return "tool"
}
