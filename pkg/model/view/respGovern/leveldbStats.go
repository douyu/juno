package respGovern

import "github.com/syndtr/goleveldb/leveldb"

// levelDB 状态信息
type LeveldbStats struct {
	RuntimeStats
	Leveldbs map[string]OneLeveldb `json:"leveldbs"`
}

type OneLeveldb struct {
	// Status string
	Err   string          `json:"err"`
	Stats leveldb.DBStats `json:"stats"`
}
