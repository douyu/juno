package respGovern

import (
	"time"
)

// Rocketmq 状态信息
type RocketmqStats struct {
	RuntimeStats
	Redixs map[string]OneRocketmq `json:"rocketmqs"`
}

type OneRocketmq struct {
	Config RMConfig `json:"config"`
}

// Config config...
type RMConfig struct {
	Addresses []string        `json:"addr" toml:"addr"`
	Consumer  *ConsumerConfig `json:"consumer" toml:"consumer"`
	Producer  *ProducerConfig `json:"producer" toml:"producer"`
}

// ConsumerConfig consumer config
type ConsumerConfig struct {
	Enable          bool          `json:"enable" toml:"enable"`
	Addr            []string      `json:"addr" toml:"addr"`
	Topic           string        `json:"topic" toml:"topic"`
	Group           string        `json:"group" toml:"group"`
	DialTimeout     time.Duration `json:"dialTimeout" toml:"dialTimeout"`
	RwTimeout       time.Duration `json:"rwTimeout" toml:"rwTimeout"`
	SubExpression   string        `json:"subExpression" toml:"subExpression"`
	Rate            float64       `json:"rate" toml:"rate"`
	Capacity        int64         `json:"capacity" toml:"capacity"`
	WaitMaxDuration time.Duration `json:"waitMaxDuration" toml:"waitMaxDuration"`
}

// ProducerConfig producer config
type ProducerConfig struct {
	Addr        []string      `json:"addr" toml:"addr"`
	Topic       string        `json:"topic" toml:"topic"`
	Group       string        `json:"group" toml:"group"`
	Retry       int           `json:"retry" toml:"retry"`
	DialTimeout time.Duration `json:"dialTimeout" toml:"dialTimeout"`
	RwTimeout   time.Duration `json:"rwTimeout" toml:"rwTimeout"`
}
