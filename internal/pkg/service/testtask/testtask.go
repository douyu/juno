package testtask

import (
	"fmt"
	"time"

	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/store/gorm"
	"github.com/douyu/jupiter/pkg/xlog"
)

type (
	Option struct {
		DB *gorm.DB
	}

	TestTask struct {
		option Option
		c      chan view.TestTask
	}
)

var (
	instance *TestTask
)

func Init(o Option) {
	instance = &TestTask{
		option: o,
		c:      make(chan view.TestTask, 1000),
	}
}

func Instance() *TestTask {
	if instance == nil {
		xlog.Fatal("testtask.Init() MUST be called before call testtask.Instance()")
	}

	return instance
}

func (t *TestTask) C() chan view.TestTask {
	return t.c
}

func (t *TestTask) Push(task view.TestTask) (err error) {
	timer := time.NewTimer(10 * time.Second)
	select {
	case t.c <- task:
		return nil
	case <-timer.C:
		return fmt.Errorf("test platform queue blocked for 10 seconds, platform has been droped")
	}
}
