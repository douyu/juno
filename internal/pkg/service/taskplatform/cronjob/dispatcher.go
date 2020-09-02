package cronjob

import (
	"context"
	"encoding/json"
	"strings"
	"time"

	"github.com/douyu/juno/internal/pkg/service/clientproxy"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/client/etcdv3"
)

type (
	Dispatcher struct {
		etcd *etcdv3.Client
	}

	Job struct {
		ID            string     `json:"id"`
		Name          string     `json:"name"`
		Script        string     `json:"script"`
		Timers        []Timer    `json:"timers"`
		Enable        bool       `json:"enable"`  // 可手工控制的状态
		Timeout       uint       `json:"timeout"` // 单位时间秒，任务执行时间超时设置，大于 0 时有效
		RetryCount    uint       `json:"retry_count"`
		RetryInterval uint       `json:"retry_interval"`
		Env           string     `json:"env"`
		Zone          string     `json:"zone"`
		ExecutedAt    *time.Time `json:"executed_at"`
		FinishedAt    *time.Time `json:"finished_at"`

		// 任务类型
		// 1: 普通任务，各节点均可运行
		// 2: 单机任务，同时只能单节点在线
		JobType int `json:"kind"`
	}

	OnceJob struct {
		TaskID uint64 `json:"task_id"`

		Job
	}

	Timer struct {
		ID    string   `json:"id"`
		Cron  string   `json:"timer"`
		Nodes []string `json:"nodes"` // 可运行的节点
	}
)

// 单次任务
func (d *Dispatcher) dispatchOnceJob(job OnceJob, hostname string) (err error) {
	etcdKey := d.keyFormat(EtcdKeyFmtOnceJob, map[string]string{
		"jobId":    job.ID,
		"hostname": hostname,
	})

	jobBytes, _ := json.Marshal(job)

	_, err = clientproxy.ClientProxy.RegisterEtcdPut(view.UniqZone{
		Env:  job.Env,
		Zone: job.Zone,
	}, context.Background(), etcdKey, string(jobBytes))
	if err != nil {
		return
	}

	return
}

func (d *Dispatcher) dispatchJob(job Job) (err error) {
	etcdKey := d.keyFormat(EtcdKeyFmtDispatchJob, map[string]string{
		"jobId": job.ID,
	})

	jobBytes, _ := json.Marshal(job)

	_, err = clientproxy.ClientProxy.RegisterEtcdPut(view.UniqZone{
		Env:  job.Env,
		Zone: job.Zone,
	}, context.Background(), etcdKey, string(jobBytes))
	if err != nil {
		return
	}

	return
}

// format keyFmt. For every key,val in fields, "{{key}}" in keyFmt will be replaced by val.
func (d *Dispatcher) keyFormat(keyFmt string, fields map[string]string) string {
	ret := keyFmt

	for name, val := range fields {
		ret = strings.Replace(ret, "{{"+name+"}}", val, -1)
	}

	return ret
}
