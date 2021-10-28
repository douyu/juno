package taskplatform

import (
	"github.com/douyu/juno/internal/pkg/service/taskplatform/cronjob"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/jinzhu/gorm"
)

var (
	Job *cronjob.CronJob
)

type (
	Option struct {
		DB *gorm.DB
	}
)

func Init(o Option) {
	if cfg.Cfg.App.Mode == "local" {
		return
	}
	Job = cronjob.New(o.DB)
	Job.StartWatch()
}
