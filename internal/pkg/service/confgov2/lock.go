package confgov2

import (
	"fmt"
	"time"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/pkg/errors"
)

const (
	ExpiredLockTime = 6
)

func TryLock(uid, configId uint) (err error) {
	var config db.Configuration

	tx := mysql.Begin()
	{
		err = tx.Where("id = ?", configId).First(&config).Error
		if err != nil {
			tx.Rollback()
			return fmt.Errorf("配置不存在")
		}

		if config.LockUid != 0 && config.LockUid != uid {
			tx.Rollback()
			return fmt.Errorf("当前有其他客户端正在编辑,获取编辑锁失败")
		}

		config.LockUid = uid
		now := time.Now()
		config.LockAt = &now
		err = tx.Save(&config).Error
		if err != nil {
			tx.Rollback()
			return errors.Wrap(err, "获取编辑锁失败")
		}
	}
	return tx.Commit().Error
}

func Unlock(uid, configId uint) (err error) {
	var config db.Configuration

	tx := mysql.Begin()
	{
		err = tx.Where("id = ?", configId).First(&config).Error
		if err != nil {
			tx.Rollback()
			return fmt.Errorf("配置不存在")
		}

		if config.LockUid != 0 && config.LockUid != uid {
			tx.Rollback()
			return fmt.Errorf("当前有其他客户端正在编辑,释放编辑锁失败")
		}

		config.LockUid = 0
		config.LockAt = nil
		err = tx.Save(&config).Error
		if err != nil {
			tx.Rollback()
			return errors.Wrap(err, "释放编辑锁失败")
		}
	}
	return tx.Commit().Error
}

//clearLockPeriodically 定期清除编辑锁
func clearLockPeriodically() {
	var configs []db.Configuration

	for {
		time.Sleep(ExpiredLockTime / 2 * time.Second)

		offsetTime := time.Now().Add(-ExpiredLockTime * time.Second)
		tx := mysql.Begin()
		{
			err := tx.Where("lock_at is not null and lock_at < ?", offsetTime).Find(&configs).Error
			if err != nil {
				xlog.Error("clearLockPeriodically", xlog.String("err", err.Error()))
				tx.Rollback()
				continue
			}

			for _, config := range configs {
				config.LockAt = nil
				config.LockUid = 0
				tx.Save(&config)
			}
		}
		tx.Commit()
	}
}
