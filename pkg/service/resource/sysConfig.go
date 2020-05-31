package resource

import (
	"time"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/store/gorm"
)

func (r *resource) GetSysConfig() (info []db.SystemConfig, err error) {
	info = make([]db.SystemConfig, 0)
	err = r.DB.Table("system_config").Find(&info).Error
	// 返回系统错误
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return
	}
	return info, nil
}

func (r *resource) SetSysConfig(sysType, setInt int) (err error) {
	info := db.SystemConfig{}
	tx := r.DB.Table("system_config").Begin()
	err = tx.Where("`sys_type` = ?", sysType).Find(&info).Error
	// 返回系统错误
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		tx.Rollback()
		return
	}
	// 已经存在该应用，报错
	if info.Id == 0 {
		item := db.SystemConfig{
			SysType:    sysType,
			SetInt:     setInt,
			CreateTime: time.Now().Unix(),
			UpdateTime: time.Now().Unix(),
		}
		if err = tx.Create(&item).Error; err != nil {
			tx.Rollback()
			return
		}
	} else {
		info.SetInt = setInt
		if err = tx.Where("id = ?", info.Id).Save(info).Error; err != nil {
			tx.Rollback()
			return
		}
	}
	tx.Commit()
	return
}
