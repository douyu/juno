package taskplatform

import (
	"fmt"

	"github.com/douyu/juno/internal/pkg/service/taskplatform/cronjob"
	"github.com/jinzhu/gorm"
)

var (
	Job *cronjob.Job
)

type (
	Option struct {
		DB *gorm.DB
	}
)

func Init(o Option) {
	// init id creator
	if err := initID(); err != nil {
		panic(fmt.Sprintf("Init UUID Generator failed: %s", err))
	}

	Job = cronjob.New(o.DB)
}
