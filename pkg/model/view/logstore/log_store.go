package logstore

// log store 对象
type LogStore struct {
	Id        int    `gorm:"column:id;primary_key;AUTO_INCREMENT" json:"id"` // 主键ID
	Title     string `gorm:"column:title;NOT NULL" json:"title"`             // 展示名称
	ActiveKey string `gorm:"column:active_key;NOT NULL" json:"active_key"`   // tabkey
	AppName   string `gorm:"column:app_name;NOT NULL" json:"app_name"`       // 应用名
	Env       string `gorm:"column:env;NOT NULL" json:"env"`                 // 环境变量
	Region    string `gorm:"column:region" json:"region"`                    // 区域
	Project   string `gorm:"column:project;NOT NULL" json:"project"`         // 项目名称
	LogStore  string `gorm:"column:log_store;NOT NULL" json:"log_store"`     // 日志store
	Remark    string `gorm:"column:remark;NOT NULL" json:"remark"`           // 备注
	Ctime     int    `gorm:"column:ctime;default:0;NOT NULL" json:"ctime"`   // 创建时间
	Utime     int    `gorm:"column:utime" json:"utime"`                      // 更新时间
}

// TableName ..
func (LogStore) TableName() string {
	return "log_store"
}
