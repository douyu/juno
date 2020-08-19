package testplatform

import (
	"github.com/douyu/juno/internal/pkg/service/testplatform/workerpool"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/jinzhu/gorm"
)

type (
	Option struct {
		DB             *gorm.DB
		GitAccessToken string
	}
)

var (
	option Option
)

func Init(o Option) {
	option = o

	workerpool.Instance().Init(workerpool.Option{
		DB:               o.DB,
		HeartbeatTimeout: cfg.Cfg.Worker.HeartbeatTimeout,
	})

	startClearTimeoutTask()
}
