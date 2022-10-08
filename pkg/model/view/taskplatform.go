package view

import (
	"time"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/robfig/cron/v3"
)

// task platform struct
// 需要执行的 cron cmd 命令
// 注册到 /cronsun/cmd/groupName/<id>
type (
	TaskPlatformJob struct {
		ID            string     `json:"id"`
		Name          string     `json:"name"`
		Group         string     `json:"group"`
		Command       string     `json:"cmd"`
		User          string     `json:"user"`
		Rules         []*JobRule `json:"rules"`
		Pause         bool       `json:"pause"`          // A manually controlled state
		Timeout       int64      `json:"timeout"`        // Task execution time timeout setting, valid when greater than 0
		Parallels     int64      `json:"parallels"`      // Sets how many tasks can be allowed on a single node at once
		Retry         int        `json:"retry"`          // Number of failed retries. Default is 0, no retry
		Interval      int        `json:"interval"`       // Failed task retry interval, Unit second
		Kind          int        `json:"kind"`           // Task type. 0: ordinary task, 1: single machine task
		AvgTime       int64      `json:"avg_time"`       // Average execution time, per ms
		FailNotify    bool       `json:"fail_notify"`    // Failed to send notification
		To            []string   `json:"to"`             // Send notification address
		LogExpiration int        `json:"log_expiration"` // Specify log cleanup times for tasks separately
		runOn         string     // The node at which a task is executed and used to record the Job log
		hostname      string
		ip            string
		cmd           []string
		Count         *int64 `json:"-"` // Control the number of simultaneous tasks
	}

	JobRule struct {
		ID             string   `json:"id"`
		Timer          string   `json:"timer"`
		GroupIDs       []string `json:"gids"`
		NodeIDs        []string `json:"nids"`
		ExcludeNodeIDs []string `json:"exclude_nids"`

		Schedule cron.Schedule `json:"-"`
	}

	ReqQueryJobs struct {
		AppName  *string `query:"app_name"`
		Enable   *bool   `query:"enable"`
		Name     *string `query:"name"`
		User     *string `query:"username"`
		Page     int     `query:"page"`
		PageSize int     `query:"page_size"`
	}

	ReqQueryTasks struct {
		ID         uint     `query:"id"`
		ExecutedAt []string `query:"executed_at"`
		Page       int      `query:"page"`
		PageSize   int      `query:"page_size"`
	}

	CronJob struct {
		ID            uint           `json:"id"`
		Name          string         `json:"name"`
		Username      string         `json:"username"`
		AppName       string         `json:"app_name"`
		Env           string         `json:"env"`
		Zone          string         `json:"zone"`
		Timeout       uint           `json:"timeout"`
		RetryCount    uint           `json:"retry_count"`
		RetryInterval uint           `json:"retry_interval"`
		Script        string         `json:"script"`
		Enable        bool           `json:"enable"`
		JobType       db.CronJobType `json:"job_type"`
		Timers        []CronJobTimer `json:"timers"`
		Nodes         []string       `json:"nodes"`
	}

	CronJobListItem struct {
		CronJob

		Status         *db.CronTaskStatus `json:"status"`
		LastExecutedAt *time.Time         `json:"last_executed_at"`
	}

	CronJobTimer struct {
		ID    uint   `json:"id"`
		JobID uint   `json:"job_id"`
		Cron  string `json:"cron"`
	}

	CronTask struct {
		ID          string            `json:"id"`
		JobID       uint              `json:"job_id"`
		ExecutedAt  *time.Time        `json:"executed_at"`
		FinishedAt  *time.Time        `json:"finished_at"`
		RetryCount  uint              `json:"retry_count"`
		Status      db.CronTaskStatus `json:"status"`
		Node        string            `json:"node"`
		ExecuteType int               `json:"execute_type"`
	}

	CronTaskDetail struct {
		CronTask

		Log    string `json:"log"`
		Script string `json:"script"`
	}
)
