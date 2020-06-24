package resource

import (
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/store/gorm"
)

func (r *resource) GetSysConfig(sysType int, setCate string) (info []db.SystemConfig, err error) {
	info = make([]db.SystemConfig, 0)
	dbConn := r.DB.Table("system_config")
	if sysType > 0 {
		dbConn = dbConn.Where("`sys_type` = ?", sysType)
	}
	if setCate != "" {
		dbConn = dbConn.Where("`set_cate` = ?", setCate)
	}
	err = dbConn.Find(&info).Error
	// 返回系统错误
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return
	}
	return info, nil
}

func (r *resource) AddSysConfig(record db.SystemConfig) (err error) {
	if err := r.DB.Table("system_config").Create(&record).Error; err != nil {
		return err
	}
	return nil
}

//
//func (r *resource) EditSysConfig(record db.SystemConfig) (err error) {
//	updateMap := make(map[string]interface{})
//	updateMap["set_int"] = record.SetInt
//	updateMap["set_str"] = record.SetStr
//	updateMap["update_time"] = time.Now().Unix()
//
//	if err := r.DB.Table("system_config").Where("`id` = ?", record.Id).Update(updateMap).Error; err != nil {
//		return err
//	}
//	return nil
//}

func (r *resource) DelSysConfig(id int) (err error) {
	if err := r.DB.Table("system_config").Where("`id` = ?", id).Delete(db.SystemConfig{}).Error; err != nil {
		return err
	}
	return nil
}
