package worker

import (
	"log"

	"github.com/douyu/jupiter/pkg/xlog"

	"github.com/douyu/juno/internal/app/worker/testworker"

	"github.com/douyu/juno/internal/app/worker/heartbeat"

	"github.com/douyu/juno/internal/app/worker/cfg"
	"github.com/douyu/jupiter"
)

type (
	Worker struct {
		jupiter.Application
	}
)

func New() *Worker {
	w := &Worker{}

	err := w.Startup(
		initLogger,
		cfg.Init,
		initWorker,
		w.serveHttp,
		heartbeat.Start,
	)
	if err != nil {
		log.Fatal(err.Error())
	}

	return w
}

func initWorker() error {
	worker := testworker.Instance()
	err := worker.Init(testworker.Option{
		JunoAddress:    cfg.Cfg.Juno.Address,
		Token:          cfg.Cfg.Juno.Token,
		ParallelWorker: cfg.Cfg.Worker.ParallelWorker,
		RepoStorageDir: cfg.Cfg.Worker.RepoStorageDir,
		QueueDir:       cfg.Cfg.Worker.TestTaskQueueDir,
	})

	return err
}

func initLogger() error {
	xlog.SetDefault(xlog.StdConfig("", "default").Build())
	return nil
}
