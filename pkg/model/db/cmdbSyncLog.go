package db

// 发布环境
type CmdbSyncLog struct {
	ID         int    `gorm:"primary_key" json:"id"`
	Aid        int    `json:"aid"` // 项目id
	Uid        int    `json:"uid"` // juno用户id
	Log        string `json:"log"` // 日志明细
	CreateTime int64  `json:"create_time"`
}

// TableName 表名
func (CmdbSyncLog) TableName() string {
	return "cmdb_sync_log"
}
