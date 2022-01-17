package resource

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/douyu/juno/internal/pkg/service/appevent"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/juno/pkg/util"
	"github.com/douyu/jupiter/pkg/store/gorm"
	"github.com/douyu/jupiter/pkg/xlog"
	"go.uber.org/zap"
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

func (r *resource) GetAppPod(where db.K8sPod) (resp db.K8sPod, err error) {
	err = r.DB.Where(&where).Find(&resp).Error
	return
}

func (r *resource) GetAllAppEnvZone(where db.AppNode) (resp []db.AppNode, err error) {
	err = r.DB.Where(&where).Order("create_time desc", false).Find(&resp).Error
	return
}

func (r *resource) GetAppNodeList(where db.AppNode, currentPage, pageSize int) (resp []db.AppNode, page *view.Pagination, err error) {
	nodeSql := `select * from
(select a.app_name,a.host_name,a.ip,a.zone_name,a.region_name,a.env,a.update_time,a.zone_code ,0 is_del from app_node a
UNION
(select k.app_name,k.pod_name host_name,k.pod_ip ip,z.zone_name,z.region_name,k.env,UNIX_TIMESTAMP(k.update_time) update_time,k.zone_code,k.is_del from k8s_pod k left join zone z on z.zone_code =k.zone_code )
)  t where is_del=0 %s order by t.update_time desc`

	whereSql := "&&"
	whereArr := make([]interface{}, 0)
	if where.AppName != "" {
		whereSql += " t.app_name = ? &&"
		whereArr = append(whereArr, where.AppName)
	}
	//if where.Aid != 0 {
	//	whereSql += " t.aid = ? &&"
	//	whereArr = append(whereArr, where.Aid)
	//}
	if where.HostName != "" {
		whereSql += " t.home_name = ? &&"
		whereArr = append(whereArr, where.HostName)
	}
	if where.IP != "" {
		whereSql += " t.ip = ? &&"
		whereArr = append(whereArr, where.IP)
	}
	if where.Env != "" {
		whereSql += " t.env = ? &&"
		whereArr = append(whereArr, where.Env)
	}
	if where.ZoneCode != "" {
		whereSql += " t.zone_code = ? &&"
		whereArr = append(whereArr, where.ZoneCode)
	}
	whereSql = strings.TrimRight(whereSql, "&&")
	nodeSql = fmt.Sprintf(nodeSql, whereSql)
	page = view.NewPagination(currentPage, pageSize)
	dbw := r.DB.Raw(nodeSql, whereArr...).Offset(page.Current - 1).Limit(page.PageSize).Scan(&resp)
	dbw.Count(&page.Total)
	return
}

// 设置应用的节点信息
// 如果不存在就会创建，如果存在就会更新
// 这里面会设置应用的节点，并且根据节点自动创建idc信息
func (r *resource) PutAppNode(identify interface{}, list []db.AppNode, user *db.User) (err error) {
	var info db.AppInfo
	info, err = r.GetApp(identify)
	if err != nil {
		xlog.Error("PutAppNode get app error", zap.Error(err), zap.String("identify", identify.(string)))
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
		xlog.Warn("PutAppNode: AppNodeMap already exists", zap.String("app_name", info.AppName), zap.String("md5", md5Str))
		// return
		return errors.New("PutAppNode: AppNodeMap already exists")
	}
	//部署组被更新, 更新app_node_map表
	tx := r.DB.Begin()
	err = tx.Where("app_name = ?", info.AppName).Delete(&data).Error //删除现有记录
	if err != nil {
		xlog.Error("PutAppNode: delete old app_node_map error", zap.Error(err), zap.String("app_name", info.AppName))
		tx.Rollback()
		return
	}
	err = tx.Create(&data).Error
	if err != nil {
		xlog.Error("PutAppNode create new app_node_map error", zap.Error(err), zap.String("app_name", info.AppName))
		tx.Rollback()
		return
	} //新增记录
	// 填充appname和aid
	xlog.Info("PutAppNode update app_node_map success", zap.String("app_name", info.AppName))
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
	xlog.Info("PutAppNode update app_node success", zap.String("app_name", info.AppName))
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
		xlog.Error("UpdateNodes GetPreAllAppNodeList error", zap.Error(err), zap.String("app_name: ", appName))
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
			HostName:   item.HostName,
			Ip:         item.IP,
			CreateTime: time.Now().Unix(),
			UpdateTime: time.Now().Unix(),
			NodeType:   1, // 接口增加的
			RegionCode: item.RegionCode,
			RegionName: item.RegionName,
			ZoneCode:   item.ZoneCode,
			ZoneName:   item.ZoneName,
			Env:        item.Env,
		})
		if err != nil {
			return
		}
	}
	xlog.Info("PutAppNode update node success", zap.String("app_name", appName))
	createMap := util.Diff(newTargetMap, oldTargetMap)
	delMap := util.Diff(oldTargetMap, newTargetMap)
	xlog.Info("createMap info: ", zap.Any("createMap", createMap))
	xlog.Info("delMap info: ", zap.Any("delMap", createMap))
	if len(createMap) == 0 && len(delMap) == 0 {
		return errors.New("all nodes in app_node already exist")
	}
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
	deviceEnv := make([]string, 0)
	deviceZoneCode := make([]string, 0)
	for _, item := range list {
		deviceList = append(deviceList, int(item.DeviceID))
		deviceHostList = append(deviceHostList, item.HostName)
		deviceEnv = append(deviceEnv, item.Env)
		deviceZoneCode = append(deviceZoneCode, item.ZoneCode)
	}
	//从小到大排序，然后字符串相加
	sort.Ints(deviceList)
	sort.Strings(deviceHostList)
	sort.Strings(deviceEnv)
	sort.Strings(deviceZoneCode)

	deviceIDStr := ""
	for _, id := range deviceList {
		deviceIDStr += strconv.Itoa(id)
	}
	deviceHostStr := ""
	for _, host := range deviceHostList {
		deviceHostStr += host
	}
	deviceEnvStr := ""
	for _, env := range deviceEnv {
		deviceEnvStr += env
	}
	deviceZoneCodeStr := ""
	for _, zonecode := range deviceZoneCode {
		deviceZoneCodeStr += zonecode
	}
	md5Str := Md5(deviceIDStr + deviceHostStr + deviceEnvStr + deviceZoneCodeStr)
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
		itemjson, _ := json.Marshal(item)
		xlog.Info("AppNode item: ", zap.String("item", string(itemjson)))
		err = tx.Model(db.AppNode{}).Save(item).Error
		if err != nil {
			xlog.Error("AppNodeTransferPut Save error: ", zap.Error(err), zap.String("AppName", app.AppName))
			return
		}
		metadata, _ := json.Marshal(item)
		appevent.AppEvent.AppNodeCreateEvent(app.Aid, app.AppName, item.ZoneCode, item.Env, item.HostName, string(metadata), user)
	}

	for hostName := range del {
		item := &db.AppNode{}
		err = tx.Model(db.AppNode{}).Where("aid = ? and host_name=?", app.Aid, hostName).Delete(item).Error
		if err != nil {
			xlog.Error("AppNodeTransferPut Delete error: ", zap.Error(err), zap.String("AppName", app.AppName))
			return
		}
		metadata, _ := json.Marshal(item)
		appevent.AppEvent.AppNodeDeleteEvent(app.Aid, app.AppName, item.ZoneCode, item.Env, item.HostName, string(metadata), user)
	}
	return
}

func (r *resource) AppNodeList(aid int, env string, zoneCodeList []string) (resp []db.AppNode, err error) {
	err = r.DB.Model(db.AppNode{}).Where("aid = ? AND env = ? AND zone_code in (?)", aid, env, zoneCodeList).Find(&resp).Error
	return
}
