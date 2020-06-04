package db

type OpsSupervisorConfig struct {
	ID           int    `gorm:"primary_key" json:"id"`
	Aid          int    // 项目ID
	AppName      string // 项目名称
	OpsAppName   string // 项目发布名称
	ZoneCode     string
	AccessKey    string // 接口公钥
	AccessSecret string // 接口私钥
	CreateTime   int64
	UpdateTime   int64
}

// TableName 表名
func (OpsSupervisorConfig) TableName() string {
	return "ops_supervisor_config"
}
