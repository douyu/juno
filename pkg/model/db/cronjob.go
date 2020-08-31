package db

import (
	"time"

	"github.com/jinzhu/gorm"
)

type (
	CronJob struct {
		gorm.Model
		Name          string `gorm:"column:name"`
		Uid           uint   `gorm:"column:uid"`
		AppName       string `gorm:"column:app_name"`
		Env           string `gorm:"column:env"`
		Zone          string `gorm:"column:zone"`
		Timeout       uint   `gorm:"column:timeout"`
		RetryCount    uint   `gorm:"column:retry_count"`
		RetryInterval uint   `gorm:"column:retry_interval"`
		Script        string `gorm:"column:script"`
		Enable        bool   `gorm:"column:enable"`

		User       User           `gorm:"foreignKey:Uid;association_foreignkey:Uid"`
		Timers     []CronJobTimer `gorm:"foreignKey:JobID"`
		LatestTask *CronTask      `gorm:"foreignKey:JobID"`
	}

	CronJobTimer struct {
		gorm.Model
		JobID uint        `gorm:"column:job_id"`
		Cron  string      `gorm:"column:cron"` // crontab-like DSL
		Nodes StringArray `gorm:"type:json"`

		Job CronJob `gorm:"foreignKey:JobID"`
	}

	CronTask struct {
		gorm.Model
		JobID      uint           `gorm:"column:job_id"`
		Node       string         `gorm:"column:node"`
		Status     CronTaskStatus `gorm:"column:status"`
		ExecutedAt time.Time      `gorm:"column:executed_at"`
		FinishedAt *time.Time     `gorm:"column:finished_at"`
		RetryCount uint           `gorm:"column:retry_count"`
		Log        string         `gorm:"column:log"`
		Script     string         `gorm:"column:script"`

		Job CronJob `gorm:"foreignKey:JobID"`
	}

	CronTaskStatus string
)

var (
	CronTaskStatusProcessing CronTaskStatus = "processing"
	CronTaskStatusSuccess    CronTaskStatus = "success"
	CronTaskStatusFailed     CronTaskStatus = "failed"
)
