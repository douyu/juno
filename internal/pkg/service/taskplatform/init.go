package taskplatform

import (
	"github.com/douyu/juno/internal/pkg/service/taskplatform/cronjob"
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
	Job = cronjob.New(o.DB)
	Job.StartWatch()
}
