package confgov2

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/douyu/juno/internal/pkg/service/appevent"
	"github.com/douyu/juno/internal/pkg/service/clientproxy"
	"github.com/douyu/juno/internal/pkg/service/codec/util"
	"github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/code"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/conf"
	"github.com/jinzhu/gorm"
)

var (
	ErrConfigNotExists error = fmt.Errorf("配置不存在")
)

func List(param view.ReqListConfig) (resp view.RespListConfig, err error) {
	resp = make(view.RespListConfig, 0)
	list := make([]db.Configuration, 0)
	err = mysql.Select("id, aid, name, format, env, zone, created_at, updated_at, published_at").
		Where("aid = ?", param.AID).
		Where("env = ?", param.Env).
		Find(&list).Error

	for _, item := range list {
		resp = append(resp, view.RespListConfigItem{
			ID:          item.ID,
			AID:         item.AID,
			Name:        item.Name,
			Format:      item.Format,
			Env:         item.Env,
			Zone:        item.Zone,
			CreatedAt:   item.CreatedAt,
			UpdatedAt:   item.UpdatedAt,
			DeletedAt:   item.DeletedAt,
			PublishedAt: item.PublishedAt,
		})
	}

	return
}

func Detail(param view.ReqDetailConfig) (resp view.RespDetailConfig, err error) {
	configuration := db.Configuration{}
	err = mysql.Where("id = ?", param.ID).First(&configuration).Error
	if err != nil {
		return
	}

	resp = view.RespDetailConfig{
		ID:          configuration.ID,
		AID:         configuration.AID,
		Name:        configuration.Name,
		Content:     configuration.Content,
		Format:      configuration.Format,
		Env:         configuration.Env,
		Zone:        configuration.Zone,
		CreatedAt:   configuration.CreatedAt,
		UpdatedAt:   configuration.UpdatedAt,
		PublishedAt: configuration.PublishedAt,
	}

	return
}

func Create(param view.ReqCreateConfig) (err error) {

	tx := mysql.Begin()
	{
		// check if name exists
		exists := 0
		err = tx.Model(&db.Configuration{}).Where("aid = ?", param.AID).
			Where("env = ?", param.Env).
			Where("name = ?", param.FileName).
			Where("format = ?", param.Format).
			Count(&exists).Error
		if err != nil {
			tx.Rollback()
			return err
		}

		if exists != 0 {
			tx.Rollback()
			return fmt.Errorf("已存在同名配置")
		}

		configuration := db.Configuration{
			AID:    param.AID,
			Name:   param.FileName, // 不带后缀
			Format: string(param.Format),
			Env:    param.Env,
			Zone:   param.Zone,
		}

		err = tx.Create(&configuration).Error
		if err != nil {
			tx.Rollback()
			return
		}
	}

	err = tx.Commit().Error
	if err != nil {
		tx.Rollback()
		return err
	}

	return
}

func Update(uid int, param view.ReqUpdateConfig) (err error) {
	configuration := db.Configuration{}
	err = mysql.Where("id = ?", param.ID).First(&configuration).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return ErrConfigNotExists
		}

		return err
	}

	// 计算本次版本号
	version := util.Md5Str(param.Content)
	if util.Md5Str(configuration.Content) == version {
		return fmt.Errorf("保存失败，本次无更新")
	}

	history := db.ConfigurationHistory{
		UID:             uint(uid),
		ConfigurationID: configuration.ID,
		ChangeLog:       param.Message,
		Content:         param.Content,
		Version:         version,
	}

	tx := mysql.Begin()
	{
		// 存历史版本
		err = mysql.Save(&history).Error
		if err != nil {
			tx.Rollback()
			return err
		}

		configuration.Content = param.Content
		err = mysql.Save(&configuration).Error
		if err != nil {
			tx.Rollback()
			return err
		}
	}

	err = tx.Commit().Error
	if err != nil {
		tx.Rollback()
		return err
	}

	return
}

// Instances ..
func Instances(param view.ReqConfigInstanceList) (resp view.RespConfigInstanceList, err error) {
	aid := param.AID
	env := param.Env
	zoneCode := param.Zone
	// Get nodes data
	nodes, err := resource.Resource.GetAllAppNodeList(db.AppNode{
		Aid:      int(aid),
		Env:      env,
		ZoneCode: zoneCode,
	})

	for _, node := range nodes {
		resp = append(resp, view.RespConfigInstanceItem{
			Env:                  node.Env,
			IP:                   node.IP,
			HostName:             node.HostName,
			DeviceID:             node.DeviceID,
			RegionCode:           node.RegionCode,
			RegionName:           node.RegionName,
			ZoneCode:             node.ZoneCode,
			ZoneName:             node.ZoneName,
			ConfigFilePath:       "/path/to/configFile.toml",
			ConfigFileUsed:       true,
			ConfigFileSynced:     true,
			ConfigFileTakeEffect: false,
			SyncAt:               time.Now(),
		})

	}

	return
}

// Publish ..
func Publish(param view.ReqPublishConfig, user *db.User) (err error) {
	// Complete configuration release logic

	// Get configuration
	var configuration db.Configuration
	query := mysql.Where("id=?", param.ID).Find(&configuration)
	if query.Error != nil {
		return query.Error
	}

	aid := int(configuration.AID)
	env := configuration.Env
	zoneCode := configuration.Zone
	filename := configuration.FileName()

	// Get publish version
	var confHistory db.ConfigurationHistory
	query = mysql.Where("configuration_id=? and version =?", param.ID, param.Version).Find(&confHistory)
	if query.Error != nil {
		return query.Error
	}

	content := confHistory.Content
	version := confHistory.Version

	// Get nodes data
	var instanceList []string
	if instanceList, err = getPublishInstance(aid, env, zoneCode); err != nil {
		return
	}
	// TODO Configure resource replacement operations

	// Obtain application management port
	appInfo, err := resource.Resource.GetApp(aid)
	if err != nil {
		return
	}

	// Save the configuration in etcd
	if err = publishEtcd(view.ReqConfigPublish{
		AppName:      appInfo.AppName,
		ZoneCode:     zoneCode,
		Port:         appInfo.GovernPort,
		FileName:     filename,
		Format:       configuration.Format,
		Content:      content,
		InstanceList: instanceList,
		Env:          env,
		Version:      version,
	}); err != nil {
		return
	}

	// Publish record
	instanceListJSON, _ := json.Marshal(instanceList)

	var cp db.ConfigurationPublish
	cp.ApplyInstance = string(instanceListJSON)
	cp.ConfigurationID = configuration.ID
	cp.ConfigurationHistoryID = confHistory.ID
	cp.UID = uint(user.Uid)
	cp.FilePath = strings.Join([]string{conf.GetString("confgo.dir"), appInfo.AppName, "config", configuration.FileName()}, "/")
	if err = mysql.Save(&cp).Error; err != nil {
		return
	}

	meta, _ := json.Marshal(cp)
	appevent.AppEvent.ConfgoFilePublishEvent(appInfo.Aid, appInfo.AppName, env, zoneCode, string(meta), user)
	return
}

func getPublishInstance(aid int, env string, zoneCode string) (instanceList []string, err error) {
	nodes, _ := resource.Resource.GetAllAppNodeList(db.AppNode{
		Aid:      aid,
		Env:      env,
		ZoneCode: zoneCode,
	})
	if len(nodes) == 0 {
		return instanceList, code.ErrorNoInstances
	}
	for _, node := range nodes {
		instanceList = append(instanceList, node.HostName)
	}
	return instanceList, nil
}

func publishEtcd(req view.ReqConfigPublish) (err error) {
	data := view.ConfigurationPublishData{
		Content: req.Content,
		Metadata: view.Metadata{
			Timestamp: time.Now().Unix(),
			Format:    req.Format,
			Version:   req.Version,
			Path:      strings.Join([]string{cfg.Cfg.Configure.Dir, req.AppName, "config", req.FileName}, "/"),
		},
	}
	var buf []byte
	if buf, err = json.Marshal(data); err != nil {
		return
	}
	fmt.Println("req.InstanceList", req.InstanceList)
	for _, hostName := range req.InstanceList {
		key := fmt.Sprintf("/%s/%s/%s/%s/static/%s/%s", cfg.Cfg.Configure.Prefix, hostName, req.AppName, req.Env, req.FileName, req.Port)
		// The migration is complete, only write independent ETCD of the configuration center
		ctx, cancel := context.WithTimeout(context.Background(), time.Second*3)
		defer cancel()
		conn, errConn := clientproxy.ClientProxy.Conn(req.Env, req.ZoneCode)
		if errConn != nil {
			return errConn
		}
		fmt.Println("key", key)
		fmt.Println("buf", buf)
		_, err = conn.Put(ctx, key, string(buf))
		if err != nil {
			return
		}
	}
	return nil
}

// History 发布历史分页列表，Page从0开始
func History(param view.ReqHistoryConfig, uid int) (resp view.RespHistoryConfig, err error) {
	list := make([]db.ConfigurationHistory, 0)

	if param.Size == 0 {
		param.Size = 1
	}

	query := mysql.Where("configuration_id = ?", param.ID)

	wg := sync.WaitGroup{}
	errChan := make(chan error)
	doneChan := make(chan struct{})

	wg.Add(1)
	go func() {
		defer wg.Done()

		offset := param.Size * param.Page
		query := query.Preload("User").Limit(param.Size).Offset(offset).Order("id desc").Find(&list)
		if query.Error != nil {
			errChan <- query.Error
		}
	}()

	wg.Add(1)
	go func() {
		wg.Done()

		q := query.Model(&db.ConfigurationHistory{}).Count(&resp.Pagination.Total)
		if q.Error != nil {
			errChan <- q.Error
		}
	}()

	go func() {
		wg.Wait()

		doneChan <- struct{}{}
	}()

	select {
	case <-doneChan:
		break
	case e := <-errChan:
		close(errChan)
		err = e
		return
	}

	for _, item := range list {
		configItem := view.RespHistoryConfigItem{
			ID:              item.ID,
			UID:             uint(uid),
			ConfigurationID: item.ConfigurationID,
			Version:         item.Version,
			CreatedAt:       item.CreatedAt,
			ChangeLog:       item.ChangeLog,
		}

		if item.User != nil {
			configItem.UserName = item.User.Username
		}

		resp.List = append(resp.List, configItem)
	}

	resp.Pagination.Current = int(param.Page)
	resp.Pagination.PageSize = int(param.Size)

	return
}

// Diff ..
func Diff(id uint) (resp view.RespDiffConfig, err error) {
	modifiedConfig := db.ConfigurationHistory{}
	err = mysql.Preload("Configuration").Preload("User").
		Where("id = ?", id).First(&modifiedConfig).Error
	if err != nil {
		return
	}

	originConfig := db.ConfigurationHistory{}
	err = mysql.Preload("Configuration").Preload("User").
		Where("id < ?", id).Order("id desc").First(&originConfig).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			resp.Origin = nil
			err = nil
		} else {
			return
		}
	} else {
		resp.Origin = &view.RespDetailConfig{
			ID:          originConfig.ID,
			AID:         originConfig.Configuration.AID,
			Name:        originConfig.Configuration.Name,
			Content:     originConfig.Content,
			Format:      originConfig.Configuration.Format,
			Env:         originConfig.Configuration.Env,
			Zone:        originConfig.Configuration.Env,
			CreatedAt:   originConfig.CreatedAt,
			UpdatedAt:   originConfig.Configuration.UpdatedAt,
			PublishedAt: originConfig.Configuration.PublishedAt,
		}
	}

	resp.Modified = view.RespDetailConfig{
		ID:          modifiedConfig.ID,
		AID:         modifiedConfig.Configuration.AID,
		Name:        modifiedConfig.Configuration.Name,
		Content:     modifiedConfig.Content,
		Format:      modifiedConfig.Configuration.Format,
		Env:         modifiedConfig.Configuration.Env,
		Zone:        modifiedConfig.Configuration.Env,
		CreatedAt:   modifiedConfig.CreatedAt,
		UpdatedAt:   modifiedConfig.Configuration.UpdatedAt,
		PublishedAt: modifiedConfig.Configuration.PublishedAt,
	}

	return
}

// Delete ..
func Delete(id uint) (err error) {
	err = mysql.Delete(&db.Configuration{}, "id = ?", id).Error
	return
}
