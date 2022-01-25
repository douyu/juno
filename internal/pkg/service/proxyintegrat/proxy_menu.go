package proxyintegrat

import (
	"context"
	"errors"
	"time"

	"github.com/douyu/juno/pkg/model/view/vproxyintegrat"
)

//ProxyMenuList 获取菜单页面
func ProxyMenuList(ctx context.Context, params *vproxyintegrat.ProxyMenuListParams) (list []vproxyintegrat.ProxyMenu, total int, err error) {
	list = make([]vproxyintegrat.ProxyMenu, 0, 20)
	tmpList := make([]vproxyintegrat.ProxyMenu, 0)
	isValid, msg := params.Valid()
	if !isValid {
		err = errors.New(msg)
		return
	}

	// offset
	offset := (params.Current - 1) * params.PageSize
	query := mysql.Table(ProxyMenuTable).Where("delete_time = ?", 0)
	if params.Query != "" {
		query = query.Where("title like ?", "%"+params.Query+"%")
	}
	//获取总数量
	query.Count(&total)
	err = query.Limit(params.PageSize).Offset(offset).Order("create_time desc,id desc").Find(&tmpList).Error
	if err != nil {
		return
	}
	if len(tmpList) == 0 {
		return
	}
	for _, item := range tmpList {
		if item.Key == "" || item.Title == "" || item.PanelType == "" || item.ProxyUrl == "" {
			continue
		}
		list = append(list, item)
	}
	return
}

//ProxyMenuCreateOrUpdate 获取菜单页面
func ProxyMenuCreateOrUpdate(ctx context.Context, params *vproxyintegrat.ProxyMenuCreateOrUpdateParams) (err error) {
	now := time.Now()
	count := 0
	err = mysql.Table(ProxyMenuTable).Where(" delete_time = ? and id!= ? and `key` = ? ", 0, params.ID, params.Key).Count(&count).Error
	if err != nil {
		return
	}
	if count > 0 {
		err = errors.New("功能标识key不唯一")
		return
	}
	if params.ID == 0 {
		err = mysql.Table(ProxyMenuTable).Create(&vproxyintegrat.ProxyMenu{
			PanelType:  params.PanelType,
			ProxyUrl:   params.ProxyURL,
			Key:        params.Key,
			Title:      params.Title,
			CreateTime: now.Unix(),
			UpdateTime: now.Unix(),
			Uid:        int(params.UID),
		}).Error
		return
	}
	err = mysql.Table(ProxyMenuTable).Where("id = ?", params.ID).Updates(map[string]interface{}{
		"key":         params.Key,
		"title":       params.Title,
		"proxy_url":   params.ProxyURL,
		"panel_type":  params.PanelType,
		"update_time": now.Unix(),
		"uid":         params.UID,
	}).Error
	return
}

//ProxyMenuDelete 删除菜单
func ProxyMenuDelete(ctx context.Context, params *vproxyintegrat.ProxyMenuDeleteParams) (err error) {
	now := time.Now()
	err = mysql.Table(ProxyMenuTable).Where("id = ?", params.ID).Updates(map[string]interface{}{
		"delete_time": now.Unix(),
		"uid":         params.UID,
	}).Error
	return
}
