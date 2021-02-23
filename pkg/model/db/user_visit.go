package db

// 记录用户访问url信息表
type UserVisit struct {
	Id       uint64 `gorm:"not null;primary_key;AUTO_INCREMENT" json:"id"`
	Uid      int    `gorm:"not null;index:idx_uid;comment:'用户id'" json:"uid"`
	Aid      int    `gorm:"not null;index:idx_aid;comment:'应用id'" json:"aid"`
	AppName  string `gorm:"not null;" json:"appName"`                      // 项目id
	ZoneCode string `gorm:"not null;index:idx_zone_code" json:"zone_code"` // 环境
	Env      string `gorm:"not null;index:idx_env" json:"env"`             // 环境
	Tab      string `gorm:"not null;" json:"tab"`
	TabName  string `gorm:"-" json:"tabName"`
	Url      string `gorm:"not null;" json:"url"` // url
	Ts       int64  `gorm:"not null;index:tx;" json:"ts"`
}

// TableName ...
func (UserVisit) TableName() string {
	return "user_visit"
}
