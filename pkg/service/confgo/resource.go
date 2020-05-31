package confgo

import (
	"fmt"
	"time"

	"github.com/douyu/juno/pkg/model/db"

	"github.com/douyu/juno/pkg/model"
	"github.com/douyu/jupiter/pkg/store/gorm"
)

type resources struct {
	DB *gorm.DB
}

// UpdateResource
func (cmc *resources) UpdateResource(id uint64, name, env, value, valueType, typeStr, desc string, isShow int64, isCommon int64, opName string) error {
	oldData := db.CmcResource{}
	cmc.DB.Table("cmc_resource").Where("id = ?", id).First(&oldData)
	if oldData.Id == 0 {
		return fmt.Errorf("资源%d不存在", id)
	}
	if oldData.Name != name {
		// name字段做唯一key校验
		var count int
		if err := cmc.DB.Table("cmc_resource").Where("name=?", name).Count(&count).Error; err != nil {
			return err
		}
		if count > 0 {
			return fmt.Errorf("资源%s已存在", name)
		}
	}
	if err := cmc.DB.Table("cmc_resource").Where("id=?", id).Updates(map[string]interface{}{
		"name":        name,
		"env":         env,
		"value":       value,
		"value_type":  valueType,
		"desc":        desc,
		"type":        typeStr,
		"update_time": time.Now().Unix(),
		"op_name":     opName,
		"is_show":     isShow,
		"is_common":   isCommon,
	}).Error; err != nil {
		return err
	}
	return nil
}

// DelResource ...
func (cmc *resources) DelResource(id uint64) error {
	if err := cmc.DB.Table("cmc_resource").Where("id=?", id).Delete(db.CmcResource{}).Error; err != nil {
		return err
	}
	return nil
}

// 支持批量新增
func (cmc *resources) AddResource(list []db.CmcResource, opName string) error {
	db := cmc.DB.Table("cmc_resource")
	for _, item := range list {
		name := item.Name
		item.UpdateTime = time.Now().Unix()
		item.OpName = opName
		var count int
		if err := db.Where("name=? ", name).Count(&count).Error; err != nil {
			return err
		}
		if count > 0 {
			return fmt.Errorf("资源%s已存在", name)
		}
		if err := db.Create(&item).Error; err != nil {
			return err
		}
	}
	return nil
}

func (cmc *resources) FindResource(id int) db.CmcResource {
	data := db.CmcResource{}
	cmc.DB.Where("id = ?", id).First(&data)
	return data
}

func (cmc *resources) QueryResource(query map[string]interface{}) db.CmcResource {
	data := db.CmcResource{}
	cmc.DB.Where(query).First(&data)
	return data
}

// GetRelatedSourceList ...
func (cmc *resources) GetRelatedSourceList(caid int, auth bool) ([]db.CmcResource, error) {
	cmcConfigs := make([]db.CmcConfig, 0)
	cmcResource := make([]db.CmcResource, 0)
	queryConfig := make(map[string]interface{})
	if caid > 0 {
		queryConfig["caid"] = caid
	}
	queryConfig["is_resource"] = 1
	if err := cmc.DB.Table("cmc_config").Where(queryConfig).Where("status <> ?", model.ItemStatusDel).Find(&cmcConfigs).Error; err != nil && err != gorm.ErrRecordNotFound {
		return cmcResource, err
	}
	resourceIds := make([]int, 0)
	for _, configVal := range cmcConfigs {
		if configVal.ResourceID == 0 {
			continue
		}
		resourceIds = append(resourceIds, configVal.ResourceID)
	}
	// 权限
	sql := cmc.DB.Table("cmc_resource").Where("`id` in (?)", resourceIds)
	if auth == true {
		sql = sql.Where("is_show = 1")
	}
	if err := sql.Find(&cmcResource).Error; err != nil && err != gorm.ErrRecordNotFound {
		return cmcResource, err
	}
	return cmcResource, nil
}

// GetResourceList ...
func (cmc *resources) GetAdminResourceList(id, appId int, name, value, env, zoneCode, typeStr string, page, limit int) ([]db.CmcResourceItem, int, error) {
	list := make([]db.CmcResourceItem, 0)
	query := make(map[string]interface{})
	if id != 0 {
		query["id"] = id
	}
	if env != "" {
		if env == "trunk" {
			env = "pre"
		}
		query["env"] = env
	}
	if typeStr != "" {
		query["type"] = typeStr
	}
	if zoneCode != "" {
		query["idc_code"] = zoneCode
	}
	sql := cmc.DB.Table("cmc_resource").Where(query)
	if name != "" {
		sql = sql.Where("name LIKE ?", "%"+name+"%")
	}
	if value != "" {
		sql = sql.Where("value LIKE ?", "%"+value+"%")
	}

	// 查询所有资源
	tmp := make([]db.CmcResource, 0)
	// var count int
	if err := sql.Order("update_time desc").Find(&tmp).Error; err != nil {
		return list, 0, err
	}
	for _, item := range tmp {
		appList, _ := ConfuSrv.ResourceAppList(item.Id)
		var ri = db.CmcResourceItem{}
		ri.Id = item.Id
		ri.Name = item.Name
		ri.ZoneCode = item.ZoneCode
		ri.Env = item.Env
		ri.Type = item.Type
		ri.Value = item.Value
		ri.ValueType = item.ValueType
		ri.Desc = item.Desc
		ri.UpdateTime = item.UpdateTime
		ri.CreateTime = item.CreateTime
		ri.OpName = item.OpName
		ri.IsShow = item.IsShow
		ri.IsCommon = item.IsCommon
		ri.DepNum = len(appList)
		list = append(list, ri)
	}
	return list, len(list), nil
}

// GetResourceList ...
func (cmc *resources) GetUserResourceList(id, appId int, name, value, env, typeStr string, page, limit int) ([]db.CmcResource, int, error) {
	list := make([]db.CmcResource, 0)
	query := make(map[string]interface{})
	if id != 0 {
		query["id"] = id
	}
	if env != "" {
		if env == "trunk" {
			env = "pre"
		}
		query["env"] = env
	}
	if typeStr != "" {
		query["type"] = typeStr
	}
	/*if page == 0 {
	      page = 1
	  }
	  if limit == 0 {
	      limit = 2000
	  }
	  offset := (page - 1) * limit	*/ // 取消分页
	sql := cmc.DB.Table("cmc_resource").Where(query)
	if name != "" {
		sql = sql.Where("name LIKE ?", "%"+name+"%")
	}
	if value != "" {
		sql = sql.Where("value LIKE ?", "%"+value+"%")
	}
	/*if appId != 0 {
	    //拉取授权资源列表，兼容"is_common"为"null"的情况
	    db = db.Where("is_common = ? && id in (SELECT res_id FROM cmc_resource_assign WHERE app_id = ?)	|| is_common != ? || is_common is null", privateResTag, appId, privateResTag)
	}*/
	// 查询所有资源
	tmp := make([]db.CmcResource, 0)
	if err := sql.Order("update_time desc").Find(&tmp).Error; err != nil {
		return list, 0, err
	}
	for _, item := range tmp {
		if item.IsShow == 2 {
			item.Value = "***"
		}
		list = append(list, item)
	}
	return list, len(list), nil
}
