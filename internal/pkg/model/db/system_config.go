package db

type SystemConfig struct {
	Id         int    `gorm:"not null;"json:"id"`
	SysType    int    `gorm:"not null;column:sys_type" json:"sysType" `
	SetCate    string `gorm:"not null;column:set_cate" json:"setCate"`
	SetStr     string `json:"setStr" gorm:"not null;column:set_str"`
	SetInt     int    `json:"setInt" gorm:"not null;column:set_int"`
	CreateTime int64  `gorm:"not null;"json:"create_time"`
	UpdateTime int64  `gorm:"not null;"json:"update_time"`
}

func (SystemConfig) TableName() string {
	return "system_config"
}
