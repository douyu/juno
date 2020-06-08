package respGovern

import "database/sql"

// gorm状态信息
type GormStats struct {
	RuntimeStats
	Gorms map[string]sql.DBStats `json:"gustys"`
}
