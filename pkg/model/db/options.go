package db

// Option struct .
type Option struct {
	Id          int    `gorm:"not null;primary_key;AUTO_INCREMENT"json:"optionId"`
	OptionTitle string `gorm:"not null;"json:"optionTitle"`
	OptionName  string `gorm:"not null;"json:"optionName"`
	OptionValue string `gorm:"not null;"json:"optionValue"`
	CreateTime  int64  `gorm:"not null;comment:'创建时间'" json:"create_time"`
	UpdateTime  int64  `gorm:"not null;comment:'更新时间'"json:"update_time"`
}

// TableName 获取对应数据库表名.
func (m Option) TableName() string {
	return "option"
}
