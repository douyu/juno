package confgov2

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/douyu/juno/internal/pkg/service/appevent"
	"github.com/douyu/juno/internal/pkg/service/clientproxy"
	"github.com/douyu/juno/internal/pkg/service/codec/util"
	"github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/errorconst"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/jinzhu/gorm"
	"go.etcd.io/etcd/clientv3"
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

// Create ..
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
			return errorconst.ParamConfigNotExists.Error()
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
		err = mysql.Where("version=?", version).Delete(&db.ConfigurationHistory{}).Error
		if err != nil {
			tx.Rollback()
			return err
		}

		// 存历史版本
		err = mysql.Save(&history).Error
		if err != nil {
			tx.Rollback()
			return err
		}

		configuration.Content = param.Content
		configuration.Version = version
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
	zoneCode := param.ZoneCode
	// Get nodes data
	nodes, err := resource.Resource.GetAllAppNodeList(db.AppNode{
		Aid:      int(aid),
		Env:      env,
		ZoneCode: zoneCode,
	})
	if err != nil {
		return
	}

	app, err := resource.Resource.GetApp(int(aid))
	if err != nil {
		return
	}
	var configuration db.Configuration
	query := mysql.Where("id=?", param.ConfigurationID).Find(&configuration)
	if query.Error != nil {
		err = query.Error
		return
	}

	var syncFlag bool = false

	for _, node := range nodes {
		path := ""
		used := uint(0)
		synced := uint(0)
		takeEffect := uint(0)

		var status db.ConfigurationStatus
		var statusErr error
		status, statusErr = getConfigurationStatus(param.ConfigurationID, node.HostName)
		if statusErr == nil {
			path = status.ConfigurationPublish.FilePath
			used = status.Used
			synced = status.Synced
			takeEffect = status.TakeEffect
		}

		// value update
		if used == 0 {
			// Perform another synchronization check
			used = configurationUsed(status.ConfigurationID)
		}
		if synced == 0 || takeEffect == 0 {
			// Perform another synchronization check
			syncFlag = true
		}
		resp = append(resp, view.RespConfigInstanceItem{
			Env:                  node.Env,
			IP:                   node.IP,
			HostName:             node.HostName,
			DeviceID:             node.DeviceID,
			RegionCode:           node.RegionCode,
			RegionName:           node.RegionName,
			ZoneCode:             node.ZoneCode,
			ZoneName:             node.ZoneName,
			ConfigFilePath:       path,
			ConfigFileUsed:       used,
			ConfigFileSynced:     synced,
			ConfigFileTakeEffect: takeEffect,
			SyncAt:               time.Now(),
		})
	}
	// do more sync
	if !syncFlag {
		return
	}
	newSyncDataMap, err := configurationSyncedAndTakeEffect(app.AppName, env, zoneCode, configuration.Name, configuration.Format)
	if err != nil {
		return
	}
	var version = configuration.Version
	for k := range resp {
		if resp[k].ConfigFileSynced == 1 && resp[k].ConfigFileTakeEffect == 1 {
			continue
		}
		if newState, ok := newSyncDataMap[resp[k].HostName]; ok {
			if newState.Version == version {
				resp[k].ConfigFileSynced = 1
			}
			if newState.EffectVersion == version {
				resp[k].ConfigFileTakeEffect = 1
			}
		}
	}
	return
}

func getConfigurationStatus(configurationID uint, hostName string) (res db.ConfigurationStatus, err error) {
	query := mysql.Preload("ConfigurationPublish").Where("configuration_id=? and host_name=?", configurationID, hostName).Order("id desc", false).Find(&res)
	if query.Error != nil {
		err = query.Error
		return
	}
	return
}

func configurationUsed(configurationID uint) uint {
	// TODO supervisor systemd status
	return 0
}

func configurationSyncedAndTakeEffect(appName, env, zoneCode, filename, format string) (list map[string]view.ConfigurationStatus, err error) {
	list = make(map[string]view.ConfigurationStatus, 0)
	fileName := fmt.Sprintf("%s.%s", filename, format)
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	key := fmt.Sprintf("/%s/callback/%s/%s", cfg.Cfg.Configure.Prefix, appName, fileName)
	conn, err := clientproxy.ClientProxy.Conn(env, zoneCode)
	defer cancel()
	if err != nil {
		return
	}
	resp, err := conn.Get(ctx, key, clientv3.WithPrefix())
	if err != nil {
		return
	}
	if len(resp.Kvs) == 0 {
		err = errorconst.ParamConfigCallbackKvIsZero.Error()
		return
	}
	for _, item := range resp.Kvs {
		row := view.ConfigurationStatus{}
		if err := json.Unmarshal(item.Value, &row); err != nil {
			continue
		}
		// TODO 这里需要使用 http_proxy
		row.EffectVersion = getEffectVersion(fmt.Sprintf("http://%s:%s/debug/config", row.IP, row.HealthPort))
		list[row.Hostname] = row
	}
	return
}

func getEffectVersion(url string) (res string) {
	client := http.Client{Timeout: time.Duration(time.Second * 3)}
	resp, err := client.Get(url)
	if err != nil {
		return
	}
	defer func() {
		_ = resp.Body.Close()
	}()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return
	}
	return util.Md5Str(string(body))
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
	if err = publishETCD(view.ReqConfigPublish{
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

	tx := mysql.Begin()
	{
		// Publish record
		instanceListJSON, _ := json.Marshal(instanceList)

		var cp db.ConfigurationPublish
		cp.ApplyInstance = string(instanceListJSON)
		cp.ConfigurationID = configuration.ID
		cp.ConfigurationHistoryID = confHistory.ID
		cp.UID = uint(user.Uid)
		cp.FilePath = strings.Join([]string{cfg.Cfg.Configure.Dir, appInfo.AppName, "config", configuration.FileName()}, "/")
		if err = tx.Save(&cp).Error; err != nil {
			tx.Rollback()
			return
		}

		for _, instance := range instanceList {
			var cs db.ConfigurationStatus
			cs.ConfigurationID = configuration.ID
			cs.ConfigurationPublishID = cp.ID
			cs.HostName = instance
			cs.Used = 0
			cs.Synced = 0
			cs.TakeEffect = 0
			cs.CreatedAt = time.Now()
			cs.UpdateAt = time.Now()
			if err = tx.Save(&cs).Error; err != nil {
				tx.Rollback()
				return
			}
		}
		meta, _ := json.Marshal(cp)
		appevent.AppEvent.ConfgoFilePublishEvent(appInfo.Aid, appInfo.AppName, env, zoneCode, string(meta), user)

		tx.Commit()
	}

	return
}

func getPublishInstance(aid int, env string, zoneCode string) (instanceList []string, err error) {
	nodes, _ := resource.Resource.GetAllAppNodeList(db.AppNode{
		Aid:      aid,
		Env:      env,
		ZoneCode: zoneCode,
	})
	if len(nodes) == 0 {
		return instanceList, fmt.Errorf(errorconst.ParamNoInstances.Code().String() + errorconst.ParamNoInstances.Name())
	}
	for _, node := range nodes {
		instanceList = append(instanceList, node.HostName)
	}
	return instanceList, nil
}

func publishETCD(req view.ReqConfigPublish) (err error) {
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

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*3)
	defer cancel()
	conn, errConn := clientproxy.ClientProxy.Conn(req.Env, req.ZoneCode)
	if errConn != nil {
		return errConn
	}
	for _, hostName := range req.InstanceList {
		key := fmt.Sprintf("/%s/%s/%s/%s/static/%s/%s", cfg.Cfg.Configure.Prefix, hostName, req.AppName, req.Env, req.FileName, req.Port)
		// The migration is complete, only write independent ETCD of the configuration center
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
