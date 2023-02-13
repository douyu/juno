package confgo

import (
	"errors"
	"time"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/store/gorm"
)

func (c *confu) TplCreate(item *db.CmcTpl) (err error) {
	err = c.DB.Create(item).Error
	return
}

// 根据分页获取应用列表
func (r *confu) GetTplList(where db.CmcTpl, currentPage, pageSize int, keyType, keyWords string, sort string) (resp []db.CmcTpl, page view.Pagination, err error) {
	page.Current = currentPage
	page.PageSize = pageSize
	if pageSize == 0 {
		page.PageSize = 20
	}
	if currentPage == 0 {
		page.Current = 1
	}
	sql := r.DB.Model(db.CmcTpl{}).Where(where)
	sql.Count(&page.Total)
	err = sql.Order(sort).Offset((page.Current - 1) * page.PageSize).Limit(page.PageSize).Find(&resp).Error
	return
}

func (r *confu) GetTpl(v int) (resp db.CmcTpl, err error) {
	err = r.DB.Where("id = ?", v).First(&resp).Error
	return
}

func (r *confu) UpdateTpl(item db.CmcTpl, user *db.User) (err error) {
	var info db.CmcTpl
	err = r.DB.Where("id = ?", item.Id).First(&info).Error
	// 返回系统错误
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return
	}
	// 已经存在该应用，报错
	if info.Id == 0 {
		err = errors.New("tpl is not exist")
		return
	}
	item.UpdateTime = time.Now().Unix()
	err = r.DB.Model(db.CmcTpl{}).Where("id = ?", item.Id).UpdateColumns(&item).Error
	return
}

func (r *confu) DeleteTpl(id int, user *db.User) (err error) {
	var info db.CmcTpl
	err = r.DB.Where("id = ?", id).First(&info).Error
	// 返回系统错误
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return
	}
	// 已经存在该应用，报错
	if info.Id == 0 {
		err = errors.New("tpl is not exist")
		return
	}
	err = r.DB.Where("id = ?", id).Delete(&db.CmcTpl{}).Error
	return
}
