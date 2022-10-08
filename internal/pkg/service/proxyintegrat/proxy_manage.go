package proxyintegrat

import (
	"context"
	"errors"
	"time"

	"github.com/douyu/juno/pkg/model/view/vproxyintegrat"
)

//ProxyManageList 列表
func ProxyManageList(ctx context.Context, params *vproxyintegrat.ProxyManageListParams) (list []vproxyintegrat.ProxyManage, total int64, err error) {
	list = make([]vproxyintegrat.ProxyManage, 0, 20)
	tmpList := make([]vproxyintegrat.ProxyManage, 0)
	isValid, msg := params.Valid()
	if !isValid {
		err = errors.New(msg)
		return
	}

	// offset
	offset := (params.Current - 1) * params.PageSize
	query := mysql.Table(ProxyManageTable).Where("delete_time = ?", 0)
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
		if item.SubPath == "" || item.Title == "" || item.ProxyAddr == "" {
			continue
		}
		list = append(list, item)
	}
	return
}

//ProxyManageCreateOrUpdate 创建
func ProxyManageCreateOrUpdate(ctx context.Context, params *vproxyintegrat.ProxyManageCreateOrUpdateParams) (err error) {
	now := time.Now()
	count := int64(0)
	err = mysql.Table(ProxyManageTable).Where(" delete_time = ? and id!= ? and `sub_path` = ? ", 0, params.ID, params.SubPath).Count(&count).Error
	if err != nil {
		return
	}
	if count > 0 {
		err = errors.New("功能标识key不唯一")
		return
	}
	if params.ID == 0 {
		err = mysql.Table(ProxyManageTable).Create(&vproxyintegrat.ProxyManage{
			SubPath:    params.SubPath,
			IsRewrite:  params.IsRewrite,
			ProxyAddr:  params.ProxyAddr,
			Title:      params.Title,
			CreateTime: now.Unix(),
			UpdateTime: now.Unix(),
			Uid:        int(params.UID),
		}).Error
		return
	}
	err = mysql.Table(ProxyManageTable).Where("id = ?", params.ID).Updates(map[string]interface{}{
		"title":       params.Title,
		"proxy_addr":  params.ProxyAddr,
		"is_rewrite":  params.IsRewrite,
		"sub_path":    params.SubPath,
		"update_time": now.Unix(),
		"uid":         params.UID,
	}).Error
	return
}

//ProxyManageDelete 删除
func ProxyManageDelete(ctx context.Context, params *vproxyintegrat.ProxyManageDeleteParams) (err error) {
	now := time.Now()
	err = mysql.Table(ProxyManageTable).Where("id = ?", params.ID).Updates(map[string]interface{}{
		"delete_time": now.Unix(),
		"uid":         params.UID,
	}).Error
	return
}
