package resource

import (
	"errors"
	"strconv"
	"strings"
	"time"

	"github.com/douyu/juno/internal/pkg/model/view"

	"github.com/douyu/juno/internal/pkg/model/db"
	"github.com/douyu/jupiter/pkg/store/gorm"
)

func (r *resource) GetZoneInfo(where db.Zone) (resp db.Zone, err error) {
	err = r.DB.Where(&where).Find(&resp).Error
	return
}

func (r *resource) GetZoneList(where db.Zone, currentPage, pageSize int, keyType, keyWords string, sort string) (resp []db.Zone, page *view.Pagination, err error) {
	page = view.NewPagination(currentPage, pageSize)
	sql := r.DB.Model(db.Zone{}).Where(where)
	keyWords = strings.TrimSpace(keyWords)
	switch keyType {
	case "id":
		id, _ := strconv.Atoi(strings.TrimSpace(keyWords))
		if id > 0 {
			sql = sql.Where("`id` = ? ", id)
		}
	case "zone_code":
		if len(keyWords) > 0 {
			sql = sql.Where("`zone_code` like ?", "%"+keyWords+"%")
		}
	case "zone_name":
		if len(keyWords) > 0 {
			sql = sql.Where("`zone_name` like ?", "%"+keyWords+"%")
		}
	}
	err = sql.Count(&page.Total).Error
	if err != nil {
		return
	}
	if sort != "" {
		sql = sql.Order(sort)
	}
	err = sql.Offset((page.Current - 1) * page.PageSize).Limit(page.PageSize).Find(&resp).Error
	return
}

func (r *resource) PutZone(tx *gorm.DB, info db.Zone) error {
	nIDC := db.Zone{
		RegionCode: info.RegionCode,
		ZoneCode:   info.ZoneCode,
		Env:        info.Env,
	}
	if err := tx.Where(&nIDC).Assign(info).FirstOrCreate(&nIDC).Error; err != nil {
		return err
	}
	return nil
}

// 设置APP信息
func (r *resource) CreateZone(item db.Zone, user *db.User) (err error) {
	var info db.Zone
	err = r.DB.Where("zone_code = ?", item.ZoneCode).Find(&info).Error
	// 返回系统错误
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return
	}
	// 已经存在该应用，报错
	if info.Id > 0 {
		err = errors.New("app name is exist")
		return
	}

	item.CreateTime = time.Now().Unix()
	item.UpdateTime = time.Now().Unix()
	item.CreatedBy = user.Uid
	err = r.DB.Create(&item).Error
	return
}

func (r *resource) UpdateZone(item db.Zone, user *db.User) (err error) {
	var info db.Zone
	err = r.DB.Where("id = ?", item.Id).Find(&info).Error
	// 返回系统错误
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return
	}
	// 已经存在该应用，报错
	if info.Id == 0 {
		err = errors.New("zone is not exist")
		return
	}

	item.UpdateTime = time.Now().Unix()
	err = r.DB.Model(db.Zone{}).Where("id = ?", item.Id).UpdateColumns(&item).Error
	return
}

func (r *resource) DeleteZone(item db.Zone, user *db.User) (err error) {
	var info db.Zone
	err = r.DB.Where("id = ?", item.Id).Find(&info).Error
	// 返回系统错误
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return
	}
	// 已经存在该应用，报错
	if info.Id == 0 {
		err = errors.New("可用去不存在")
		return
	}
	// 该可用区有node节点
	var cnt int
	err = r.DB.Model(db.Node{}).Where("zone_code = ?", item.ZoneCode).Count(&cnt).Error
	if err != nil {
		return
	}
	if cnt > 0 {
		err = errors.New("该可用区有机器节点，请先删除机器节点")
		return
	}

	// app node有部署的节点，不予许删除
	err = r.DB.Model(db.Node{}).Where("zone_code = ?", item.ZoneCode).Count(&cnt).Error
	if err != nil {
		return
	}
	if cnt > 0 {
		err = errors.New("该可用区部署了应用，请先删除应用的部署关系")
		return
	}

	err = r.DB.Where("id = ?", item.Id).Delete(&db.Zone{}).Error
	return
}

// 获取Region个数
func (r *resource) GetRegionCnt() (cnt int) {
	r.DB.Model(db.Zone{}).Group("region_code").Count(&cnt)
	return
}

// 获取Zone个数
func (r *resource) GetZoneCnt() (cnt int) {
	r.DB.Model(db.Zone{}).Group("zone_code").Count(&cnt)
	return
}

// 获取环境个数
func (r *resource) GetEnvCnt() (cnt int) {
	r.DB.Model(db.Zone{}).Group("env").Count(&cnt)
	return
}

// 获取tree data数据，用于ant design筛选
func (r *resource) GetSelectData() (respRegion, respZone, respEnv []view.SelectData) {
	// 找到所有的Region
	var regionArr []db.Zone
	r.DB.Model(db.Zone{}).Select("region_name, region_code").
		Group("region_name, region_code").Find(&regionArr)
	respRegion = make([]view.SelectData, 0)
	for _, value := range regionArr {
		respRegion = append(respRegion, view.SelectData{
			Title: value.RegionName + "(" + value.RegionCode + ")",
			Value: value.RegionCode,
		})
	}

	var zoneArr []db.Zone
	r.DB.Model(db.Zone{}).Select("zone_code, zone_name").Group("zone_code, zone_name").Find(&zoneArr)
	respZone = make([]view.SelectData, 0)
	for _, value := range zoneArr {
		respZone = append(respZone, view.SelectData{
			Title: value.ZoneName + "(" + value.ZoneCode + ")",
			Value: value.ZoneCode,
		})
	}

	var envArr []db.Zone
	r.DB.Model(db.Zone{}).Select("env").Group("env").Find(&envArr)
	respEnv = make([]view.SelectData, 0)
	for _, value := range envArr {
		respEnv = append(respEnv, view.SelectData{
			Title: value.Env,
			Value: value.Env,
		})
	}

	return
}
