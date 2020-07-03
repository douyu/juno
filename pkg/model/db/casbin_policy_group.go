package db

type CasbinPolicyGroup struct {
	Model
	Uid     int    `gorm:"not null;"json:"uid"`
	UrlId   int    `gorm:"not null;"json:"uriId"`
	AppName string `gorm:"not null;index;"json:"app_name"`
	Gid     int    `gorm:"not null;index;"json:"gid"`
	Type    int    `gorm:"not null;"json:"type"` // 1 user, 2 app ,3 url
}

func (c CasbinPolicyGroup) TableName() string {
	return "casbin_policy_group"
}
