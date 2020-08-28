package view

import "github.com/robfig/cron/v3"

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
)

type JobRule struct {
	ID             string   `json:"id"`
	Timer          string   `json:"timer"`
	GroupIDs       []string `json:"gids"`
	NodeIDs        []string `json:"nids"`
	ExcludeNodeIDs []string `json:"exclude_nids"`

	Schedule cron.Schedule `json:"-"`
}
