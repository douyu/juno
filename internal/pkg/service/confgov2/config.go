package confgov2

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/douyu/juno/internal/pkg/service/agent"
	"github.com/douyu/juno/internal/pkg/service/app"
	"github.com/douyu/juno/internal/pkg/service/appevent"
	"github.com/douyu/juno/internal/pkg/service/clientproxy"
	"github.com/douyu/juno/internal/pkg/service/configresource"
	"github.com/douyu/juno/internal/pkg/service/openauth"
	"github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/internal/pkg/service/system"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/errorconst"
	"github.com/douyu/juno/pkg/model"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/juno/pkg/util"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/go-resty/resty/v2"
	"github.com/jinzhu/gorm"
	"github.com/labstack/echo/v4"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"golang.org/x/sync/errgroup"
	"net/http"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

const (
	// QueryAgentUsedStatus ..
	queryAgentUsedStatus = "/api/v1/conf/command_line/status"
)

const (
	DiffDefaultScene = 1 //默认最近2版本对比
	DiffSpecifyScene = 2 //指定版本与最新版本对比
)

func List(param view.ReqListConfig) (resp view.RespListConfig, err error) {
	var app db.AppInfo

	resp = make(view.RespListConfig, 0)
	list := make([]db.Configuration, 0)

	err = mysql.Where("app_name = ?", param.AppName).First(&app).Error
	if err != nil {
		return resp, err
	}

	err = mysql.Select("id, aid, name, format, env, zone, created_at, updated_at, published_at").
		Where("aid = ?", app.Aid).
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

	if configuration.LockUid != 0 {
		var u db.User
		err = mysql.Where("uid = ?", configuration.LockUid).First(&u).Error
		if err != nil {
			return
		}

		resp.CurrentEditUser = &view.User{
			Uid:      u.Uid,
			Username: u.Username,
			Nickname: u.Nickname,
			Email:    u.Email,
			Avatar:   u.Avatar,
		}
	}

	return
}

// Create ..
func Create(c echo.Context, param view.ReqCreateConfig) (resp view.RespDetailConfig, err error) {
	var app db.AppInfo
	var appNode db.AppNode

	// 验证应用是否存在
	err = mysql.Where("app_name = ?", param.AppName).First(&app).Error
	if err != nil {
		return
	}

	// 验证Zone-env是否存在
	{
		envZoneExists := false
		k8sCluster, err := system.System.Setting.K8SClusterSetting()
		if err != nil {
			xlog.Error("get k8s cluster setting failed", xlog.String("err", err.Error()))
		} else {
			for _, cluster := range k8sCluster.List {
				if cluster.ZoneCode == param.Zone &&
					util.FindIndex(cluster.Env, param.Env, func(a, b interface{}) bool { return a.(string) == b.(string) }) > -1 {
					envZoneExists = true
					break
				}
			}
		}

		if !envZoneExists {
			err = mysql.Where("env = ? and zone_code = ?", param.Env, param.Zone).First(&appNode).Error
			if err != nil {
				if gorm.IsRecordNotFoundError(err) {
					err = fmt.Errorf("该应用不存在该机房-环境")
				}
				return resp, err
			}
		}
	}
	configuration := db.Configuration{
		AID:    uint(app.Aid),
		Name:   param.FileName, // 不带后缀
		Format: string(param.Format),
		Env:    param.Env,
		Zone:   param.Zone,
	}

	u := user.GetUser(c)
	authWithOpenAPI, accessToken := openauth.GetAccessToken(c)
	if authWithOpenAPI {
		// 获取Open Auth信息
		configuration.AccessTokenID = accessToken.ID
	} else {
		if u != nil && u.Uid != 0 {
			configuration.UID = uint(u.Uid)
		} else {
			err = fmt.Errorf("无法获取授权对象信息")
			return
		}
	}

	tx := mysql.Begin()
	{
		// check if name exists
		exists := 0
		err = tx.Model(&db.Configuration{}).Where("aid = ?", app.Aid).
			Where("env = ?", param.Env).
			Where("name = ?", param.FileName).
			Where("format = ?", param.Format).
			Count(&exists).Error
		if err != nil {
			tx.Rollback()
			return
		}

		if exists != 0 {
			tx.Rollback()
			return resp, fmt.Errorf("已存在同名配置")
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

	metadata, _ := json.Marshal(&configuration)
	if authWithOpenAPI {
		appevent.AppEvent.OpenAPIConfigFileCreate(app.Aid, app.AppName, configuration.Zone, configuration.Env,
			string(metadata), accessToken)
	} else if u != nil {
		appevent.AppEvent.ConfgoFileCreateEvent(app.Aid, app.AppName, configuration.Zone, configuration.Env,
			string(metadata), u)
	}

	return
}

// Update ..
func Update(c echo.Context, param view.ReqUpdateConfig) (err error) {
	var configuration db.Configuration
	var app db.AppInfo

	err = mysql.Where("id = ?", param.ID).First(&configuration).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return errorconst.ParamConfigNotExists.Error()
		}
		return err
	}

	err = mysql.Where("aid = ?", configuration.AID).First(&app).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return errorconst.AppNotExists.Error()
		}
		return err
	}

	newContent := configresource.FillConfigResource(param.Content)
	oldContent := configresource.FillConfigResource(configuration.Content)

	err = CheckSyntax(model.ConfigFormat(configuration.Format), newContent)
	if err != nil {
		return
	}

	// 计算本次版本号
	version := util.Md5Str(newContent)
	if util.Md5Str(oldContent) == version {
		return fmt.Errorf("保存失败，本次无更新")
	}

	history := db.ConfigurationHistory{
		ConfigurationID: configuration.ID,
		ChangeLog:       param.Message,
		Content:         param.Content,
		Version:         version,
	}

	// 授权对象
	ok, accessToken := openauth.GetAccessToken(c)
	u := user.GetUser(c)
	if ok {
		// 获取Open Auth信息
		history.AccessTokenID = accessToken.ID
		eventMetadata, _ := json.Marshal(map[string]interface{}{
			"id":               history.ID,
			"access_token_id":  history.AccessTokenID,
			"uid":              history.UID,
			"configuration_id": history.ConfigurationID,
			"change_log":       history.ChangeLog,
			"version":          history.Version,
			"name":             configuration.Name,
			"format":           configuration.Format,
		})

		appevent.AppEvent.OpenAPIConfigFileUpdate(int(configuration.AID), app.AppName, configuration.Zone, configuration.Env,
			string(eventMetadata), accessToken)
	} else {
		if u != nil && u.Uid != 0 {
			history.UID = uint(u.Uid)
			// 配置内容可能会很长，metadata会被前端完整获取到，不保存配置内容
			eventMetadata, _ := json.Marshal(map[string]interface{}{
				"id":               history.ID,
				"access_token_id":  history.AccessTokenID,
				"uid":              history.UID,
				"configuration_id": history.ConfigurationID,
				"change_log":       history.ChangeLog,
				"version":          history.Version,
				"name":             configuration.Name,
				"format":           configuration.Format,
			})

			appevent.AppEvent.ConfgoFileUpdateEvent(int(configuration.AID), app.AppName, configuration.Zone, configuration.Env,
				string(eventMetadata), user.GetUser(c))

		} else {
			err = fmt.Errorf("无法获取授权对象信息")
			return err
		}
	}

	// 配置/资源 关联关系
	resourceValues, err := parseConfigResourceValuesFromConfig(history)
	if err != nil {
		return
	}

	tx := mysql.Begin()
	{
		err = tx.Where("id = ?", param.ID).First(&configuration).Error
		if err != nil {
			tx.Rollback()
			return
		}

		if configuration.LockUid != 0 && configuration.LockUid != uint(u.Uid) {
			tx.Rollback()
			return fmt.Errorf("当前有其他人正在编辑，更新失败")
		}

		err = tx.Where("version=?", version).Delete(&db.ConfigurationHistory{}).Error
		if err != nil {
			tx.Rollback()
			return err
		}

		// 存历史版本
		err = tx.Save(&history).Error
		if err != nil {
			tx.Rollback()
			return err
		}

		// 存资源配置关联
		for _, value := range resourceValues {
			err = tx.Save(&db.ConfigurationResourceRelation{
				ConfigurationHistoryID: history.ID,
				ConfigResourceValueID:  value.ID,
			}).Error
			if err != nil {
				tx.Rollback()
				return
			}
		}

		configuration.Content = param.Content
		configuration.Version = version
		err = tx.Save(&configuration).Error
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

// parseConfigResourceValuesFromConfig ..
func parseConfigResourceValuesFromConfig(history db.ConfigurationHistory) ([]db.ConfigResourceValue, error) {
	var resourceValues []db.ConfigResourceValue
	resources := configresource.ParseResourceFromConfig(history.Content)
	resourceValueIds := make([]uint, 0) // 版本就是资源值ID，全局唯一
	for _, res := range resources {
		resourceValueIds = append(resourceValueIds, res.Version)
	}

	err := mysql.Where("id in (?)", resourceValueIds).Find(&resourceValues).Error
	if err != nil {
		xlog.Error("confgov2.parseConfigResourceValuesFromConfig", xlog.String("error", "query resource-values failed:"+err.Error()))
		return nil, err
	}

	return resourceValues, nil
}

// Instances ..
func Instances(param view.ReqConfigInstanceList) (resp view.RespConfigInstanceList, err error) {
	// input params
	var (
		env      = param.Env
		zoneCode = param.ZoneCode
	)
	// process
	var (
		configuration db.Configuration
		// configurationHistory db.ConfigurationHistory
		changeLog string
		version   string

		app   db.AppInfo
		nodes []db.AppNode

		instanceNotPublished = make(view.RespConfigInstanceList, 0)
	)
	// get configuration info
	query := mysql.Where("id=?", param.ConfigurationID).Find(&configuration)
	if query.Error != nil {
		err = query.Error
		return
	}
	// get app info
	if app, err = resource.Resource.GetApp(configuration.AID); err != nil {
		return
	}

	xlog.Debug("Instances", xlog.String("step", "app"), zap.Any("app", app))

	// get all node list
	if nodes, err = resource.Resource.GetAllAppNodeList(db.AppNode{
		Aid:      int(configuration.AID),
		Env:      env,
		ZoneCode: zoneCode,
	}); err != nil {
		return
	}

	xlog.Debug("Instances", xlog.String("step", "nodes"), zap.Any("nodes", nodes))

	filePath := ""

	nodesMap := make(map[string]db.AppNode, 0)

	for _, node := range nodes {
		used := uint(0)
		synced := uint(0)
		takeEffect := uint(0)

		var status db.ConfigurationStatus
		var statusErr error
		status, statusErr = getConfigurationStatus(param.ConfigurationID, node.HostName)
		if statusErr != nil {
			xlog.Error("Instances", xlog.String("step", "nodes"), zap.Any("nodes", nodes), zap.String("statusErr", statusErr.Error()))

			instanceNotPublished = append(instanceNotPublished, view.RespConfigInstanceItem{
				Env:                  node.Env,
				IP:                   node.IP,
				HostName:             node.HostName,
				DeviceID:             node.DeviceID,
				RegionCode:           node.RegionCode,
				RegionName:           node.RegionName,
				ZoneCode:             node.ZoneCode,
				ZoneName:             node.ZoneName,
				ConfigFilePath:       filePath,
				ConfigFileUsed:       used,
				ConfigFileSynced:     synced,
				ConfigFileTakeEffect: takeEffect,
				SyncAt:               "",
				Version:              version,
				ChangeLog:            changeLog,
			})

			continue
		}

		nodesMap[node.HostName] = node

		filePath = status.ConfigurationPublish.FilePath
		used = status.Used
		synced = status.Synced
		takeEffect = status.TakeEffect

		resp = append(resp, view.RespConfigInstanceItem{
			ConfigurationStatusID: status.ID,
			Env:                   node.Env,
			IP:                    node.IP,
			HostName:              node.HostName,
			DeviceID:              node.DeviceID,
			RegionCode:            node.RegionCode,
			RegionName:            node.RegionName,
			ZoneCode:              node.ZoneCode,
			ZoneName:              node.ZoneName,
			ConfigFilePath:        filePath,
			ConfigFileUsed:        used,
			ConfigFileSynced:      synced,
			ConfigFileTakeEffect:  takeEffect,
			SyncAt:                "",
			Version:               version,
			ChangeLog:             changeLog,
		})
	}

	eg := errgroup.Group{}
	respMtx := sync.Mutex{}

	eg.Go(func() error {
		respNew, err := syncUsedStatus(nodes, resp, env, zoneCode, filePath)
		if err != nil {
			xlog.Error("syncUsedStatus", xlog.Any("err", err.Error()))
			return errorconst.ConfigInstanceSyncUsedStatusError.Error()
		}
		respMtx.Lock()
		defer respMtx.Unlock()

		resp = respNew

		return nil
	})

	eg.Go(func() error {
		respNew, err := syncPublishStatus(app.AppName, env, zoneCode, configuration, nodesMap, resp)
		if err != nil {
			xlog.Error("syncPublishStatus", xlog.Any("err", err.Error()))
			return errorconst.ConfigInstanceSyncPublishStatusError.Error()
		}
		respMtx.Lock()
		defer respMtx.Unlock()

		resp = respNew

		return nil
	})

	eg.Go(func() error {
		respNew, err := syncTakeEffectStatus(app.AppName, env, zoneCode, app.GovernPort, configuration, nodesMap, resp)

		respMtx.Lock()
		defer respMtx.Unlock()
		resp = respNew

		if err != nil {
			xlog.Error("syncTakeEffectStatus", xlog.Any("err", err.Error()))
			return errorconst.ConfigInstanceErrorSyncTakeEffectStatusError.Error()
		}

		return nil
	})

	err = eg.Wait()

	resp = append(resp, instanceNotPublished...)

	return
}

func assemblyJunoAgent(nodes []db.AppNode) []view.JunoAgent {
	res := make([]view.JunoAgent, 0)
	for _, node := range nodes {
		res = append(res, view.JunoAgent{HostName: node.HostName, IPPort: node.IP + fmt.Sprintf(":%d", cfg.Cfg.Agent.Port)})
	}
	return res
}

// Publish ..
func Publish(param view.ReqPublishConfig, c echo.Context) (err error) {
	// Complete configuration release logic
	u := user.GetUser(c)
	authWithToken, token := openauth.GetAccessToken(c)
	if (u == nil || u.Uid == 0) && !authWithToken {
		return fmt.Errorf("无法获取授权信息")
	}

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

	// resource filter
	content = configresource.FillConfigResource(content)

	// Get nodes data
	var instanceList = param.HostName
	var totalInstanceList []string
	if totalInstanceList, err = getPublishInstance(aid, env, zoneCode); err != nil {
		return
	}

	if len(totalInstanceList) == 0 && !param.PubK8S {
		return fmt.Errorf("未选择发布实例或集群")
	}

	// check node list valid
	for _, hostName := range instanceList {
		exists := false
		for _, item := range totalInstanceList {
			if item == hostName {
				exists = true
				break
			}
		}

		if !exists {
			return fmt.Errorf("机器 %s 不存在", hostName)
		}
	}

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
		PubK8S:       param.PubK8S,
	}); err != nil {
		return
	}
	// Publish record
	instanceListJSON, _ := json.Marshal(instanceList)

	var cp db.ConfigurationPublish
	cp.ApplyInstance = string(instanceListJSON)
	cp.ConfigurationID = configuration.ID
	cp.ConfigurationHistoryID = confHistory.ID
	if authWithToken {
		cp.AccessTokenID = token.ID
	} else {
		cp.UID = uint(u.Uid)
	}
	_, cp.FilePath = genConfigurePath(appInfo.AppName, configuration.FileName())

	tx := mysql.Begin()
	{
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

		tx.Commit()
	}

	meta, _ := json.Marshal(map[string]interface{}{
		"id":                       cp.ID,
		"uid":                      cp.UID,
		"access_token_id":          cp.AccessTokenID,
		"configuration_id":         cp.ConfigurationID,
		"configuration_history_id": cp.ConfigurationHistoryID,
		"apply_instance":           cp.ApplyInstance,
		"file_path":                cp.FilePath,
		"created_at":               cp.CreatedAt,
		"user":                     cp.User,
		"configuration":            cp.Configuration,
		"configuration_history":    cp.ConfigurationHistory,
		"name":                     configuration.Name,
		"format":                   configuration.Format,
	})
	if authWithToken {
		appevent.AppEvent.OpenAPIConfigPublish(appInfo.Aid, appInfo.AppName, env, zoneCode, string(meta), instanceList, token)
	} else {
		appevent.AppEvent.ConfgoFilePublishEvent(appInfo.Aid, appInfo.AppName, env, zoneCode, string(meta), instanceList, u)
	}

	return
}

func genConfigurePath(appName string, filename string) (pathArr []string, pathStr string) {
	dirs := cfg.Cfg.Configure.Dirs
	for k, dir := range dirs {
		path := filepath.Join(dir, appName, "config", filename)
		pathArr = append(pathArr, path)
		if k == 0 {
			pathStr = path
		} else {
			pathStr = pathStr + ";" + path
		}
	}
	return
}

func getPublishInstance(aid int, env string, zoneCode string) (instanceList []string, err error) {
	nodes, _ := resource.Resource.GetAllAppNodeList(db.AppNode{
		Aid:      aid,
		Env:      env,
		ZoneCode: zoneCode,
	})
	for _, node := range nodes {
		instanceList = append(instanceList, node.HostName)
	}
	return instanceList, nil
}

func configurationHeader(content, format, version string) string {
	if format == "toml" {
		headerVersion := fmt.Sprintf(`juno_configuration_version = "%s"`, version)
		content = fmt.Sprintf("%s\n%s", headerVersion, content)
	}
	return content
}

func publishETCD(req view.ReqConfigPublish) (err error) {

	content := configurationHeader(req.Content, req.Format, req.Version)

	xlog.Debug("func publishETCD", zap.String("content", content))

	paths, _ := genConfigurePath(req.AppName, req.FileName)
	data := view.ConfigurationPublishData{
		Content: content,
		Metadata: view.Metadata{
			Timestamp: time.Now().Unix(),
			Format:    req.Format,
			Version:   req.Version,
			Paths:     paths,
		},
	}
	var buf []byte
	if buf, err = json.Marshal(data); err != nil {
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*3)
	defer cancel()

	for _, hostName := range req.InstanceList {
		for _, prefix := range cfg.Cfg.Configure.Prefixes {
			key := fmt.Sprintf("/%s/%s/%s/%s/static/%s/%s", prefix, hostName, req.AppName, req.Env, req.FileName, req.Port)
			// The migration is complete, only write independent ETCD of the configuration center
			_, err = clientproxy.ClientProxy.DefaultEtcdPut(view.UniqZone{Env: req.Env, Zone: req.ZoneCode}, ctx, key, string(buf))
			if err != nil {
				return
			}

			// for k8s
			clusterKey := fmt.Sprintf("/%s/cluster/%s/%s/static/%s", prefix, req.AppName, req.Env, req.FileName)
			_, err = clientproxy.ClientProxy.DefaultEtcdPut(view.UniqZone{Env: req.Env, Zone: req.ZoneCode}, ctx, clusterKey, string(buf))
			if err != nil {
				return
			}
		}
	}

	if req.PubK8S {
		for _, prefix := range cfg.Cfg.Configure.Prefixes {
			// for k8s
			clusterKey := fmt.Sprintf("/%s/cluster/%s/%s/static/%s", prefix, req.AppName, req.Env, req.FileName)
			_, err = clientproxy.ClientProxy.DefaultEtcdPut(view.UniqZone{Env: req.Env, Zone: req.ZoneCode}, ctx, clusterKey, string(buf))
			if err != nil {
				return
			}
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
		query := query.Preload("AccessToken").
			Preload("User").Limit(param.Size).Offset(offset).Order("id desc").Find(&list)
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
			UID:             item.UID,
			AccessTokenID:   item.AccessTokenID,
			ConfigurationID: item.ConfigurationID,
			Version:         item.Version,
			CreatedAt:       item.CreatedAt,
			ChangeLog:       item.ChangeLog,
		}

		configItem.UID = item.UID

		if item.AccessToken != nil {
			configItem.AccessTokenName = item.AccessToken.Name
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
func Diff(configID, historyID uint, scene int) (resp view.RespDiffConfig, err error) {
	modifiedConfig := db.ConfigurationHistory{}
	err = mysql.Preload("Configuration").Preload("User").
		Where("id = ?", historyID).First(&modifiedConfig).Error
	if err != nil {
		return
	}
	originConfig := db.ConfigurationHistory{}

	switch scene {
	case DiffSpecifyScene:
		err = mysql.Preload("Configuration").Preload("User").
			Where("configuration_id = ?", configID).Order("id desc").First(&originConfig).Error
		//是的发布版本在右边
		indexConfig := modifiedConfig
		modifiedConfig = originConfig
		originConfig = indexConfig
		break
	default:
		err = mysql.Preload("Configuration").Preload("User").
			Where("id < ? and configuration_id = ?", historyID, configID).Order("id desc").First(&originConfig).Error
		break
	}

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

// DiffVersion ..
func DiffVersion(param view.ReqDiffConfig) (resp view.RespDiffConfig, err error) {
	appInfo := &db.AppInfo{}
	serviceConfiguration := db.ConfigurationHistory{}

	err = mysql.Where("app_name = ?", param.AppName).First(appInfo).Error
	if err != nil {
		xlog.Error("DiffVersion", xlog.String("step", "mysql.app"), xlog.String("err", err.Error()))
		return resp, err
	}

	serviceVersion := param.ServiceVersion
	aid := appInfo.Aid
	env := param.Env
	publishVersion := param.PublishVersion

	xlog.Info("DiffVersion",
		xlog.String("step", "DiffVersion——info"),
		xlog.String("serviceVersion", serviceVersion),
		xlog.Int("aid", aid),
		xlog.String("env", env),
		xlog.Any("publishVersion", publishVersion))

	configurationInfo := resource.Resource.GetConfigureByVersion(aid, env, param.PublishVersion)
	if configurationInfo.ID <= 0 {
		xlog.Error("DiffReleaseConfig6", xlog.String("step", "mysql.Where"), xlog.Any("param", param))
		return
	}

	xlog.Info("DiffVersion1", xlog.Any("configurationInfo", configurationInfo))

	err = mysql.Where("configuration_id = ? && version = ?", configurationInfo.ID, serviceVersion).First(&serviceConfiguration).Error
	if err != nil {
		xlog.Error("DiffVersion101", xlog.String("step", "mysql.Where"), xlog.String("err", err.Error()))
		return
	}

	xlog.Info("DiffVersion67", xlog.Any("serviceConfiguration", serviceConfiguration))

	configID := configurationInfo.ID
	historyID := serviceConfiguration.ID

	xlog.Info("DiffVersion767", xlog.Any("configID", configID), xlog.Any("historyID", historyID))
	return Diff(configID, historyID, DiffSpecifyScene)

}

// DiffReleaseConfig ..
func DiffReleaseConfig(param view.ReqDiffReleaseConfig) (resp view.RespDiffReleaseConfig, err error) {
	if len(param.IpList) == 0 {
		err = errors.New("param.IpList 长度不合法")
		xlog.Error("DiffReleaseConfig1", xlog.String("step", "param.IpList.leng"), xlog.String("err", err.Error()))
		return
	}

	uri := cfg.Cfg.ClientProxy.HttpRouter.GovernConfig
	ip := param.IpList[0]
	appName := param.AppName
	env := param.Env
	where := db.AppNode{
		Env:     env,
		IP:      ip,
		AppName: appName,
	}
	appNodeInfo, err := resource.Resource.GetAppNode(where)
	if err != nil {
		xlog.Error("DiffReleaseConfig2", xlog.String("step", "resource.Resource.GetAppNode(where)"), xlog.Any("where", where), xlog.Any("param", param), xlog.String("err", err.Error()))
		return
	}

	// get app info
	appInfo, err := resource.Resource.GetApp(appNodeInfo.Aid)
	if err != nil {
		xlog.Error("DiffReleaseConfig3", xlog.String("step", "resource.Resource.GetApp"), xlog.String("err", err.Error()), xlog.Any("param", param))
		return
	}

	//通过http方式获取指定ip+端口的服务正在使用的配置版本
	governPort := appInfo.GovernPort
	governPort = app.GovernPort(governPort, env, appNodeInfo.ZoneCode, appName, appNodeInfo.HostName)
	address := ip + ":" + governPort
	agentQuestResp, err := clientproxy.ClientProxy.HttpGet(view.UniqZone{Env: env, Zone: appNodeInfo.ZoneCode}, view.ReqHTTPProxy{
		Address: address,
		URL:     uri,
	})
	if err != nil {
		xlog.Error("DiffReleaseConfig4", xlog.String("step", " clientproxy.ClientProxy.HttpGet"), xlog.String("err", err.Error()), xlog.Any("param", param))
		return
	}

	//通过etcd 方式获取改版本发布的配置
	var out struct {
		JunoConfigurationVersion string `json:"juno_configuration_version"`
	}
	if err = json.Unmarshal(agentQuestResp.Body(), &out); err != nil {
		xlog.Error("DiffReleaseConfig5", xlog.String("step", "json.Unmarshal"), xlog.String("err", err.Error()), xlog.String("agentQuestResp.Body()", string(agentQuestResp.Body())), xlog.Any("param", param))
		return
	}

	effectVersion := out.JunoConfigurationVersion
	xlog.Info("DiffReleaseConfig56", xlog.String("agentQuestResp", string(agentQuestResp.Body())), xlog.String("effectVersion", effectVersion), xlog.Any("param", param), xlog.Any("appNodeInfo", appNodeInfo), xlog.Any("appInfo", appInfo))

	configuration := resource.Resource.GetConfigureByVersion(appNodeInfo.Aid, appNodeInfo.Env, effectVersion)
	if configuration.ID <= 0 {
		xlog.Error("DiffReleaseConfig6", xlog.String("step", "mysql.Where"), xlog.Any("param", param), xlog.String("effectVersion", effectVersion), xlog.Any("appNodeInfo", appNodeInfo))
		return
	}

	historyInfo, err := getConfigurationHistory(configuration.ID)
	if err != nil {
		xlog.Error("DiffReleaseConfig7", xlog.String("step", "DiffReleaseConfig6.getConfigurationHistory"), xlog.String("err", err.Error()), xlog.Any("param", param))
		return
	}
	publishVersion := historyInfo.Version

	xlog.Info("DiffReleaseConfig7",
		xlog.String("step", "publishEffectVersion"),
		xlog.String("effectVersion", effectVersion),
		xlog.String("address", address),
		xlog.String("uri", uri),
		xlog.Any("param", param),
		xlog.String("agentQuestResp.Body()", string(agentQuestResp.Body())),
		xlog.String("publishVersion", publishVersion))

	diffUrlList := view.DiffUrlList{}
	resp.HasNew = false
	if effectVersion != "" && effectVersion == publishVersion {
		resp.HasNew = true
	}
	rootUrl := strings.TrimRight(cfg.Cfg.Server.Http.RootUrl, "/")
	diffUrlList.Name = configuration.Name
	diffUrlList.DiffUrl = fmt.Sprintf("%s/app?aid=%d&appName=%s&env=%s&tab=confgo&publishVersion=%s&serviceVersion=%s", rootUrl, appNodeInfo.Aid, appNodeInfo.AppName, appNodeInfo.Env, publishVersion, effectVersion)
	resp.DiffUrlList = append(resp.DiffUrlList, diffUrlList)
	return
}

// DiffReleaseConfigByFile ..
func DiffReleaseConfigByFile(param view.ReqDiffReleaseConfig) (resp view.RespDiffReleaseConfig, err error) {
	if len(param.IpList) == 0 {
		err = errors.New("param.IpList 长度不合法")
		xlog.Error("DiffReleaseConfigByFile1", xlog.String("step", "param.IpList.leng"), xlog.Any("param", param), xlog.String("err", err.Error()))
		return
	}

	ip := param.IpList[0]
	appName := param.AppName
	env := param.Env
	hostName := "" //后续追加预留
	uri := cfg.Cfg.ClientProxy.HttpRouter.GovernConfig

	// get app info
	appInfo, err := resource.Resource.GetApp(param.AppName)
	if err != nil {
		xlog.Error("DiffReleaseConfigByFile2", xlog.String("step", "resource.Resource.GetApp"), xlog.Any("param", param), xlog.String("err", err.Error()))
		return
	}

	configuration := db.Configuration{}
	pathInfo := strings.Split(param.ConfigName, ".")
	if len(pathInfo) != 2 {
		xlog.Error("DiffReleaseConfigByFile2.5", xlog.String("step", "strings.Spli"), xlog.Any("param", param), xlog.String("param.ConfigName", param.ConfigName), xlog.String("err", "pathInfo len too less"))
		return
	}

	err = mysql.Where("aid = ? && env = ? && name = ? && format = ?", appInfo.Aid, param.Env, pathInfo[0], pathInfo[1]).First(&configuration).Error
	if err != nil {
		xlog.Error("DiffReleaseConfigByFile3", xlog.String("step", "mysql.Where"), xlog.Any("param", param), xlog.String("err", err.Error()))
		return
	}

	//通过http方式获取指定ip+端口的服务正在使用的配置版本
	governPort := appInfo.GovernPort
	governPort = app.GovernPort(governPort, env, configuration.Zone, appName, hostName)
	address := ip + ":" + governPort
	agentQuestResp, err := clientproxy.ClientProxy.HttpGet(view.UniqZone{Env: env, Zone: configuration.Zone}, view.ReqHTTPProxy{
		Address: address,
		URL:     uri,
	})
	if err != nil {
		xlog.Error("DiffReleaseConfigByFile4", xlog.String("step", " clientproxy.ClientProxy.HttpGet"), xlog.Any("param", param), xlog.String("err", err.Error()))
		return
	}

	//通过etcd 方式获取改版本发布的配置
	var out struct {
		JunoConfigurationVersion string `json:"juno_configuration_version"`
	}
	if err = json.Unmarshal(agentQuestResp.Body(), &out); err != nil {
		xlog.Error("DiffReleaseConfigByFile52", xlog.String("step", "json.Unmarshal"), xlog.Any("param", param), xlog.String("err", err.Error()), xlog.String("agentQuestResp.Body()", string(agentQuestResp.Body())))
		return
	}

	effectVersion := out.JunoConfigurationVersion

	historyInfo, err := getConfigurationHistory(configuration.ID)
	if err != nil {
		xlog.Error("DiffReleaseConfigByFile5", xlog.String("step", " DiffReleaseConfig6.getConfigurationHistory"), xlog.Any("param", param), xlog.String("err", err.Error()))
		return
	}
	publishVersion := historyInfo.Version

	xlog.Info("DiffReleaseConfigByFile66",
		xlog.String("step", "publishEffectVersion"),
		xlog.String("effectVersion", effectVersion),
		xlog.String("address", address),
		xlog.String("uri", uri),
		xlog.Any("param", param),
		xlog.String("agentQuestResp.Body()", string(agentQuestResp.Body())),
		xlog.String("publishVersion", publishVersion))

	diffUrlList := view.DiffUrlList{}
	resp.HasNew = false
	if effectVersion != "" && effectVersion == publishVersion {
		resp.HasNew = true

	}
	rootUrl := strings.TrimRight(cfg.Cfg.Server.Http.RootUrl, "/")
	diffUrlList.Name = configuration.Name
	diffUrlList.DiffUrl = fmt.Sprintf("%s/app?aid=%d&appName=%s&env=%s&tab=confgo&publishVersion=%s&serviceVersion=%s", rootUrl, appInfo.Aid, appInfo.AppName, param.Env, publishVersion, effectVersion)
	resp.DiffUrlList = append(resp.DiffUrlList, diffUrlList)
	return
}

// Delete ..
func Delete(c echo.Context, id uint) (err error) {
	var config db.Configuration

	u := user.GetUser(c)
	authWithAccessToken, token := openauth.GetAccessToken(c)
	if (u == nil || u.Uid == 0) && !authWithAccessToken {
		return fmt.Errorf("无法获取授权信息")
	}

	err = mysql.Preload("App").Where("id = ?", id).First(&config).Error
	if err != nil {
		return
	}

	err = mysql.Delete(&db.Configuration{}, "id = ?", id).Error
	if err != nil {
		return err
	}

	metadata, _ := json.Marshal(&map[string]interface{}{
		"id":        config.ID,
		"aid":       config.AID,
		"name":      config.Name,
		"format":    config.Format,
		"env":       config.Env,
		"zone":      config.Zone,
		"version":   config.Version,
		"uid":       config.UID,
		"createdAt": config.CreatedAt,
	})
	if authWithAccessToken {
		appevent.AppEvent.OpenAPIConfigDelete(int(config.AID), config.App.AppName, config.Zone, config.Env, string(metadata), token)
	} else {
		appevent.AppEvent.ConfgoFileDeleteEvent(int(config.AID), config.App.AppName, config.Zone, config.Env, string(metadata), u)
	}

	return
}

func ReadInstanceConfig(param view.ReqReadInstanceConfig) (configContentList []view.RespReadInstanceConfigItem, err error) {
	var config db.Configuration
	var app db.AppInfo
	var node db.AppNode

	err = mysql.Where("id = ?", param.ConfigID).First(&config).Error
	if err != nil {
		return
	}

	err = mysql.Where("aid = ?", config.AID).First(&app).Error
	if err != nil {
		return
	}

	err = mysql.Where("app_name = ?", app.AppName).Where("host_name = ?", param.HostName).First(&node).Error
	if err != nil {
		return
	}

	zone := view.UniqZone{
		Env:  config.Env,
		Zone: config.Zone,
	}

	pathArr, _ := genConfigurePath(app.AppName, config.FileName())

	var eg errgroup.Group
	for _, configPath := range pathArr {
		fileName := configPath
		eg.Go(func() error {
			var err error
			var plainText string
			var resp *resty.Response
			var configItem = view.RespReadInstanceConfigItem{
				ConfigID: config.ID,
				FileName: fileName,
			}
			var fileRead struct {
				Code int    `json:"code"`
				Msg  string `json:"msg"`
				Data struct {
					Content string `json:"content"`
				} `json:"data"`
			}

			req := view.ReqHTTPProxy{
				Address: fmt.Sprintf("%s:%d", node.IP, cfg.Cfg.Agent.Port),
				URL:     "/api/agent/file",
				Type:    http.MethodGet,
				Params: map[string]string{
					"file_name": fileName,
				},
			}
			resp, err = clientproxy.ClientProxy.HttpGet(zone, req)
			if err != nil {
				goto End
			}

			err = json.Unmarshal(resp.Body(), &fileRead)
			if err != nil {
				goto End
			}

			if fileRead.Code != 200 {
				err = fmt.Errorf("%v", fileRead)
				goto End
			}

			plainText, err = agent.Decrypt(fileRead.Data.Content)
			if err != nil {
				err = errors.Wrap(err, "config file decrypt failed")
				goto End
			}

		End:
			if err != nil {
				configItem.Error = err.Error()
			}
			configItem.Content = plainText
			configContentList = append(configContentList, configItem)

			return nil
		})
	}

	// ignore error
	_ = eg.Wait()

	return
}

func GetAllConfigText() (list []db.Configuration, err error) {
	list = make([]db.Configuration, 0)
	err = mysql.Find(&list).Error
	return
}
