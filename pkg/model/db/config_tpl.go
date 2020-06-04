package db

type CmcTpl struct {
	Id         int    `gorm:"not null;primary_key;AUTO_INCREMENT"json:"id"`
	TplType    string `gorm:"not null;"json:"tpl_type";query:"tpl_type"`
	Content    string `gorm:"not null;type:longtext"json:"content"`
	CreateTime int64  `gorm:"not null;"json:"create_time"`
	UpdateTime int64  `gorm:"not null;"json:"update_time"`
}

func (CmcTpl) TableName() string {
	return "cmc_tpl"
}
