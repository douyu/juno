package resource

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"sort"
	"strconv"
	"time"

	"github.com/douyu/juno/pkg/model/view"

	"github.com/douyu/juno/pkg/util"

	"github.com/douyu/juno/internal/pkg/service/appevent"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/store/gorm"
)

func (r *resource) GetAppNodeInfo(id int) (resp db.AppNode, err error) {
	err = r.DB.Where("id = ?", id).Find(&resp).Error
	return
}

func (r *resource) GetAllAppNodeList(where db.AppNode) (resp []db.AppNode, err error) {
	err = r.DB.Where(&where).Find(&resp).Error
	return
}

func (r *resource) CountAppNode(where db.AppNode) (cnt int, err error) {
	err = r.DB.Table("app_node").Where(&where).Count(&cnt).Error
	return
}

func (r *resource) GetAppNode(where db.AppNode) (resp db.AppNode, err error) {
	err = r.DB.Where(&where).Find(&resp).Error
	return
}

func (r *resource) GetAllAppEnvZone(where db.AppNode) (resp []db.AppNode, err error) {
	err = r.DB.Where(&where).Order("create_time desc", false).Find(&resp).Error
	return
}

func (r *resource) GetAppNodeList(where db.AppNode, currentPage, pageSize int, sort string) (resp []db.AppNode, page *view.Pagination, err error) {
	page = view.NewPagination(currentPage, pageSize)
	sql := r.DB.Model(db.AppNode{}).Where(where)
	sql.Count(&page.Total)
	err = sql.Order(sort).Offset((page.Current - 1) * page.PageSize).Limit(page.PageSize).Find(&resp).Error
	return
}

// 设置应用的节点信息
// 如果不存在就会创建，如果存在就会更新
// 这里面会设置应用的节点，并且根据节点自动创建idc信息
func (r *resource) PutAppNode(identify interface{}, list []db.AppNode, user *db.User) (err error) {
	var info db.AppInfo
	info, err = r.GetApp(identify)
	if err != nil {
		return
	}

	md5Str := md5AppNodeList(list)
	data := db.AppNodeMap{
		Aid:     info.Aid,
		AppName: info.AppName,
		MD5:     md5Str,
	}
	r.DB.Where("app_name = ? AND md5 = ?", info.AppName, md5Str).First(&data)
	// 数据未改变，不做创建和更新操作
	if data.ID > 0 {
		return
	}
	//部署组被更新, 更新app_node表
	tx := r.DB.Begin()
	err = tx.Where("app_name = ?", info.AppName).Delete(&data).Error //删除现有记录
	if err != nil {
		tx.Rollback()
		return
	}
	err = tx.Create(&data).Error
	if err != nil {
		tx.Rollback()
		return
	} //新增记录
	// 填充appname和aid
	for key, value := range list {
		value.AppName = info.AppName
		value.Aid = info.Aid
		list[key] = value
	}

	err = r.UpdateNodes(info.Aid, info.AppName, list, tx, user) //批量更新服务的部署节点信息
	if err != nil {
		tx.Rollback()
		return
	}
	tx.Commit()
	return
}

//批量更新应用节点
func (r *resource) UpdateNodes(aid int, appName string, currentNodes []db.AppNode, tx *gorm.DB, user *db.User) (err error) {
	var (
		preNodes []db.AppNode
	)

	// 获取之前节点数据
	preNodes, err = r.GetAllAppNodeList(db.AppNode{
		AppName: appName,
	})
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return
	}
	oldTargetMap := make(map[string]interface{}, 0)
	newTargetMap := make(map[string]interface{}, 0)
	for _, item := range preNodes {
		// todo 实现比较丑陋。。。理论上应该直接更新。
		oldTargetMap[item.HostName] = item.HostName
	}

	for _, item := range currentNodes {
		newTargetMap[item.HostName] = item.HostName
		// 设置机房信息
		err = r.PutZone(tx, db.Zone{
			RegionCode: item.RegionCode,
			RegionName: item.RegionName,
			ZoneCode:   item.ZoneCode,
			ZoneName:   item.ZoneName,
			Env:        item.Env,
			CreateTime: time.Now().Unix(),
			UpdateTime: time.Now().Unix(),
		})
		if err != nil {
			return
		}
		// 设置节点
		err = r.PutNode(tx, db.Node{
			HostName:      item.HostName,
			Ip:            item.IP,
			CreateTime:    time.Now().Unix(),
			UpdateTime:    time.Now().Unix(),
			HeartbeatTime: 0,
			NodeType:      1, // 接口增加的
			RegionCode:    item.RegionCode,
			RegionName:    item.RegionName,
			ZoneCode:      item.ZoneCode,
			ZoneName:      item.ZoneName,
			Env:           item.Env,
		})
		if err != nil {
			return
		}
	}

	createMap := util.Diff(newTargetMap, oldTargetMap)
	delMap := util.Diff(oldTargetMap, newTargetMap)

	err = r.AppNodeTransferPut(tx, createMap, delMap, db.AppInfo{
		Aid:     aid,
		AppName: appName,
	}, nil)
	return

}

// 查看appnode list，是否有更新
func md5AppNodeList(list []db.AppNode) string {
	//写入app_node_map表
	//写入app_node表
	deviceList := make([]int, 0)
	deviceHostList := make([]string, 0)
	for _, item := range list {
		deviceList = append(deviceList, int(item.DeviceID))
		deviceHostList = append(deviceHostList, item.HostName)
	}
	//从小到大排序，然后字符串相加
	sort.Ints(deviceList)
	sort.Strings(deviceHostList)

	deviceIDStr := ""
	for _, id := range deviceList {
		deviceIDStr += strconv.Itoa(id)
	}
	deviceHostStr := ""
	for _, host := range deviceHostList {
		deviceHostStr += host
	}
	md5Str := Md5(deviceIDStr + deviceHostStr)
	return md5Str
}

// md5
func Md5(s string) string {
	h := md5.New()
	h.Write([]byte(s))
	return hex.EncodeToString(h.Sum(nil))
}

func (r *resource) AppNodeTransferSource() (resp []db.Node, total int, err error) {
	sql := r.DB.Model(db.Node{})
	sql.Count(&total)
	err = sql.Order("host_name desc").Find(&resp).Error
	return
}

func (r *resource) AppNodeTransferTarget(aid int) (resp []db.AppNode, total int, err error) {
	sql := r.DB.Model(db.AppNode{}).Where("aid = ?", aid)
	sql.Count(&total)
	err = sql.Order("host_name desc").Find(&resp).Error
	return
}

// 批量更新和删除节点。
func (r *resource) AppNodeTransferPut(tx *gorm.DB, add, del map[string]interface{}, app db.AppInfo, user *db.User) (err error) {
	for _, hostName := range add {
		node, _ := r.GetNode(tx, hostName.(string))
		item := &db.AppNode{
			AppName:    app.AppName,
			Aid:        app.Aid,
			HostName:   node.HostName,
			IP:         node.Ip,
			DeviceID:   0,
			Env:        node.Env,
			RegionCode: node.RegionCode,
			RegionName: node.RegionName,
			ZoneCode:   node.ZoneCode,
			ZoneName:   node.ZoneName,
			CreateTime: time.Now().Unix(),
			UpdateTime: time.Now().Unix(),
		}
		err = tx.Model(db.AppNode{}).Save(item).Error
		if err != nil {
			return
		}
		metadata, _ := json.Marshal(item)
		appevent.AppEvent.AppNodeCreateEvent(app.Aid, app.AppName, item.ZoneCode, item.Env, item.HostName, string(metadata), user)
	}

	for hostName := range del {
		item := &db.AppNode{}
		err = tx.Model(db.AppNode{}).Where("aid = ? and host_name=?", app.Aid, hostName).Delete(item).Error
		if err != nil {
			return
		}
		metadata, _ := json.Marshal(item)
		appevent.AppEvent.AppNodeDeleteEvent(app.Aid, app.AppName, item.ZoneCode, item.Env, item.HostName, string(metadata), user)
	}
	return
}
