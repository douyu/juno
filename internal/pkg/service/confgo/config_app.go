package confgo

import (
	"fmt"
	"log"
	"time"

	"github.com/douyu/juno/internal/pkg/model"
	"github.com/douyu/juno/internal/pkg/model/db"
	"github.com/douyu/jupiter/pkg/store/gorm"
)

type configApp struct {
	DB *gorm.DB
}

// 应用列表
func (c *configApp) AppList(aids []int, all bool) (result []db.CmcAppView, err error) {
	list := make([]db.CmcAppView, 0)
	sql := c.DB.Table("cmc_app as a").
		Select("*").
		Joins("left join configApp as b on a.aid = b.aid").
		Joins("left join gitlab_project as c on b.gid = c.gid")
	if !all {
		sql = sql.Where("b.aid IN (?)", aids)
	}
	if err = sql.Find(&list).Error; err != nil {
		log.Println("get cmc resources fail", "error", err)
		return
	}

	tempMap := make(map[int][]string)
	for _, item := range list {
		temp, ok := tempMap[item.Aid]
		if ok {
			temp = append(temp, item.ZoneCode)
			tempMap[item.Aid] = temp
		} else {
			temp = []string{item.ZoneCode}
			tempMap[item.Aid] = temp
		}
	}
	result = make([]db.CmcAppView, 0)
	tempAppMap := make(map[string]db.CmcAppView)
	for _, item := range list {
		envs := tempMap[item.Aid]
		if _, ok := tempAppMap[item.AppName]; !ok {
			item.Envs = envs
			if item.AppName != "" {
				result = append(result, item)
				tempAppMap[item.AppName] = item
			}
		}
	}
	return result, nil
}

// AppConfigList 获取应用配置信息，无配置内容
// 传入zoneCode和env，就获取一个机房的配置
func (c *configApp) AppConfigList(env, zoneCode, appName string, aid int) (result []db.CmcAppView, err error) {
	list := make([]db.CmcAppView, 0)
	sql := c.DB.Table("cmc_app as a").Select("*")
	if appName != "" {
		sql = sql.Where("a.app_name = ?", appName)
	}
	if env != "" {
		sql = sql.Where("a.env = ?", env)
	}
	if zoneCode != "" {
		sql = sql.Where("a.idc_code = ?", zoneCode)
	}
	if aid != 0 {
		sql = sql.Where("a.aid = ?", aid)
	}
	sql.Joins("LEFT JOIN app as b ON a.aid = b.aid").Find(&list)
	return list, nil
}

// CreateConfigFile Add application profile
func (c *configApp) CreateConfigFile(aid int, appName, env, zoneCode string, fileName string, format model.ConfigFormat, create bool) (resp db.CmcApp, err error) {
	if create {
		fileName = "config-local.toml"
	}

	resp = db.CmcApp{}
	c.DB.Where("aid = ? AND file_name = ?", aid, fileName).First(&resp)
	if resp.Id != 0 {
		err = fmt.Errorf("该应用的配置文件已存在")
		return
	}

	resp = db.CmcApp{
		Aid:        aid,
		FileName:   fileName,
		AppName:    appName,
		ZoneCode:   zoneCode,
		Format:     format,
		Env:        env,
		CreateTime: time.Now().Unix(),
		UpdateTime: time.Now().Unix(),
	}
	err = c.DB.Create(&resp).Error
	if err != nil {
		err = fmt.Errorf("添加配置文件数据库异常" + err.Error())
		return
	}
	return
}

// UpdateConfigFile 添加应用配置文件
func (c *configApp) UpdateConfigFile(caid int) (err error) {
	return c.DB.Where("id = ?", caid).Update(map[string]interface{}{
		"update_time": time.Now().Unix(),
	}).Error
}

// DelConfigFile 删除配置文件
func (c *configApp) DelConfigFile(caid, aid int, env, appName, fileName, opName string) (err error) {
	cmcAppLog := db.CmcAppLog{
		Caid:     caid,
		Aid:      aid,
		ZoneCode: env,
		AppName:  appName,
		FileName: fileName,
		OpName:   opName,
	}
	cmcAppLog.OpTime = time.Now().Unix()
	cmcAppLog.OpType = 4
	tx := c.DB.Begin()
	var count int
	if err = tx.Table("cmc_app").Where("id=?", caid).Count(&count).Delete(db.CmcApp{}).Error; err != nil {
		tx.Rollback()
		return
	}
	if count < 1 {
		tx.Rollback()
		return fmt.Errorf("文件已经删除，不能重复操作")
	}
	if err = tx.Table("cmc_app_log").Create(&cmcAppLog).Error; err != nil {
		tx.Rollback()
		return
	}
	tx.Commit()
	return
}

type diffKeyItem struct {
	Key    string `json:"key"`
	Status string `json:"status"`
}
