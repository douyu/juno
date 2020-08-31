package cronjob

import (
	"time"

	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"golang.org/x/sync/errgroup"
)

type Job struct {
	db *gorm.DB
}

func New(db *gorm.DB) *Job {
	return &Job{
		db: db,
	}
}

// List Job 列表
func (j *Job) List(params view.ReqQueryJobs) (list []view.CronJobListItem, pagination core.Pagination, err error) {
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
		username := "%" + *params.User + "%s"
		query = query.Joins("user on cron_job.uid = user.uid and (user.username like %s or user.nickname like %s)", username, username)
	}

	eg := errgroup.Group{}
	eg.Go(func() error {
		return query.Offset(offset).
			Preload("LatestTask", func(db *gorm.DB) *gorm.DB {
				return db.Order("id desc").Limit(1)
			}).
			Preload("Timers").
			Preload("User").
			Limit(pageSize).
			Order("id desc").
			Find(&jobs).
			Error
	})

	eg.Go(func() error {
		pagination.Total = int(page)
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
				Nodes: timer.Nodes,
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
			},
		}

		if job.LatestTask != nil {
			item.LastExecutedAt = &job.LatestTask.CreatedAt
			item.Status = &job.LatestTask.Status
		}

		list = append(list, item)
	}

	return
}

//Create 创建 Job
func (j *Job) Create(uid uint, params view.CronJob) (err error) {
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
	}

	for idx, timer := range params.Timers {
		timers[idx] = db.CronJobTimer{
			Cron:  timer.Cron,
			Nodes: timer.Nodes,
		}
	}
	job.Timers = timers

	return j.db.Create(&job).Error
}

// Update ..
func (j *Job) Update(params view.CronJob) (err error) {
	var job db.CronJob
	var timers = make([]db.CronJobTimer, len(params.Timers))

	for idx, timer := range params.Timers {
		timers[idx] = db.CronJobTimer{
			Cron:  timer.Cron,
			Nodes: timer.Nodes,
		}
	}

	err = j.db.Where("id = ?", params.ID).First(&job).Error
	if err != nil {
		return errors.Wrap(err, "can not found params")
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

	// TODO: 根据 params.Enable 参数将任务撤销

	tx := j.db.Begin()
	{
		err = tx.Model(&job).Where("id = ?", params.ID).Association("Timers").Replace(&timers).Error
		if err != nil {
			tx.Rollback()
			return
		}

		err = tx.Save(&job).Error
		if err != nil {
			tx.Rollback()
			tx.Rollback()
			return
		}
	}
	tx.Commit()

	return
}

//Delete 删除 id 对应的 Job
func (j *Job) Delete(id uint) (err error) {
	var job db.CronJob

	// TODO: 将任务撤销

	err = j.db.Where("id = ?", id).First(&job).Error
	if err != nil {
		return errors.Wrapf(err, "cannot found job")
	}

	err = j.db.Delete(&job).Error
	if err != nil {
		return errors.Wrapf(err, "delete failed")
	}

	return
}

//Dispatch 下发任务
func (j *Job) Dispatch(id uint, node string) (err error) {
	var job db.CronJob

	err = j.db.Where("id = ?", id).Preload("Timers").First(&job).Error
	if err != nil {
		return errors.Wrapf(err, "cannot found job")
	}

	task := db.CronTask{
		JobID:      job.ID,
		Node:       node,
		Status:     db.CronTaskStatusProcessing,
		ExecutedAt: time.Now(),
		FinishedAt: nil,
		Script:     job.Script,
	}

	tx := j.db.Begin()
	{
		err := tx.Save(&task).Error
		if err != nil {
			tx.Rollback()
			return err
		}

		// TODO: dispatch job
	}

	return tx.Commit().Error
}

//ListTask 任务列表
func (j *Job) ListTask(params view.ReqQueryTasks) (list []view.CronTask, pagination view.Pagination, err error) {
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
		return query.Select([]string{"id", "job_id", "executed_at", "finished_at", "retry_count", "status"}).
			Limit(pageSize).
			Offset(offset).
			Order("id desc").
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
			ID:         task.ID,
			JobID:      task.JobID,
			Node:       task.Node,
			ExecutedAt: task.ExecutedAt,
			FinishedAt: task.FinishedAt,
			RetryCount: task.RetryCount,
			Status:     task.Status,
		})
	}

	return
}

//TaskDetail Task 详情
func (j *Job) TaskDetail(id uint) (detail view.CronTaskDetail, err error) {
	var task db.CronTask

	err = j.db.Where("id = ?", id).First(&task).Error
	if err != nil {
		return
	}

	detail = view.CronTaskDetail{
		CronTask: view.CronTask{
			ID:         task.ID,
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

// UpdateStatus pause or start
func (j *Job) UpdateStatus(appName string, isPause bool) (job *view.TaskPlatformJob, err error) {
	// TODO 状态更新，停止或启动任务
	return
}

// GetExecutingJob pause or start
func (j *Job) GetExecutingJob() (err error) {
	// TODO 状态更新，停止或启动任务
	return
}

// KillExecutingJob pause or start
func (j *Job) KillExecutingJob() (err error) {
	// TODO 状态更新，停止或启动任务
	return
}
