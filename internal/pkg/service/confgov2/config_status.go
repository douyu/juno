package confgov2

import (
	"encoding/json"
	"fmt"

	"github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/internal/pkg/service/system"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/store/gorm"
	"github.com/douyu/jupiter/pkg/util/xgo"
	"github.com/douyu/jupiter/pkg/util/xstring"
	"github.com/douyu/jupiter/pkg/xlog"
)

type ConfigStatusService struct {
	aid                int
	env                string
	configList         view.RespListConfig // 配置文件列表
	configIdList       []uint              // 配置id列表
	zoneCodeList       []string            // 环境对应可用区列表
	clusterNameList    []string            // 环境对应的容器集群列表
	zoneNodeMap        map[string][]string // zone对应的节点名称列表
	configVersionIdMap map[uint]uint       // 配置id对应最近保存版本id
	configPublishIdMap map[string]uint     // 配置id的最近保存版本对应的发布id
	configStatusMap    map[uint]uint32     // 配置文件id对应的发布状态
}

func NewConfigStatusService(configList view.RespListConfig) (r *ConfigStatusService) {
	var (
		aid             int
		env             string
		zoneCodeMap     = make(map[string]struct{}) // 环境对应可用区列表
		zoneCodeList    = make([]string, 0)
		configIdList    = make([]uint, 0)
		configStatusMap = make(map[uint]uint32, len(configList))
	)
	for _, v := range configList {
		if aid == 0 {
			aid = int(v.AID)
		}
		if env == "" {
			env = v.Env
		}
		if _, ok := zoneCodeMap[v.Zone]; !ok {
			zoneCodeList = append(zoneCodeList, v.Zone)
			zoneCodeMap[v.Zone] = struct{}{}
		}
		configIdList = append(configIdList, v.ID)
		configStatusMap[v.ID] = ConfigStatusUnknown
	}
	return &ConfigStatusService{
		aid:                aid,
		env:                env,
		configList:         configList,
		configIdList:       configIdList,
		zoneCodeList:       zoneCodeList,
		clusterNameList:    make([]string, 0),
		zoneNodeMap:        make(map[string][]string),
		configVersionIdMap: make(map[uint]uint),
		configPublishIdMap: make(map[string]uint),
		configStatusMap:    configStatusMap,
	}
}

func HandleConfigPublishStatus(configList view.RespListConfig) view.RespListConfig {
	rs := NewConfigStatusService(configList)
	err := xgo.SerialUntilError(
		xgo.ParallelWithError(
			xgo.SerialUntilError(
				rs.initConfigLatestVersionId, // 获取每个配置对应最近保存的版本id
				rs.initConfigPublishId,       // 根据配置id和最近保存版本获取对应的发布id
			),
			rs.initNodeNameList,    // 获取配置对应的物理机节点信息
			rs.initClusterNameList, // 获取配置对应的容器集群信息
		),
		xgo.SerialUntilError( // 由于没有使用锁，下面两个检测需串行
			rs.checkNodePublish,    // 检测物理机所有节点的配置是否都已经发布
			rs.checkClusterPublish, // 检测容器所有集群的配置是否都已经发布
		),
	)()

	if err != nil {
		rs.logError("HandleConfigPublishStatus", "func error", err)
		return rs.handleErrorResult()
	}
	return rs.handleSuccessResult()
}

func (r *ConfigStatusService) logError(msg string, event string, err error) {
	xlog.Error(msg, xlog.String("event", event), xlog.Any("err", err), xlog.Any("app_id", r.aid), xlog.Any("env", r.env), xlog.Any("configList", xstring.Json(r.configList)), xlog.Any("ConfigStatusService", xstring.Json(*r)))
}

func (r *ConfigStatusService) initClusterNameList() error {
	settings, err := system.System.Setting.GetAll()
	if err != nil {
		r.logError("initClusterNameList", "get setting error", err)
		return err
	}

	setStr, setOk := settings["k8s_cluster"]
	if !setOk {
		r.logError("initClusterNameList", "k8s_cluster setting is nil", err)
		return err
	}

	var clusterList = view.ClusterList{}
	if err = json.Unmarshal([]byte(setStr), &clusterList); err != nil {
		r.logError("initClusterNameList", "json unmarshal error", err)
		return err
	}

	for _, instance := range clusterList.List {
		for _, cEnv := range instance.Env { // 有的集群有多个环境  比如说  prod gray
			if cEnv == r.env {
				r.clusterNameList = append(r.clusterNameList, instance.Name)
				break
			}
		}
	}

	return nil
}

func (r *ConfigStatusService) initNodeNameList() error {
	nodes, _ := resource.Resource.AppNodeList(r.aid, r.env, r.zoneCodeList)
	for _, node := range nodes {
		if tmp, ok := r.zoneNodeMap[node.ZoneCode]; ok {
			r.zoneNodeMap[node.ZoneCode] = append(tmp, node.HostName)
			continue
		}
		r.zoneNodeMap[node.ZoneCode] = []string{node.HostName}
	}
	return nil
}

func (r *ConfigStatusService) initConfigLatestVersionId() error {
	var (
		historyList = make([]db.ConfigurationHistory, 0)
		record      = db.ConfigurationHistory{}
		ids         = make([]uint32, 0)
		err         error
	)

	if err = mysql.Table(record.TableName()).Select("max(id) as id").Where("configuration_id in (?)", r.configIdList).Group("configuration_id").Pluck("id", &ids).Error; err != nil && err != gorm.ErrRecordNotFound {
		r.logError("initConfigLatestVersionId", "db pluck id error", err)
		return err
	}

	if len(ids) > 0 {
		if err = mysql.Select("id,configuration_id").Where("id in (?)", ids).Find(&historyList).Error; err != nil && err != gorm.ErrRecordNotFound {
			r.logError("initConfigLatestVersionId", "db find last version error", err)
			return err
		}
	}

	for _, v := range historyList {
		// 只拿第一条数据，即为最近的一次操作记录
		if _, ok := r.configVersionIdMap[v.ConfigurationID]; !ok {
			r.configVersionIdMap[v.ConfigurationID] = v.ID
		}
	}
	return nil
}

func (r *ConfigStatusService) initConfigPublishId() error {
	var (
		err      error
		sqlWhere = ""
		sqlParam = make([]interface{}, 0)
	)
	for _, v := range r.configIdList {
		configurationHistoryId, ok := r.configVersionIdMap[v]
		if !ok {
			r.configStatusMap[v] = ConfigStatusNotPublish
			continue
		}
		if sqlWhere == "" {
			sqlWhere = "(configuration_id = ? AND configuration_history_id = ?)"
			sqlParam = append(sqlParam, v, configurationHistoryId)
			continue
		}
		sqlWhere += " OR (configuration_id = ? AND configuration_history_id = ?)"
		sqlParam = append(sqlParam, v, configurationHistoryId)
	}

	if sqlWhere == "" {
		return nil
	}

	var (
		configPublishList = make([]db.ConfigurationPublish, 0)
		record            = db.ConfigurationPublish{}
		ids               = make([]uint32, 0)
	)

	if err = mysql.Table(record.TableName()).Select("max(id) as id").Where(sqlWhere, sqlParam...).Group("configuration_id,configuration_history_id").Pluck("id", &ids).Error; err != nil && err != gorm.ErrRecordNotFound {
		r.logError("initConfigPublishId", "db pluck id error", err)
		return err
	}

	if len(ids) > 0 {
		if err = mysql.Select("id,configuration_id,configuration_history_id").Where("id in (?)", ids).Find(&configPublishList).Error; err != nil && err != gorm.ErrRecordNotFound {
			r.logError("initConfigPublishId", "db find last version error", err)
			return err
		}
	}

	for _, v := range configPublishList {
		// 只拿第一条数据，即为最近的一次操作记录
		key := fmt.Sprintf("%d#%d", v.ConfigurationID, v.ConfigurationHistoryID)
		if _, ok := r.configPublishIdMap[key]; !ok {
			r.configPublishIdMap[key] = v.ID
		}
	}
	return nil
}

func (r *ConfigStatusService) checkNodePublish() error {
	// 检查物理机实例发布情况
	var (
		sqlWhere = ""
		sqlParam = make([]interface{}, 0)
	)
	for _, v := range r.configList {
		if r.configStatusMap[v.ID] == ConfigStatusNotPublish {
			continue
		}
		configurationHistoryId, ok := r.configVersionIdMap[v.ID]
		if !ok {
			r.configStatusMap[v.ID] = ConfigStatusNotPublish
			continue
		}
		key := fmt.Sprintf("%d#%d", v.ID, configurationHistoryId)
		publishId, ok := r.configPublishIdMap[key]
		if !ok {
			r.configStatusMap[v.ID] = ConfigStatusNotPublish
			continue
		}
		hostNameList, ok := r.zoneNodeMap[v.Zone]
		if !ok || len(hostNameList) == 0 { // 没有物理机
			continue
		}

		if sqlWhere == "" {
			sqlWhere = "(configuration_id = ? AND configuration_publish_id = ? AND host_name in (?))"
			sqlParam = append(sqlParam, v.ID, publishId, hostNameList)
			continue
		}
		sqlWhere += " OR (configuration_id = ? AND configuration_publish_id = ? AND host_name in (?))"
		sqlParam = append(sqlParam, v.ID, publishId, hostNameList)
	}

	var ConfigurationStatusList = make([]db.ConfigurationStatus, 0)
	if sqlWhere != "" {
		if err := mysql.Where(sqlWhere, sqlParam...).Find(&ConfigurationStatusList).Error; err != nil && err != gorm.ErrRecordNotFound {
			r.logError("checkNodePublish", "db find config publish status error", err)
			return err
		}
	}

	var configPublishHostCnt = make(map[uint]int)
	for _, v := range ConfigurationStatusList {
		if tmp, ok := configPublishHostCnt[v.ConfigurationID]; ok {
			configPublishHostCnt[v.ConfigurationID] = tmp + 1
			continue
		}
		configPublishHostCnt[v.ConfigurationID] = 1
	}

	for _, v := range r.configList {
		if r.configStatusMap[v.ID] == ConfigStatusNotPublish {
			continue
		}
		hostNameList, ok := r.zoneNodeMap[v.Zone]
		if !ok || len(hostNameList) == 0 { // 没有物理机
			continue
		}
		tmp, ok := configPublishHostCnt[v.ID]
		if !ok { // 压根儿没发布过
			r.configStatusMap[v.ID] = ConfigStatusNotPublish
			continue
		}
		if tmp < len(hostNameList) { // 存在未发布的机器
			r.configStatusMap[v.ID] = ConfigStatusNotPublish
			continue
		}
	}
	return nil
}

func (r *ConfigStatusService) checkClusterPublish() error {
	var (
		sqlWhere = ""
		sqlParam = make([]interface{}, 0)
	)
	for _, v := range r.configList {
		if r.configStatusMap[v.ID] == ConfigStatusNotPublish {
			continue
		}
		configurationHistoryId, ok := r.configVersionIdMap[v.ID]
		if !ok {
			r.configStatusMap[v.ID] = ConfigStatusNotPublish
			continue
		}
		key := fmt.Sprintf("%d#%d", v.ID, configurationHistoryId)
		publishId, ok := r.configPublishIdMap[key]
		if !ok {
			r.configStatusMap[v.ID] = ConfigStatusNotPublish
			continue
		}

		if sqlWhere == "" {
			sqlWhere = "(configuration_id = ? AND configuration_publish_id = ? AND cluster_name in (?))"
			sqlParam = append(sqlParam, v.ID, publishId, r.clusterNameList)
			continue
		}
		sqlWhere += " OR (configuration_id = ? AND configuration_publish_id = ? AND cluster_name in (?))"
		sqlParam = append(sqlParam, v.ID, publishId, r.clusterNameList)
	}

	var ConfigurationClusterStatusList = make([]db.ConfigurationClusterStatus, 0)
	if sqlWhere != "" {
		if err := mysql.Where(sqlWhere, sqlParam...).Find(&ConfigurationClusterStatusList).Error; err != nil && err != gorm.ErrRecordNotFound {
			r.logError("checkClusterPublish", "db find config cluster publish status error", err)
			return err
		}
	}

	var configClusterPublishHostCnt = make(map[uint]int)
	for _, v := range ConfigurationClusterStatusList {
		if tmp, ok := configClusterPublishHostCnt[v.ConfigurationID]; ok {
			configClusterPublishHostCnt[v.ConfigurationID] = tmp + 1
			continue
		}
		configClusterPublishHostCnt[v.ConfigurationID] = 1
	}

	for _, v := range r.configList {
		if r.configStatusMap[v.ID] == ConfigStatusNotPublish {
			continue
		}
		tmp, ok := configClusterPublishHostCnt[v.ID]
		if !ok { // 压根儿没发布过
			r.configStatusMap[v.ID] = ConfigStatusNotPublish
			continue
		}
		if tmp < len(r.clusterNameList) { // 存在未发布的集群
			r.configStatusMap[v.ID] = ConfigStatusNotPublish
			continue
		}
	}
	return nil
}

func (r *ConfigStatusService) handleErrorResult() view.RespListConfig { // 可能会存在一部分未知状态，即检测过程中出错了
	for ind, v := range r.configList {
		r.configList[ind].ConfigStatus = r.configStatusMap[v.ID]
	}
	return r.configList
}

func (r *ConfigStatusService) handleSuccessResult() view.RespListConfig {
	for _, v := range r.configIdList {
		if r.configStatusMap[v] == ConfigStatusUnknown {
			r.configStatusMap[v] = ConfigStatusAlreadyPublish
		}
	}
	for ind, v := range r.configList {
		r.configList[ind].ConfigStatus = r.configStatusMap[v.ID]
	}

	return r.configList
}
