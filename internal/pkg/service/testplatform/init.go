package testplatform

import (
	"time"

	"github.com/douyu/juno/internal/pkg/service/testplatform/localworker"
	"github.com/douyu/juno/internal/pkg/service/testplatform/workerpool"
	"github.com/jinzhu/gorm"
)

type (
	Option struct {
		Enable         bool
		DB             *gorm.DB
		GitAccessToken string
		Worker         struct {
			HeartbeatTimeout time.Duration
			LocalQueueDir    string
		}
	}
)

var (
	option Option
)

func Init(o Option) {
	option = o

	workerpool.Instance().Init(workerpool.Option{
		DB:               o.DB,
		HeartbeatTimeout: o.Worker.HeartbeatTimeout,
	})

	if o.Enable {
		localworker.Instance().Init(localworker.Option{
			WorkerQueueDir: o.Worker.LocalQueueDir,
		})
	}

	startClearTimeoutTask()
}
