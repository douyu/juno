package system

import (
	"errors"
	"time"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/store/gorm"
)

var System *system

type system struct {
	db      *gorm.DB
	Setting *setting
}

func InitSystem(db *gorm.DB) {
	System = &system{
		db:      db,
		Setting: newSetting(db),
	}
}

func (r *system) GetOptionInfo(where db.Option) (resp db.Option, err error) {
	err = r.db.Where(&where).Find(&resp).Error
	return
}

func (r *system) GetOptionList(where db.Option, currentPage, pageSize int, sort string) (resp []db.Option, page *view.Pagination, err error) {
	page = view.NewPagination(currentPage, pageSize)
	sql := r.db.Model(db.AppNode{}).Where(where)
	sql.Count(&page.Total)
	err = sql.Order(sort).Offset((page.Current - 1) * page.PageSize).Limit(page.PageSize).Find(&resp).Error
	return
}

// 设置APP信息
func (r *system) CreateOption(item db.Option, user *db.User) (err error) {
	var info db.Option
	err = r.db.Where("option_name = ?", item.OptionName).Find(&info).Error
	// 返回系统错误
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return
	}
	// 已经存在该应用，报错
	if info.Id > 0 {
		err = errors.New("option name is exist")
		return
	}

	item.CreateTime = time.Now().Unix()
	item.UpdateTime = time.Now().Unix()
	err = r.db.Create(&item).Error
	return
}

func (r *system) UpdateOption(item db.Option, user *db.User) (err error) {
	var info db.Option
	err = r.db.Where("id = ?", item.Id).Find(&info).Error
	// 返回系统错误
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return
	}
	// 已经存在该应用，报错
	if info.Id == 0 {
		err = errors.New("option is not exist")
		return
	}

	item.UpdateTime = time.Now().Unix()
	err = r.db.Model(db.Option{}).Where("id = ?", item.Id).UpdateColumns(&item).Error
	return
}

func (r *system) DeleteOption(item db.Option, user *db.User) (err error) {
	var info db.Option
	err = r.db.Where("id = ?", item.Id).Find(&info).Error
	// 返回系统错误
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return
	}
	// 已经存在该应用，报错
	if info.Id == 0 {
		err = errors.New("option is not exist")
		return
	}

	err = r.db.Where("id = ?", item.Id).Delete(&db.Option{}).Error
	return
}
