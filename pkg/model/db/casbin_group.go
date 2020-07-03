package db

// Role 角色实体
type CasbinGroup struct {
	Id         string `json:"id"` // 唯一标识
	CreateTime int64  `gorm:"not null;"json:"create_time"`
	UpdateTime int64  `gorm:"not null;"json:"update_time"`
	DeleteTime int64  `gorm:"not null;"json:"delete_time"`
	Name       string `gorm:"not null;"json:"name"`
	Sort       int    `gorm:"not null;"json:"sort"`       // 排序值
	Intro      string `gorm:"not null;"json:"intro"`      // 备注
	State      int    `gorm:"not null;"json:"state"`      // 状态(1:启用 2:禁用)
	Type       int    `gorm:"not null;"json:"type"`       // 1 user, 2 app, 3 url
	CreatedBy  string `gorm:"not null;"json:"created_by"` // 创建者
}

func (a CasbinGroup) TableName() string {
	return "casbin_group"
}
