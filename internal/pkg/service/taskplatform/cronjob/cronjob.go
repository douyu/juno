package cronjob

import "github.com/douyu/juno/pkg/model/view"

type Job struct {
}

// List ..
func (j *Job) List(appName, env, zoneCode string) (err error) {
	// TODO 从ETCD获取任务列表
	return
}

// Update ..
func (j *Job) Update(newJob view.TaskPlatformJob) (err error) {
	// TODO 删除历史job，添加新的job
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
