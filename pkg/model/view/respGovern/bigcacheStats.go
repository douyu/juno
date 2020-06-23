package respGovern

import (
	"time"
)

// bigmap 状态信息
type BigcacheStats struct {
	RuntimeStats
	Bigcaches map[string]OneBigcache `json:"bigcaches"`
}

type OneBigcache struct {
	// Status string
	Config Config
	Stats  struct {
		// Hits is a number of successfully found keys
		Hits int64 `json:"hits"`
		// Misses is a number of not found keys
		Misses int64 `json:"misses"`
		// DelHits is a number of successfully deleted keys
		DelHits int64 `json:"delete_hits"`
		// DelMisses is a number of not deleted keys
		DelMisses int64 `json:"delete_misses"`
		// Collisions is a number of happened key-collisions
		Collisions int64 `json:"collisions"`
	}
}

// Config ...
type (
	// Config
	/*
		[jupiter.bigcache.demo]
			shards=1024
			lifeWindow="10s"
			cleanWindow="1m
			maxEntriesInWindow=100000
			maxEntrySize=10240 #10k
			verbose=false
			hardMaxCacheSize=1 #1MB
	*/
	Config struct {
		// Number of cache shards, value must be a power of two
		Shards int `json:"shards" toml:"shards" default:"1024"`
		// Time after which entry can be evicted
		LifeWindow time.Duration `json:"lifeWindow" toml:"lifeWindow" default:"0"`
		// Interval between removing expired entries (clean up).
		// If set to <= 0 then no action is performed. Setting to < 1 second is counterproductive — bigcache has a one second resolution.
		CleanWindow time.Duration `json:"cleanWindow" toml:"cleanWindow" default:"0"`
		// Max number of entries in life window. Used only to calculate initial size for cache shards.
		// When proper value is set then additional memory allocation does not occur.
		MaxEntriesInWindow int `json:"maxEntriesInWindow" toml:"maxEntriesInWindow" default:""`
		// Max size of entry in bytes. Used only to calculate initial size for cache shards.
		MaxEntrySize int `json:"maxEntrySize" toml:"maxEntrySize"`
		// Verbose mode prints information about new memory allocation
		Verbose bool `json:"verbose" toml:"verbose"`
		// HardMaxCacheSize is a limit for cache size in MB. Cache will not allocate more memory than this limit.
		// It can protect application from consuming all available memory on machine, therefore from running OOM Killer.
		// Default value is 0 which means unlimited size. When the limit is higher than 0 and reached then
		// the oldest entries are overridden for the new ones.
		HardMaxCacheSize int `json:"hardMaxCacheSize" toml:"hardMaxCacheSize"`
	}
)
