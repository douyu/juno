package cronjob

import (
	"context"
	"encoding/json"
	"strings"
	"time"

	"github.com/douyu/juno/internal/pkg/service/clientproxy"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/client/etcdv3"
	"github.com/douyu/jupiter/pkg/xlog"
)

type (
	Dispatcher struct {
		etcd *etcdv3.Client
	}

	Job struct {
		ID            string   `json:"id"`
		Name          string   `json:"name"`
		Script        string   `json:"script"`
		Timers        []Timer  `json:"timers"`
		Enable        bool     `json:"enable"`  // 可手工控制的状态
		Timeout       uint     `json:"timeout"` // 单位时间秒，任务执行时间超时设置，大于 0 时有效
		RetryCount    uint     `json:"retry_count"`
		RetryInterval uint     `json:"retry_interval"`
		Env           string   `json:"env"`
		Zone          string   `json:"zone"`
		Nodes         []string `json:"nodes"`

		JobType db.CronJobType `json:"job_type"`
	}

	OnceJob struct {
		TaskID uint64 `json:"task_id"`

		Job
	}

	Timer struct {
		ID   string `json:"id"`
		Cron string `json:"timer"`
	}
)

// 单次任务
func (d *Dispatcher) dispatchOnceJob(job OnceJob, hostname string) (err error) {
	etcdKey := d.keyFormat(EtcdKeyFmtOnceJob, map[string]string{
		"jobId":    job.ID,
		"hostname": hostname,
	})

	jobBytes, _ := json.Marshal(job)
	uniqZone := view.UniqZone{
		Env:  job.Env,
		Zone: job.Zone,
	}

	ctx, cancelFn := context.WithTimeout(context.Background(), time.Second)
	defer cancelFn()

	_, err = clientproxy.ClientProxy.DefaultEtcdPut(uniqZone, ctx, etcdKey, string(jobBytes))
	if err != nil {
		return
	}

	return
}

//dispatchJob 下发创建/更新任务
func (d *Dispatcher) dispatchJob(job Job) (err error) {
	etcdKey := EtcdKeyJobPrefix + job.ID
	jobBytes, _ := json.Marshal(job)

	uniqZone := view.UniqZone{
		Env:  job.Env,
		Zone: job.Zone,
	}

	ctx, cancelFn := context.WithTimeout(context.Background(), time.Second)
	defer cancelFn()
	_, err = clientproxy.ClientProxy.DefaultEtcdPut(uniqZone, ctx, etcdKey, string(jobBytes))
	if err != nil {
		xlog.Error("Dispatcher.dispatchJob write etcd failed", xlog.Any("uniqZone", uniqZone),
			xlog.String("key", etcdKey))
		return
	}

	return
}

//revokeJob 删除任务
func (d *Dispatcher) revokeJob(job Job) (err error) {
	etcdKey := EtcdKeyJobPrefix + job.ID

	uniqZone := view.UniqZone{
		Env:  job.Env,
		Zone: job.Zone,
	}

	ctx, cancelFn := context.WithTimeout(context.Background(), time.Second)
	defer cancelFn()
	_, err = clientproxy.ClientProxy.DefaultEtcd(uniqZone).Delete(ctx, etcdKey)
	if err != nil {
		xlog.Error("Dispatcher.revokeJob write etcd failed", xlog.Any("uniqZone", uniqZone), xlog.String("key", etcdKey))
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
