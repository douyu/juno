package cronjob

import (
	"context"
	"encoding/json"
	"strconv"
	"time"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/store/gorm"
	"github.com/douyu/jupiter/pkg/xlog"
	"go.etcd.io/etcd/api/v3/mvccpb"
	clientv3 "go.etcd.io/etcd/client/v3"
)

type (
	ResultWatcher struct {
		*clientv3.Client
		DB *gorm.DB

		Zone *view.UniqZone
	}

	TaskResult struct {
		TaskID      uint64            `json:"task_id"`
		ExecuteType int               `json:"execute_type"`
		Status      db.CronTaskStatus `json:"status"`
		Job         Job               `json:"job"`
		Logs        string            `json:"logs"`
		RunOn       string            `json:"run_on"`
		ExecutedAt  time.Time         `json:"executed_at"`
		FinishedAt  *time.Time        `json:"finished_at"`
	}
)

func (r *ResultWatcher) Start() {
	// load all task result
	lastRevision := r.loadAllResult()

	for {
		xlog.Info("ResultWatcher.Start: start watch result....")
		ch := r.Watch(context.TODO(), EtcdKeyResultPrefix, clientv3.WithPrefix(), clientv3.WithRev(lastRevision))

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

		xlog.Info("ResultWatcher.Start: exit for watch chan closed")
	}
}

func (r *ResultWatcher) loadAllResult() int64 {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	resp, err := r.Get(ctx, EtcdKeyResultPrefix, clientv3.WithPrefix(), clientv3.WithLimit(0))
	if err != nil {
		xlog.Error("loadAllResult: load task result failed", xlog.String("err", err.Error()))
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
		err := tx.Where("id = ?", result.TaskID).First(&task).Error
		if err != nil && err != gorm.ErrRecordNotFound {
			tx.Rollback()
			xlog.Error("ResultWatcher.updateTask: query task failed", xlog.Any("err", err.Error()))
			return
		}

		jobId, err := strconv.Atoi(result.Job.ID)
		if err != nil {
			tx.Rollback()
			xlog.Error("ResultWatcher.updateTask: invalid job id", xlog.Any("result", result))
			return
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
		task.ExecuteType = result.ExecuteType

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
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	_, err := r.Delete(ctx, string(key))
	if err != nil {
		xlog.Error("ResultWatcher.deleteResult: delete finished task failed.", xlog.FieldErr(err))
	}
}
