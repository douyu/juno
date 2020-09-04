package cronjob

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/coreos/etcd/clientv3"
	"github.com/coreos/etcd/mvcc/mvccpb"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/jinzhu/gorm"
	log "github.com/sirupsen/logrus"
)

type (
	ResultWatcher struct {
		*clientv3.Client
		DB *gorm.DB

		Zone *view.UniqZone
	}

	TaskResult struct {
		TaskID     uint64            `json:"task_id"`
		Status     db.CronTaskStatus `json:"status"`
		Job        Job               `json:"job"`
		Logs       string            `json:"logs"`
		RunOn      string            `json:"run_on"`
		ExecutedAt time.Time         `json:"executed_at"`
		FinishedAt *time.Time        `json:"finished_at"`
	}
)

func (r *ResultWatcher) Start() {
	// load all task result
	lastRevision := r.loadAllResult()

	ch := r.Watch(context.Background(), EtcdKeyResultPrefix, clientv3.WithPrefix(), clientv3.WithRev(lastRevision))

	for resp := range ch {
		for _, ev := range resp.Events {
			if ev.IsCreate() || ev.IsModify() {
				result, err := r.getTaskResultFromKV(ev.Kv)
				if err != nil {
					continue
				}

				r.updateTask(result)

				if result.Status == db.CronTaskStatusSuccess || result.Status == db.CronTaskStatusTimeout ||
					result.Status == db.CronTaskStatusFailed {
					r.deleteResult(ev.Kv.Key)
				}
			}
		}
	}
}

func (r *ResultWatcher) loadAllResult() int64 {
	resp, err := r.Get(context.Background(), EtcdKeyResultPrefix, clientv3.WithPrefix(), clientv3.WithLimit(0))
	if err != nil {
		log.Error("loadAllResult: load task result failed", xlog.String("err", err.Error()))
		return 0
	}

	for _, kv := range resp.Kvs {
		result, err := r.getTaskResultFromKV(kv)
		if err != nil {
			continue
		}

		r.updateTask(result)

		if result.Status == db.CronTaskStatusSuccess || result.Status == db.CronTaskStatusTimeout ||
			result.Status == db.CronTaskStatusFailed {
			r.deleteResult(kv.Key)
		}
	}

	return resp.Header.GetRevision()
}

func (r *ResultWatcher) getTaskResultFromKV(kv *mvccpb.KeyValue) (result TaskResult, err error) {
	result = TaskResult{}
	err = json.Unmarshal(kv.Value, &result)
	fmt.Printf("jobId = %s", result.Job.ID)
	if err != nil {
		xlog.Error("unmarshall task-result failed", xlog.String("err", err.Error()))
		return
	}

	return
}

func (r *ResultWatcher) updateTask(result TaskResult) {
	var task db.CronTask

	tx := r.DB.Begin()
	{
		err := tx.Where("id = ?", result.TaskID).Find(&task).Error
		if err != nil && err != gorm.ErrRecordNotFound {
			tx.Rollback()
			xlog.Error("ResultWatcher.updateTask: query task failed", xlog.Any("err", err.Error()))
			return
		}

		jobId, err := strconv.Atoi(result.Job.ID)
		if err != nil {
			xlog.Error("ResultWatcher.updateTask: invalid job id", xlog.Any("result", result))
		}

		task.ID = result.TaskID
		task.JobID = uint(jobId)
		task.Node = result.RunOn
		task.Status = result.Status
		task.ExecutedAt = &result.ExecutedAt
		task.RetryCount = result.Job.RetryCount
		task.Log = result.Logs
		task.Script = result.Job.Script
		task.FinishedAt = result.FinishedAt
		task.Env = result.Job.Env
		task.Zone = result.Job.Zone

		err = tx.Save(&task).Error
		if err != nil {
			tx.Rollback()
			xlog.Error("ResultWatcher.updateTask: save task failed", xlog.Any("err", err.Error()))
			return
		}
	}
	tx.Commit()
}

func (r *ResultWatcher) deleteResult(key []byte) {
	_, err := r.Delete(context.Background(), string(key))
	if err != nil {
		xlog.Error("ResultWatcher.deleteResult: delete finished task failed.", xlog.FieldErr(err))
	}
}
