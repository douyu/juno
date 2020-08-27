package localworker

import (
	"sync"
	"time"

	"github.com/beeker1121/goque"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/xlog"
)

type (
	localWorker struct {
		option Option
		queue  *goque.Queue
	}

	Option struct {
		WorkerQueueDir string
	}
)

var (
	instance *localWorker
	initOnce sync.Once
)

func Instance() *localWorker {
	initOnce.Do(func() {
		instance = &localWorker{}
	})

	return instance
}

func (w *localWorker) Init(o Option) {
	w.option = o

	queue, err := goque.OpenQueue(o.WorkerQueueDir)
	if err != nil {
		xlog.Panicf("init local worker queue failed")
	}
	w.queue = queue

	go w.start()
}

func (w *localWorker) Push(task db.TestPipelineTask) (err error) {
	_, err = w.queue.EnqueueObjectAsJSON(task)
	return err
}

func (w *localWorker) start() {
	for {
		var task db.TestPipelineTask
		taskItem, err := w.queue.Dequeue()
		if err != nil {
			if err != goque.ErrEmpty {
				xlog.Errorf("dequeue failed", xlog.String("err", err.Error()))
			}
			time.Sleep(3 * time.Second)
			continue
		}

		err = taskItem.ToObjectFromJSON(&task)
		if err != nil {
			xlog.Errorf("unmarshall task item failed", xlog.String("err", err.Error()))
			continue
		}
	}
}
