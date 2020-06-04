package resource

import (
	"encoding/json"
	"errors"
	"strings"
	"time"

	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/juno/pkg/service/appevent"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/store/gorm"
)

// 根据ID或者HOSTNAME获取Node信息
// 只支持int和string查询
func (r *resource) GetNode(tx *gorm.DB, identify interface{}) (resp db.Node, err error) {
	switch v := identify.(type) {
	case string:
		err = tx.Where("host_name = ?", v).Find(&resp).Error
	case int:
		err = tx.Where("id=?", v).Find(&resp).Error
	default:
		err = errors.New("identify type error")
	}
	return
}

func (r *resource) GetNodeList(where db.Node, currentPage, pageSize int, keyType, keyWords string, sort string) (resp []db.Node, page *view.Pagination, err error) {
	page = view.NewPagination(currentPage, pageSize)
	sql := r.DB.Model(db.Node{}).Where(where)
	keyWords = strings.TrimSpace(keyWords)
	switch keyType {
	case "ip":
		if len(keyWords) > 0 {
			sql = sql.Where("`ip` like ?", "%"+keyWords+"%")
		}
	case "host_name":
		if len(keyWords) > 0 {
			sql = sql.Where("`host_name` like ?", "%"+keyWords+"%")
		}
	}
	sql.Count(&page.Total)
	err = sql.Order(sort).Offset((page.Current - 1) * page.PageSize).Limit(page.PageSize).Find(&resp).Error
	return
}

func (r *resource) GetAllNode() (resp []db.Node, err error) {
	err = r.DB.Model(db.Node{}).Find(&resp).Error
	return
}

func (r *resource) NodeDayCnt(start, end int64) (resp []db.NodeCnt, err error) {
	err = r.DB.Table("node").Select("DATE_FORMAT(FROM_UNIXTIME(create_time), '%Y-%m-%d') as day_time, count(id) as cnt").
		Where("create_time between ? and ?", start, end).Group("day_time").Find(&resp).Error
	return
}

func (r *resource) PutNode(tx *gorm.DB, info db.Node) (err error) {
	err = tx.Where("host_name = ?", info.HostName).Find(&info).Error
	// 返回系统错误
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return
	}
	// 已经存在该应用不在更新
	if info.Id > 0 {
		err = nil
		return
	}
	info.CreateTime = time.Now().Unix()
	info.UpdateTime = time.Now().Unix()
	err = tx.Create(&info).Error
	meta, _ := json.Marshal(info)
	appevent.AppEvent.NodeCreateEvent(info.ZoneCode, info.Env, info.HostName, string(meta), nil)

	return
}

// 设置APP信息
func (r *resource) CreateNode(tx *gorm.DB, item db.Node, user *db.User) (err error) {
	var info db.Node
	err = tx.Where("host_name = ?", item.HostName).Find(&info).Error
	// 返回系统错误
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return
	}
	// 已经存在该应用，报错
	if info.Id > 0 {
		err = errors.New("node host name is exist")
		return
	}

	item.CreateTime = time.Now().Unix()
	item.UpdateTime = time.Now().Unix()

	err = tx.Create(&item).Error
	meta, _ := json.Marshal(item)
	appevent.AppEvent.NodeCreateEvent(info.ZoneCode, info.Env, info.HostName, string(meta), nil)
	return
}

func (r *resource) UpdateNode(item db.Node, user *db.User) (err error) {
	var info db.Node
	err = r.DB.Where("id = ?", item.Id).Find(&info).Error
	// 返回系统错误
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return
	}
	// 已经存在该应用，报错
	if info.Id == 0 {
		err = errors.New("node is not exist")
		return
	}
	item.UpdateTime = time.Now().Unix()
	err = r.DB.Model(db.Node{}).Where("id = ?", item.Id).UpdateColumns(&item).Error

	meta, _ := json.Marshal(item)
	appevent.AppEvent.NodeUpdateEvent(info.ZoneCode, info.Env, info.HostName, string(meta), nil)
	return
}

func (r *resource) DeleteNode(item db.Node, user *db.User) (err error) {
	var info db.Node
	err = r.DB.Where("id = ?", item.Id).Find(&info).Error
	// 返回系统错误
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return
	}
	// 已经存在该应用，报错
	if info.Id == 0 {
		err = errors.New("node is not exist")
		return
	}
	err = r.DB.Where("id = ?", item.Id).Delete(&db.Node{}).Error

	meta, _ := json.Marshal(item)
	appevent.AppEvent.NodeDeleteEvent(info.ZoneCode, info.Env, info.HostName, string(meta), nil)
	return
}

// 设置APP信息
func (r *resource) NodeHeartBeat(
	hostName string,
	ip string,
	agentVersion string,
	regionCode, regionName, zoneCode, zoneName, env, appName string,
	user *db.User) (err error) {
	var (
		info db.Node
	)
	err = r.DB.Where("host_name = ?", hostName).Find(&info).Error
	// 返回系统错误
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return
	}

	nodeInfo := db.Node{
		HostName:      hostName,
		Ip:            ip,
		HeartbeatTime: time.Now().Unix(),
		AgentType:     1,
		AgentVersion:  agentVersion,
	}

	isPutZone := false

	// 如果不为空，就选择使用agent上报的数据，否则就使用后台数据
	if regionCode != "" && zoneCode != "" {
		nodeInfo.RegionCode = regionCode
		nodeInfo.RegionName = regionName
		nodeInfo.ZoneCode = zoneCode
		nodeInfo.ZoneName = zoneName
		nodeInfo.Env = env
		isPutZone = true
	}
	tx := r.DB.Begin()
	if isPutZone {
		err = r.PutZone(tx, db.Zone{
			Env:        env,
			RegionCode: regionCode,
			RegionName: regionName,
			ZoneCode:   zoneCode,
			ZoneName:   zoneName,
			CreateTime: time.Now().Unix(),
			UpdateTime: time.Now().Unix(),
		})
		if err != nil {
			tx.Rollback()
			return
		}
	}

	// 如果存在就更新
	if info.Id > 0 {
		err = tx.Model(nodeInfo).Where("host_name = ?", hostName).UpdateColumns(&nodeInfo).Error
		if err != nil {
			tx.Rollback()
			return
		}
	} else {
		nodeInfo.CreateTime = time.Now().Unix()
		nodeInfo.UpdateTime = time.Now().Unix()
		err = tx.Create(&nodeInfo).Error
		if err != nil {
			tx.Rollback()
			return
		}
	}

	// 如果存在app name，就对app和node进行关联
	if isPutZone && appName != "" {
		var appInfo db.AppInfo
		tx.Where("app_name = ?", appName).Find(&appInfo)
		var appNodeInfo db.AppNode
		tx.Where("host_name = ? and app_name =?", hostName, appName).Find(&appNodeInfo)
		if appInfo.Aid > 0 && appNodeInfo.Id == 0 {
			addMap := make(map[string]interface{}, 0)
			addMap[hostName] = hostName
			err = r.AppNodeTransferPut(tx, addMap, nil, appInfo, nil)
			if err != nil {
				tx.Rollback()
				return
			}
		}
	}

	tx.Commit()
	return
}

// 获取节点个数
func (r *resource) GetNodeCnt() (cnt int) {
	r.DB.Model(db.Node{}).Count(&cnt)
	return
}

func (r *resource) NodeTransferSource() (resp []db.Node, total int, err error) {
	sql := r.DB.Model(db.Node{})
	sql.Count(&total)
	err = sql.Order("host_name desc").Find(&resp).Error
	return
}

func (r *resource) NodeTransferTarget(zoneCode string, env string) (resp []db.Node, total int, err error) {
	sql := r.DB.Model(db.Node{}).Where("zone_code = ? and env = ?", zoneCode, env)
	sql.Count(&total)
	err = sql.Order("host_name desc").Find(&resp).Error
	return
}

func (r *resource) NodeTransferPut(add, del map[string]interface{}, zone db.Zone) (err error) {
	tx := r.DB.Begin()
	for _, nodeId := range add {
		err = tx.Model(db.Node{}).Where("id = ?", nodeId).UpdateColumns(&db.Node{
			UpdateTime: time.Now().Unix(),
			Env:        zone.Env,
			RegionCode: zone.RegionCode,
			RegionName: zone.RegionName,
			ZoneCode:   zone.ZoneCode,
			ZoneName:   zone.ZoneName,
		}).Error
		if err != nil {
			tx.Rollback()
			return
		}
	}

	for _, nodeId := range del {
		err = tx.Model(db.Node{}).Where("id = ?", nodeId).UpdateColumns(&db.Node{
			UpdateTime: time.Now().Unix(),
			Env:        " ",
			RegionCode: " ",
			RegionName: " ",
			ZoneCode:   " ",
			ZoneName:   " ",
		}).Error
		if err != nil {
			tx.Rollback()
			return
		}
	}
	tx.Commit()
	return
}
