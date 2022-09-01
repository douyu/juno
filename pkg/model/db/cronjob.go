package db

import (
	"time"

	"github.com/douyu/jupiter/pkg/store/gorm"
)

type (
	CronJob struct {
		gorm.Model
		Name          string      `gorm:"column:name"`
		Uid           uint        `gorm:"column:uid"`
		AppName       string      `gorm:"column:app_name"`
		Env           string      `gorm:"column:env"`
		Zone          string      `gorm:"column:zone"`
		Timeout       uint        `gorm:"column:timeout"`
		RetryCount    uint        `gorm:"column:retry_count"`
		RetryInterval uint        `gorm:"column:retry_interval"`
		Script        string      `gorm:"column:script"`
		Enable        bool        `gorm:"column:enable"`
		Nodes         StringArray `gorm:"type:json"`
		JobType       CronJobType

		User       User           `gorm:"foreignKey:Uid;association_foreignkey:Uid"`
		Timers     []CronJobTimer `gorm:"foreignKey:JobID"`
		LatestTask *CronTask      `gorm:"foreignKey:JobID"`
	}

	CronJobTimer struct {
		gorm.Model
		JobID uint   `gorm:"column:job_id"`
		Cron  string `gorm:"column:cron"` // crontab-like DSL

		Job CronJob `gorm:"foreignKey:JobID"`
	}

	CronTask struct {
		ID          uint64         `gorm:"column:id;primary_key"`
		JobID       uint           `gorm:"column:job_id;index"`
		Node        string         `gorm:"column:node"`
		Env         string         `gorm:"column:env"`
		Zone        string         `gorm:"column:zone"`
		Status      CronTaskStatus `gorm:"column:status"`
		Timeout     uint           `gorm:"column:timeout"`
		ExecutedAt  *time.Time     `gorm:"column:executed_at"`
		FinishedAt  *time.Time     `gorm:"column:finished_at"`
		RetryCount  uint           `gorm:"column:retry_count"`
		Log         string         `gorm:"column:log;type:longtext"`
		Script      string         `gorm:"column:script"`
		ExecuteType int            `gorm:"execute_type"` // 0: 定时执行 1: 手动触发
		CreatedAt   time.Time
		UpdatedAt   time.Time
		DeletedAt   *time.Time `sql:"index"`

		Job CronJob `gorm:"foreignKey:JobID"`
	}

	CronTaskStatus string
	CronJobType    int
)

const (
	CronTaskStatusWaiting    CronTaskStatus = "waiting"
	CronTaskStatusProcessing CronTaskStatus = "processing"
	CronTaskStatusSuccess    CronTaskStatus = "success"
	CronTaskStatusFailed     CronTaskStatus = "failed"
	CronTaskStatusTimeout    CronTaskStatus = "timeout"

	CronJobTypeNormal CronJobType = 0
	CronJobTypeSingle CronJobType = 1

	ExecuteTypeAuto   = 0 // 定时任务自动执行
	ExecuteTypeManual = 1 // 手动触发
)
