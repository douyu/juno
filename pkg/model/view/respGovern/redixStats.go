package respGovern

import (
	"github.com/gomodule/redigo/redis"
)

// redix 状态信息
type RedixStats struct {
	RuntimeStats
	Redixs map[string]OneRedix `json:"redixs"`
}

type OneRedix struct {
	Status redis.PoolStats
	Target string
	Config interface{}
}
