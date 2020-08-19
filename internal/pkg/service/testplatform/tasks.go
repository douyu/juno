package testplatform

import (
	"time"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/xlog"
)

func startClearTimeoutTask() {
	go func() {
		for {
			err := clearTimeoutTask()
			if err != nil {
				xlog.Error("clearTimeoutTask failed", xlog.String("err", err.Error()))
			}

			time.Sleep(30 * time.Second)
		}
	}()
}

func clearTimeoutTask() (err error) {
	tasks := make([]db.TestPipelineTask, 0)
	timeOffset := time.Now().Add(-30 * time.Minute)

	tx := option.DB.Begin()

	err = tx.Preload("StepStatus").Where("status = ?", db.TestTaskStatusRunning).
		Where("updated_at < ?", timeOffset).Find(&tasks).Error
	if err != nil {
		tx.Rollback()
		return
	}

	for _, task := range tasks {
		task.Status = db.TestTaskStatusFailed
		task.Logs += "error: timeout"

		for _, status := range task.StepStatus {
			status.Status = db.TestStepStatusFailed
			status.Logs += "error: timeout"
			err = tx.Save(&status).Error
			if err != nil {
				tx.Rollback()
				return
			}
		}

		err = tx.Save(&task).Error
		if err != nil {
			tx.Rollback()
			return
		}
	}

	tx.Commit()
	return
}
