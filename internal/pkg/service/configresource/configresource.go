package configresource

import (
	"fmt"
	"github.com/douyu/juno/internal/pkg/service/codec/util"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/jinzhu/gorm"
	"time"
)

var (
	mysql *gorm.DB
)

func Init(db *gorm.DB) {
	mysql = db
}

func List(uid int, param view.ReqListConfigResource) (resp view.RespListConfigResource, err error) {
	list := make([]db.ConfigResource, 0)

	pageSize := param.PageSize
	page := param.Page
	offset := page * pageSize

	if pageSize > 100 || pageSize <= 0 {
		err = fmt.Errorf("pageSize cannot large than 100 or less than 1")
		return
	}

	// 构造查询表达式
	query := mysql.Where("uid = ? or is_global = ?", uid, true) // 全局资源或私人资源
	if len(param.Zone) > 0 {
		query = query.Where("zone_code in (?)", param.Zone)
	}
	if len(param.Env) > 0 {
		query = query.Where("env in (?)", param.Env)
	}
	if param.Query != "" {
		query = query.Where("name like ?", "%"+param.Query+"%")
	}
	if param.Tag != "" {
		subQuery := mysql.Model(&db.ConfigResourceTag{}).Select("config_resource_id").Where("value = ?", param.Tag).SubQuery()
		query = query.Where("id in ?", subQuery)
	}

	err = query.Preload("Zone").Preload("User").Preload("Tags").
		Preload("Values", func(db *gorm.DB) *gorm.DB {
			// 按照ID逆序
			return db.Order("id desc")
		}).
		Offset(offset).Limit(pageSize).Find(&list).Error
	if err != nil {
		return
	}

	err = query.Model(&db.ConfigResource{}).Count(&resp.Pagination.Total).Error
	if err != nil {
		return
	}

	for _, item := range list {
		latestVersion := item.Values[0] // values[0]是最新版本
		tags := make([]string, 0)
		for _, t := range item.Tags {
			tags = append(tags, t.Value)
		}

		respItem := view.RespListConfigResourceItem{
			ID:            item.ID,
			Name:          item.Name,
			ZoneName:      item.Zone.ZoneName,
			ZoneCode:      item.ZoneCode,
			UID:           item.UID,
			UserName:      item.User.Username,
			IsGlobal:      item.IsGlobal,
			Env:           item.Env,
			Description:   item.Description,
			LatestVersion: latestVersion.ID,
			LastUpdate:    latestVersion.CreatedAt,
			Tags:          tags,
			Value:         latestVersion.Value,
		}

		if !item.Visible {
			respItem.Value = "******"
		}

		resp.List = append(resp.List, respItem)
	}

	resp.Pagination.PageSize = int(pageSize)
	resp.Pagination.Current = int(page)

	return
}

func Create(uid int, param view.ReqCreateConfigResource) (err error) {
	configResource := db.ConfigResource{
		Name:        param.Name,
		Env:         param.Env,
		ZoneCode:    param.Zone,
		IsGlobal:    param.IsGlobal,
		UID:         uint(uid),
		Description: param.Description,
		Visible:     param.Visible,
	}

	if len(param.Tags) > 0 {
		configResource.Tags = make([]db.ConfigResourceTag, 0)

		for _, tag := range param.Tags {
			configResource.Tags = append(configResource.Tags, db.ConfigResourceTag{
				Value: tag,
			})
		}
	}

	resourceVersion := db.ConfigResourceValue{
		CreatedAt: time.Time{},
		Value:     param.Value,
	}

	{
		tx := mysql.Begin()

		err = mysql.Save(&configResource).Error
		if err != nil {
			tx.Rollback()
			return
		}

		resourceVersion.ConfigResourceID = configResource.ID
		err = mysql.Save(&resourceVersion).Error
		if err != nil {
			tx.Rollback()
			return
		}

		err = tx.Commit().Error
		if err != nil {
			tx.Rollback()
			return
		}
	}

	return
}

func Detail(id uint) (resp view.RespDetailConfigResource, err error) {
	resource := db.ConfigResource{}
	err = mysql.Preload("User").Preload("Zone").Preload("Tags").
		Preload("Values", func(db *gorm.DB) *gorm.DB {
			// 按照ID逆序
			return db.Order("id desc")
		}).Where("id = ?", id).First(&resource).Error
	if err != nil {
		return view.RespDetailConfigResource{}, err
	}

	list := make([]db.ConfigResourceValue, 0)
	err = mysql.Where("id = ?", id).Find(&list).Error
	if err != nil {
		return
	}

	resp = view.RespDetailConfigResource{
		UserName:    resource.User.Nickname,
		Name:        resource.Name,
		Env:         resource.Env,
		ZoneName:    resource.Zone.ZoneName,
		ZoneCode:    resource.ZoneCode,
		IsGlobal:    resource.IsGlobal,
		Versions:    make([]view.ConfigResourceVersion, 0),
		Description: resource.Description,
	}

	if len(resource.Values) > 0 {
		version := resource.Values[0]
		resp.LastUpdate = version.CreatedAt
		resp.LatestVersion = version.ID
		resp.Value = version.Value

		if !resource.Visible {
			resp.Value = "******"
		}
	}

	if len(resource.Tags) > 0 {
		tags := make([]string, 0)
		for _, t := range resource.Tags {
			tags = append(tags, t.Value)
		}
		resp.Tags = tags
	}

	for _, item := range list {
		resp.Versions = append(resp.Versions, view.ConfigResourceVersion{
			Version:   item.ID,
			CreatedAt: item.CreatedAt,
		})
	}

	return
}

func GetByName(u *db.User, param view.ReqGetConfigResourceByName) (resp view.RespDetailConfigResource, err error) {
	resource := db.ConfigResource{}
	err = mysql.Preload("User").
		Preload("Values", func(db *gorm.DB) *gorm.DB {
			return db.Order("id desc")
		}).
		Preload("Tags").
		Preload("Zone").
		Where("name = ?", param.Name).
		Where("env = ?", param.Env).
		Where("zone_code = ?", param.Zone).First(&resource).Error
	if err != nil {
		err = fmt.Errorf("资源不存在")
		return
	}

	resp = view.RespDetailConfigResource{
		UserName:    resource.User.Username,
		Name:        resource.Name,
		Env:         resource.Env,
		ZoneName:    resource.Zone.ZoneName,
		ZoneCode:    resource.ZoneCode,
		IsGlobal:    resource.IsGlobal,
		Description: resource.Description,
	}

	if len(resource.Values) > 0 {
		latestVersion := resource.Values[0]
		resp.LatestVersion = latestVersion.ID
		resp.LastUpdate = latestVersion.CreatedAt
		resp.Value = latestVersion.Value

		if !resource.Visible {
			resp.Value = "******"
		}

		versions := make([]view.ConfigResourceVersion, 0)
		for _, v := range resource.Values {
			versions = append(versions, view.ConfigResourceVersion{
				Version:   v.ID,
				CreatedAt: v.CreatedAt,
			})
		}
		resp.Versions = versions
	}

	if len(resource.Tags) > 0 {
		tags := make([]string, 0)
		for _, t := range resource.Tags {
			tags = append(tags, t.Value)
		}
		resp.Tags = tags
	}

	return
}

func CreateVersion(param view.ReqCreateConfigResourceVersion) (err error) {
	resource := db.ConfigResource{}
	err = mysql.Preload("Tags").Where("id = ?", param.ID).First(&resource).Error
	if err != nil {
		return fmt.Errorf("资源不存在")
	}

	// 更新Tag
	{
		oldTags := resource.Tags
		newTags := make([]db.ConfigResourceTag, 0)
		oldTagMap := make(map[string]struct{})
		for _, t := range oldTags {
			oldTagMap[t.Value] = struct{}{}
			deleted := true
			for _, newTag := range param.Tags {
				if newTag == t.Value {
					deleted = false
					break
				}
			}

			if !deleted {
				newTags = append(newTags, t)
			}
		}

		for _, newTag := range param.Tags {
			if _, ok := oldTagMap[newTag]; !ok {
				// new tag
				newTags = append(newTags, db.ConfigResourceTag{
					ConfigResourceID: resource.ID,
					Value:            newTag,
				})
			}
		}

		resource.Description = param.Description
		err = mysql.Save(&resource).Error
		if err != nil {
			return
		}

		err = mysql.Model(&resource).Association("Tags").Replace(newTags).Error
		if err != nil {
			return
		}
	}

	version := db.ConfigResourceValue{
		ConfigResourceID: resource.ID,
		Value:            param.Value,
	}

	err = mysql.Save(&version).Error
	if err != nil {
		return
	}

	return
}

func Tags() (tags []string, err error) {
	tagList := make([]db.ConfigResourceTag, 0)
	err = mysql.Group("value").Find(&tagList).Error
	if err != nil {
		return nil, err
	}

	for _, t := range tagList {
		tags = append(tags, t.Value)
	}

	return
}

func BatchCheckVersion(param view.ReqBatchCheckResourceVersion) (resp view.RespBatchCheckResourceVersion, err error) {
	if len(param) > 1000 {
		err = fmt.Errorf("资源条数过多，请分页")
		return
	}

	for _, item := range param {
		resource := db.ConfigResource{}
		err = mysql.Preload("Values", func(db *gorm.DB) *gorm.DB {
			return db.Order("id desc")
		}).Where("zone_code = ? and env = ? and name = ?",
			item.Zone, item.Env, item.Name).First(&resource).Error
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				// 无效的资源跳过
				continue
			}

			return
		}

		respItem := view.BatchCheckResourceVersionItem{
			Name:    item.Name,
			Version: item.Version,
		}

		if len(resource.Values) > 0 {
			respItem.LatestVersion = resource.Values[0].ID
			respItem.UpdatedAt = resource.Values[0].CreatedAt
			respItem.Value = resource.Values[0].Value

			if !resource.Visible {
				respItem.Value = "******"
			}
		}

		resp = append(resp, respItem)
	}

	return
}

func GetVersionByResourceValue(value string) (version string) {
	return util.Md5Str(value)
}
