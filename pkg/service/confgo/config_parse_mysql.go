package confgo

import (
	"time"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/service/resource"
)

func (c *configApp) ParseToMysql(aid int, appName string, items []*CmcTpl) (err error) {
	// 删除该服务的全部配置
	tx := c.DB.Begin()
	err = tx.Model(db.AppTopology{}).Where("aid = ?", aid).Delete(&db.AppTopology{}).Error
	if err != nil {
		tx.Rollback()
		return
	}

	for _, value := range items {
		zoneInfo, _ := resource.Resource.GetZoneInfo(db.Zone{
			ZoneCode: value.ZoneCode,
			Env:      value.Env,
		})
		// 为了兼容grpc的逻辑
		var addr string
		if value.Port != "" {
			addr = value.Ip + ":" + value.Port
		} else {
			addr = value.Ip
		}

		info := &db.AppTopology{
			Aid:        aid,
			RegionCode: zoneInfo.RegionCode,
			ZoneCode:   value.ZoneCode,
			Env:        value.Env,
			Addr:       addr,
			Ip:         value.Ip,
			Port:       value.Port,
			Name:       value.Key,
			Type:       value.TplType,
			FileName:   value.FileName,
			Info:       "",
			UpdateTime: time.Now().Unix(),
			UpdatedBy:  0,
			Extra:      "",
			AppName:    appName,
		}
		if err := tx.Create(info).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	tx.Commit()
	return
}
