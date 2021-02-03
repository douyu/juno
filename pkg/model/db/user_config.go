package db

// 记录用户访问的一些基本配置
type UserConfig struct {
	Id         uint64 `gorm:"not null;primary_key;AUTO_INCREMENT" json:"id"`
	Uid        int    `gorm:"not null;comment:'用户id'" json:"uid"`
	Aid        int    `gorm:"not null;comment:'应用id'" json:"aid"`
	Content    string `gorm:"not null;column:content;type:longtext" json:"content"`
	CreateTime int64  `gorm:"not null;" json:"create_time"`
	UpdateTime int64  `gorm:"not null;" json:"update_time"`
}

// TableName ...
func (UserConfig) TableName() string {
	return "user_config"
}

type UserConfigInfo struct {
	VersionKey    string `json:"versionKey"`    // 监控的版本key
	DashboardPath string `json:"dashboardPath"` // 监控维度
}
