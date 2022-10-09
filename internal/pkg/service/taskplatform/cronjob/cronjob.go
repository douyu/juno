package cronjob

import (
	"context"
	"encoding/json"
	"strconv"
	"time"

	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/pkg/service/clientproxy"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/store/gorm"
	"github.com/douyu/jupiter/pkg/worker/xcron"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/pkg/errors"
	"github.com/robfig/cron/v3"
	clientv3 "go.etcd.io/etcd/client/v3"
	"go.uber.org/zap"
	"golang.org/x/sync/errgroup"
)

// CronJob ..
type CronJob struct {
	db         *gorm.DB
	dispatcher *Dispatcher
}

const (
	EtcdKeyJobPrefix    = "/juno/cronjob/job/"                        // Job下发
	EtcdKeyFmtOnceJob   = "/juno/cronjob/once/{{hostname}}/{{jobId}}" // 单次任务
	EtcdKeyFmtTaskLock  = "/juno/cronjob/lock/{{jobId}}//{{taskId}}"  // 执行锁
	EtcdKeyResultPrefix = "/juno/cronjob/result/"                     // 执行结果通知 /juno/cronjob/result/{{jobId}}/{{taskId}}
	EtcdKeyPrefixProc   = "/juno/cronjob/proc/"                       // 当前运行的进程
)

var (
	cronParser = cron.NewParser(cron.Second | cron.Minute | cron.Hour | cron.Dom | cron.Month | cron.Dow)
)

// New ..
func New(db *gorm.DB) *CronJob {
	ret := &CronJob{
		db:         db,
		dispatcher: &Dispatcher{},
	}

	ret.startSyncJob()

	return ret
}

// List Job 列表
func (j *CronJob) List(params view.ReqQueryJobs) (list []view.CronJobListItem, pagination core.Pagination, err error) {
	var jobs []db.CronJob

	page := params.Page
	if page == 0 {
		page = 1 // from 1 on
	}
	pageSize := params.PageSize
	if pageSize > 100 {
		pageSize = 100
	}
	offset := (page - 1) * pageSize

	query := j.db.Model(&db.CronJob{})
	if params.Enable != nil {
		query = query.Where("enable = ?", *params.Enable)
	}
	if params.Name != nil {
		query = query.Where("name like ?", "%"+*params.Name+"%")
	}
	if params.AppName != nil {
		query = query.Where("app_name = ?", *params.AppName)
	}
	if params.User != nil {
		username := "%" + *params.User + "%"
		query = query.Joins("left join user on cron_job.uid = user.uid")
		query = query.Where("user.username like ? or user.nickname like ?", username, username)
	}

	eg := errgroup.Group{}
	eg.Go(func() error {
		return query.Table("cron_job").Offset(offset).
			Preload("Timers").
			Preload("User").
			Limit(pageSize).
			Order("id desc").
			Find(&jobs).
			Error
	})

	eg.Go(func() error {
		pagination.Total = int64(page)
		return query.Count(&pagination.Total).Error
	})

	err = eg.Wait()
	if err != nil {
		return
	}

	for _, job := range jobs {
		timers := make([]view.CronJobTimer, 0)
		for _, timer := range job.Timers {
			timers = append(timers, view.CronJobTimer{
				ID:    timer.ID,
				JobID: timer.JobID,
				Cron:  timer.Cron,
			})
		}

		item := view.CronJobListItem{
			CronJob: view.CronJob{
				ID:            job.ID,
				Name:          job.Name,
				Username:      job.User.Nickname,
				AppName:       job.AppName,
				Env:           job.Env,
				Zone:          job.Zone,
				Timeout:       job.Timeout,
				RetryCount:    job.RetryCount,
				RetryInterval: job.RetryInterval,
				Script:        job.Script,
				Timers:        timers,
				Enable:        job.Enable,
				JobType:       job.JobType,
				Nodes:         job.Nodes,
			},
		}

		var lastTask db.CronTask
		err = j.db.Where("job_id = ?", item.ID).Last(&lastTask).Error
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				err = nil
			} else {
				return
			}
		} else {
			item.LastExecutedAt = lastTask.ExecutedAt
			item.Status = &lastTask.Status
		}

		list = append(list, item)
	}

	return
}

// Create 创建 Job
func (j *CronJob) Create(uid uint, params view.CronJob) (err error) {
	var timers = make([]db.CronJobTimer, len(params.Timers))
	var job = db.CronJob{
		Uid:           uid,
		Name:          params.Name,
		AppName:       params.AppName,
		Env:           params.Env,
		Zone:          params.Zone,
		Timeout:       params.Timeout,
		RetryCount:    params.RetryCount,
		RetryInterval: params.RetryInterval,
		Script:        params.Script,
		Enable:        params.Enable,
		JobType:       params.JobType,
		Nodes:         params.Nodes,
	}

	for idx, timer := range params.Timers {
		_, err := cronParser.Parse(timer.Cron)
		if err != nil {
			return errors.Wrapf(err, "parse cron failed: %s", timer.Cron)
		}

		timers[idx] = db.CronJobTimer{
			Cron: timer.Cron,
		}
	}
	job.Timers = timers

	err = j.db.Create(&job).Error
	if err != nil {
		return
	}

	err = j.dispatcher.dispatchJob(makeJob(job))
	if err != nil {
		return errors.Wrapf(err, "job-dispatching failed")
	}

	return
}

// Update ..
func (j *CronJob) Update(params view.CronJob) (err error) {
	var job db.CronJob
	var timers = make([]db.CronJobTimer, len(params.Timers))
	var oldTimers []db.CronJobTimer

	for idx, timer := range params.Timers {
		_, err := cronParser.Parse(timer.Cron)
		if err != nil {
			return errors.Wrapf(err, "parse cron failed: %s", timer.Cron)
		}

		timers[idx] = db.CronJobTimer{
			Cron: timer.Cron,
		}
	}

	//begin
	tx := j.db.Begin()
	err = tx.Where("id = ?", params.ID).First(&job).Error
	if err != nil {
		tx.Rollback()
		return errors.Wrap(err, "can not found params")
	}

	err = tx.Model(&job).Association("Timers").Find(&oldTimers)
	if err != nil {
		tx.Rollback()
		return
	}
	for _, t := range oldTimers {
		err = tx.Delete(&t).Error
		if err != nil {
			tx.Rollback()
			return
		}
	}

	err = tx.Model(&job).Association("Timers").Append(timers)
	if err != nil {
		tx.Rollback()
		return
	}

	job.Name = params.Name
	job.AppName = params.AppName
	job.Env = params.Env
	job.Zone = params.Zone
	job.Timeout = params.Timeout
	job.RetryCount = params.RetryCount
	job.RetryInterval = params.RetryInterval
	job.Script = params.Script
	job.Enable = params.Enable
	job.JobType = params.JobType
	job.Nodes = params.Nodes

	err = tx.Save(&job).Error
	if err != nil {
		tx.Rollback()
		return
	}

	//commit
	err = tx.Commit().Error
	if err != nil {
		return
	}

	if params.Enable {
		err = j.dispatcher.dispatchJob(makeJob(job))
		if err != nil {
			return errors.Wrapf(err, "job-dispatching failed")
		}
	} else {
		err = j.dispatcher.revokeJob(makeJob(job))
		if err != nil {
			return errors.Wrapf(err, "job-revoking failed")
		}
	}

	return
}

// Delete 删除 id 对应的 Job
func (j *CronJob) Delete(id uint) (err error) {
	var job db.CronJob

	tx := j.db.Begin()
	{
		err = tx.Where("id = ?", id).First(&job).Error
		if err != nil {
			tx.Rollback()
			return errors.Wrap(err, "cannot found job")
		}

		err = j.dispatcher.revokeJob(makeJob(job))
		if err != nil {
			tx.Rollback()
			return errors.Wrap(err, "revoke job failed")
		}

		err = tx.Delete(&job).Error
		if err != nil {
			tx.Rollback()
			return errors.Wrap(err, "delete failed")
		}
	}
	tx.Commit()

	return
}

// DispatchOnce 下发任务手动执行单次
func (j *CronJob) DispatchOnce(id uint, node string) (err error) {
	var job db.CronJob

	err = j.db.Where("id = ?", id).First(&job).Error
	if err != nil {
		return errors.Wrapf(err, "cannot found job")
	}

	task := db.CronTask{
		JobID:       job.ID,
		Timeout:     job.Timeout,
		Node:        node,
		Status:      db.CronTaskStatusWaiting,
		ExecuteType: db.ExecuteTypeManual,
		FinishedAt:  nil,
		Script:      job.Script,
	}

	tx := j.db.Begin()
	{
		err := tx.Save(&task).Error
		if err != nil {
			tx.Rollback()
			return err
		}

		jobPayload := makeOnceJob(job, task.ID)
		err = j.dispatcher.dispatchOnceJob(jobPayload, node)
		if err != nil {
			tx.Rollback()
			return err
		}
	}

	return tx.Commit().Error
}

// ListTask 任务列表
func (j *CronJob) ListTask(params view.ReqQueryTasks) (list []view.CronTask, pagination view.Pagination, err error) {
	var tasks []db.CronTask

	page := params.Page
	if page == 0 {
		page = 1
	}
	pageSize := params.PageSize
	if pageSize > 100 {
		pageSize = 100
	}
	offset := (page - 1) * pageSize

	query := j.db.Where("job_id = ?", params.ID)
	if len(params.ExecutedAt) == 2 {
		query = query.Where("executed_at >= ? and executed_at <= ?", params.ExecutedAt[0], params.ExecutedAt[1])
	}

	eg := errgroup.Group{}
	eg.Go(func() error {
		return query.Select([]string{"id", "job_id", "executed_at", "finished_at", "retry_count", "execute_type",
			"status", "node"}).
			Limit(pageSize).
			Offset(offset).
			Order("created_at desc").
			Find(&tasks).
			Error
	})

	eg.Go(func() error {
		pagination.Current = int(page)
		pagination.PageSize = int(pageSize)
		return query.Model(&db.CronTask{}).Count(&pagination.Total).Error
	})

	err = eg.Wait()
	if err != nil {
		return
	}

	for _, task := range tasks {
		list = append(list, view.CronTask{
			ID:          strconv.FormatUint(task.ID, 10),
			JobID:       task.JobID,
			Node:        task.Node,
			ExecutedAt:  task.ExecutedAt,
			FinishedAt:  task.FinishedAt,
			RetryCount:  task.RetryCount,
			Status:      task.Status,
			ExecuteType: task.ExecuteType,
		})
	}

	return
}

// TaskDetail Task 详情
func (j *CronJob) TaskDetail(id uint) (detail view.CronTaskDetail, err error) {
	var task db.CronTask

	err = j.db.Where("id = ?", id).First(&task).Error
	if err != nil {
		return
	}

	detail = view.CronTaskDetail{
		CronTask: view.CronTask{
			ID:         strconv.FormatUint(task.ID, 10),
			JobID:      task.JobID,
			ExecutedAt: task.ExecutedAt,
			FinishedAt: task.FinishedAt,
			RetryCount: task.RetryCount,
			Status:     task.Status,
			Node:       task.Node,
		},
		Log:    task.Log,
		Script: task.Script,
	}

	return
}

func (j *CronJob) StartWatch() {
	for _, client := range clientproxy.ClientProxy.DefaultEtcdClients() {
		watcher := ResultWatcher{
			Client: client.Conn(),
			Zone:   client.UniqueZone,
			DB:     j.db,
		}

		go watcher.Start()
	}
}

// startSyncJob sync job to etcd from mysql
func (j *CronJob) startSyncJob() {
	config := xcron.DefaultConfig()
	config.WithSeconds = true
	config.ImmediatelyRun = true
	cron := config.Build()

	// run every minute
	_, _ = cron.AddFunc("@every 15s", func() error {
		xlog.Debug("start sync job")

		//load all jobs and write jobs to etcd
		j.writeJobsToEtcd()

		//remove job not exists
		j.removeInvalidJob()

		//clear timeout task
		j.clearTasks()

		return nil
	})

	cron.Start()
}

// removeInvalidJob remove jobs that not exists in DB
func (j *CronJob) removeInvalidJob() {
	for _, client := range clientproxy.ClientProxy.DefaultEtcdClients() {
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		resp, err := client.Conn().Get(ctx, EtcdKeyJobPrefix, clientv3.WithPrefix())
		cancel()
		if err != nil {
			xlog.Error("load jobs from etcd failed", xlog.Any("uniqZone", client.UniqueZone),
				xlog.Any("etcdEndpoints", client.Conn().Endpoints()))
			continue
		}

		for _, kv := range resp.Kvs {
			job, err := GetJobFromKv(kv.Key, kv.Value)
			if err != nil {
				continue
			}

			count := int64(0)
			err = j.db.Model(&db.CronJob{}).Where("id = ? and enable = ?", job.ID, true).Count(&count).Error
			if err != nil {
				continue
			}

			if count == 0 {
				// job not exists, remove it
				err := j.dispatcher.revokeJob(*job)
				if err != nil {
					continue
				}
			}
		}
	}
}

// writeJobsToEtcd load jobs from mysql, and write them to etcd
func (j *CronJob) writeJobsToEtcd() {
	var jobs []db.CronJob
	err := j.db.Preload("Timers").Where("enable = ?", true).Find(&jobs).Error
	if err != nil {
		xlog.Error("Cronjob.removeInvalidJob: query jobs failed", xlog.String("err", err.Error()))
		return
	}

	for _, job := range jobs {
		_ = j.dispatcher.dispatchJob(makeJob(job))
	}
}

func (j *CronJob) clearTasks() {
	xlog.Info("CronJob.clearTasks: start clear tasks")

	const pageSize = 1024
	var total int64

	query := j.db.Where("status = ?", db.CronTaskStatusProcessing)

	err := query.Model(&db.CronTask{}).Count(&total).Error
	if err != nil {
		xlog.Error("CronJob.clearTasks: count failed", xlog.FieldErr(err))
		return
	}
	xlog.Info("Cronjob.clearTasks: find processing-tasks", zap.Int64("total", total))

	pages := total / pageSize
	if total%pageSize > 0 {
		pages += 1
	}

	for i := 0; i < int(pages); i++ {
		var tasks []db.CronTask
		err = query.Limit(pageSize).Select("id").Offset(i * pageSize).Find(&tasks).Error
		if err != nil {
			xlog.Error("CronJob.clearTasks: query tasks failed", xlog.FieldErr(err))
			continue
		}

		for _, taskItem := range tasks {
			j.checkTask(taskItem.ID)
		}
	}
}

func (j *CronJob) checkTask(id uint64) {
	var task db.CronTask
	tx := j.db.Begin()

	err := tx.Where("id = ?", id).First(&task).Error
	if err != nil {
		xlog.Error("CronJob.checkTask: query task failed", xlog.FieldErr(err))
		tx.Rollback()
		return
	}

	if task.ExecutedAt != nil && task.ExecutedAt.Add(time.Duration(task.Timeout)*time.Second).After(time.Now()) {
		// not expired
		tx.Rollback()
		return
	}

	uniqZone := view.UniqZone{
		Env:  task.Env,
		Zone: task.Zone,
	}
	client := clientproxy.ClientProxy.DefaultEtcd(uniqZone)
	taskId := strconv.FormatUint(task.ID, 10)
	jobId := strconv.FormatUint(uint64(task.JobID), 10)

	ctx, cancelFn := context.WithTimeout(context.Background(), time.Second)
	defer cancelFn()
	resp, err := client.Get(ctx, EtcdKeyPrefixProc+jobId+"/"+taskId+"/", clientv3.WithPrefix(),
		clientv3.WithLimit(1))
	if err != nil {
		xlog.Error("CronJob.clearTasks: read etcd failed", xlog.FieldErr(err), xlog.Any("zone", uniqZone))
	}

	if err != nil || resp.Count == 0 { // cannot find process, taskItem failed
		xlog.Error("CronJob.clearTasks: cannot get taskItem process, set it failed",
			xlog.Any("taskItem", task))

		task.Status = db.CronTaskStatusFailed
		task.Log += "\nprocess exited unexpectedly"
		tx.Save(&task)

		// clear result
		ctx, cancelFn = context.WithTimeout(context.Background(), time.Second)
		defer cancelFn()
		_, _ = client.Delete(ctx, EtcdKeyResultPrefix+jobId+"/"+taskId)
	}

	tx.Commit()
}

func makeOnceJob(job db.CronJob, taskId uint64) OnceJob {
	return OnceJob{
		TaskID: taskId,
		Job:    makeJob(job),
	}
}

func makeJob(job db.CronJob) Job {
	cronjob := Job{
		ID:            strconv.Itoa(int(job.ID)),
		Name:          job.Name,
		Script:        job.Script,
		Enable:        job.Enable,
		Timeout:       job.Timeout,
		RetryCount:    job.RetryCount,
		RetryInterval: job.RetryInterval,
		JobType:       job.JobType,
		Env:           job.Env,
		Zone:          job.Zone,
		Nodes:         job.Nodes,
	}

	for _, timer := range job.Timers {
		cronjob.Timers = append(cronjob.Timers, Timer{
			ID:   strconv.Itoa(int(timer.ID)),
			Cron: timer.Cron,
		})
	}

	return cronjob
}

func GetJobFromKv(key []byte, value []byte) (*Job, error) {
	job := &Job{}

	if err := json.Unmarshal(value, job); err != nil {
		xlog.Warn("job unmarshal err", zap.ByteString("key", key), zap.Error(err))
		return nil, err
	}

	return job, nil
}
