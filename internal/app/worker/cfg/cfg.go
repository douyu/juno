package cfg

import (
	"time"

	"github.com/douyu/jupiter/pkg/conf"
)

type (
	cfg struct {
		Juno struct {
			Address string
			Token   string
		}

		Worker struct {
			ParallelWorker   int
			RepoStorageDir   string
			TestTaskQueueDir string
		}

		Heartbeat struct {
			Debug      bool
			Addr       string
			Internal   time.Duration
			HostName   string
			RegionCode string
			RegionName string
			ZoneCode   string
			ZoneName   string
			Env        string
		}
	}
)

var (
	Cfg cfg
)

func Init() error {
	return conf.UnmarshalKey("", &Cfg)
}
