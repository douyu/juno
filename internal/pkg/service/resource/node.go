package resource

import (
	"encoding/json"
	"errors"
	"strings"
	"time"

	"github.com/douyu/juno/internal/pkg/service/appevent"
	"github.com/douyu/juno/pkg/model/view"
	"go.uber.org/zap"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/store/gorm"
	"github.com/douyu/jupiter/pkg/xlog"
)

// 根据ID或者HOSTNAME获取Node信息
// 只支持int和string查询
func (r *resource) GetNode(tx *gorm.DB, identify interface{}) (resp db.Node, err error) {
	switch v := identify.(type) {
	case string:
		err = tx.Where("host_name = ?", v).Find(&resp).Error
	case int, uint:
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
	err = tx.Where("host_name = ?", info.HostName).First(&info).Error
	// 返回系统错误
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		xlog.Error("PutNode db.Node error", zap.Error(err), zap.String("host_name", info.HostName))
		return
	}
	// 已经存在该应用不在更新
	if info.Id > 0 {
		err = nil
		xlog.Warn("PutNode Node表中已经存在该应用", zap.String("host_name", info.HostName))
		return
	}
	info.CreateTime = time.Now().Unix()
	info.UpdateTime = time.Now().Unix()

	_, err = json.Marshal(info)
	if err != nil {
		xlog.Error("PutNode marshal error", zap.Error(err), zap.String("host_name", info.HostName))
		return errors.New("PutNode marshal error")
	}

	err = tx.Create(&info).Error
	if err != nil {
		xlog.Error("PutNode Create error", zap.Error(err), zap.String("host_name", info.HostName))
		// return
		return errors.New("PutNode Create error")
	}
	xlog.Info("PutNode success", zap.String("host_name", info.HostName))

	meta, _ := json.Marshal(info)
	appevent.AppEvent.NodeCreateEvent(info.ZoneCode, info.Env, info.HostName, string(meta), nil)

	return
}

// 设置APP信息
func (r *resource) CreateNode(tx *gorm.DB, item db.Node, user *db.User) (err error) {
	var info db.Node
	err = tx.Where("host_name = ?", item.HostName).First(&info).Error
	// 返回系统错误
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
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
	err = r.DB.Where("id = ?", item.Id).First(&info).Error
	// 返回系统错误
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
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
	err = r.DB.Where("id = ?", item.Id).First(&info).Error
	// 返回系统错误
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
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
func (r *resource) NodeHeartBeat(reqInfo view.ReqNodeHeartBeat,
	user *db.User) (err error) {
	var (
		info db.Node
	)
	err = r.DB.Where("host_name = ?", reqInfo.Hostname).First(&info).Error
	// return system error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return
	}

	if reqInfo.AgentType != 1 && reqInfo.ProxyType != 1 {
		err = errors.New("heartbeat type error")
		return
	}

	var nodeInfo db.Node
	if reqInfo.ProxyType == 1 {
		nodeInfo = db.Node{
			HostName:           reqInfo.Hostname,
			Ip:                 reqInfo.IP,
			ProxyHeartbeatTime: time.Now().Unix(),
			ProxyType:          reqInfo.ProxyType,
			ProxyVersion:       reqInfo.ProxyVersion,
		}
	} else {
		nodeInfo = db.Node{
			HostName:           reqInfo.Hostname,
			Ip:                 reqInfo.IP,
			AgentHeartbeatTime: time.Now().Unix(),
			AgentType:          reqInfo.AgentType,
			AgentVersion:       reqInfo.AgentVersion,
		}
	}
	isPutZone := false
	// 如果不为空，就选择使用agent上报的数据，否则就使用后台数据
	if reqInfo.RegionCode != "" && reqInfo.ZoneCode != "" {
		nodeInfo.RegionCode = reqInfo.RegionCode
		nodeInfo.RegionName = reqInfo.RegionName
		nodeInfo.ZoneCode = reqInfo.ZoneCode
		nodeInfo.ZoneName = reqInfo.ZoneName
		nodeInfo.Env = reqInfo.Env
		isPutZone = true
	}
	tx := r.DB.Begin()
	if isPutZone {
		err = r.PutZone(tx, db.Zone{
			Env:        reqInfo.Env,
			RegionCode: reqInfo.RegionCode,
			RegionName: reqInfo.RegionName,
			ZoneCode:   reqInfo.ZoneCode,
			ZoneName:   reqInfo.ZoneName,
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
		err = tx.Model(nodeInfo).Where("host_name = ?", reqInfo.Hostname).UpdateColumns(&nodeInfo).Error
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
	if isPutZone && reqInfo.AppName != "" {
		var appInfo db.AppInfo
		tx.Where("app_name = ?", reqInfo.AppName).Find(&appInfo)
		var appNodeInfo db.AppNode
		// agent can update app info, proxy can't update app info
		tx.Where("host_name = ? and app_name =? ", reqInfo.Hostname, reqInfo.AppName).Find(&appNodeInfo)
		if appInfo.Aid > 0 && appNodeInfo.ID == 0 {
			addMap := make(map[string]interface{}, 0)
			addMap[reqInfo.Hostname] = reqInfo.Hostname
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
func (r *resource) GetNodeCnt() (cnt int64) {
	r.DB.Model(db.Node{}).Count(&cnt)
	return
}

func (r *resource) NodeTransferSource() (resp []db.Node, total int64, err error) {
	sql := r.DB.Model(db.Node{})
	sql.Count(&total)
	err = sql.Order("host_name desc").Find(&resp).Error
	return
}

func (r *resource) NodeTransferTarget(zoneCode string, env string) (resp []db.Node, total int64, err error) {
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

	err = tx.Model(db.Zone{}).Where("id = ?", zone.Id).UpdateColumns(&db.Node{
		UpdateTime: time.Now().Unix(),
	}).Error
	if err != nil {
		tx.Rollback()
		return
	}
	tx.Commit()
	return
}
