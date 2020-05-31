package resource

import (
	"encoding/json"
	"errors"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/douyu/juno/pkg/service/appevent"

	"github.com/douyu/juno/pkg/invoker"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/event"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/store/gorm"
	log "github.com/sirupsen/logrus"
)

// 根据ID或者APPNAME获取APP信息
// 只支持int和string查询
func (r *resource) GetApp(identify interface{}) (resp db.AppInfo, err error) {
	switch v := identify.(type) {
	case string:
		err = r.DB.Where("app_name = ?", v).Find(&resp).Error
	case int:
		err = r.DB.Where("aid=?", v).Find(&resp).Error
	default:
		err = errors.New("identify type error")
	}
	return
}

// 设置APP信息
func (a *resource) PutApp(item db.AppInfo, user *db.User) (err error) {
	var count int
	now := time.Now().Unix()

	// 验证是否数据有修改
	md5Str := item.MD5String()
	a.DB.Table("app_change_map").Where("app_name = ? AND md5 = ?", item.AppName, md5Str).Count(&count)

	// app未更新，直接返回
	if count > 0 {
		return
	}

	err = a.DB.Table("app_change_map").Where("app_name = ?", item.AppName).Delete(&db.AppChangeMap{}).Error
	if err != nil {
		log.Error("mysql query error", err.Error())
		return
	}

	a.DB.Create(&db.AppChangeMap{
		AppName:   item.AppName,
		Md5:       md5Str,
		UpdatedAt: time.Now().Unix(),
	})
	item.CreateTime = now
	item.UpdateTime = now
	item.CreatedBy = user.Uid
	// 更新应用信息
	a.updateAppInfo(&item, user)
	// 更新负责人
	a.updateAppUser(item.AppName, item.Users)
	return
}

// 设置APP信息
func (r *resource) CreateApp(item db.AppInfo, user *db.User) (err error) {
	var info db.AppInfo
	err = r.DB.Where("app_name = ?", item.AppName).Find(&info).Error
	// 返回系统错误
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return
	}
	// 已经存在该应用，报错
	if info.Aid > 0 {
		err = errors.New("app name is exist")
		return
	}

	item.CreateTime = time.Now().Unix()
	item.UpdateTime = time.Now().Unix()
	item.CreatedBy = user.Uid

	err = r.DB.Create(&item).Error
	meta, _ := json.Marshal(item)
	appevent.AppEvent.AppCreateEvent(info.Aid, info.AppName, string(meta), user)
	return
}

func (r *resource) UpdateApp(item db.AppInfo, user *db.User) (err error) {
	var info db.AppInfo
	err = r.DB.Where("aid = ?", item.Aid).Find(&info).Error
	// 返回系统错误
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return
	}
	// 已经存在该应用，报错
	if info.Aid == 0 {
		err = errors.New("app is not exist")
		return
	}
	item.UpdateTime = time.Now().Unix()
	err = r.DB.Model(db.AppInfo{}).Where("aid = ?", item.Aid).UpdateColumns(&item).Error
	meta, _ := json.Marshal(item)
	appevent.AppEvent.AppUpdateEvent(info.Aid, info.AppName, string(meta), user)
	return
}

func (r *resource) DeleteApp(item db.AppInfo, user *db.User) (err error) {
	var info db.AppInfo
	err = r.DB.Where("aid = ?", item.Aid).Find(&info).Error
	// 返回系统错误
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return
	}
	// 已经存在该应用，报错
	if info.Aid == 0 {
		err = errors.New("app is not exist")
		return
	}
	err = r.DB.Where("aid = ?", item.Aid).Delete(&db.AppInfo{}).Error
	meta, _ := json.Marshal(item)
	appevent.AppEvent.AppDeleteEvent(info.Aid, info.AppName, string(meta), user)
	return
}

// 获取全部应用
func (r *resource) GetAllApp() (resp []db.AppInfo, err error) {
	resp = make([]db.AppInfo, 0)
	err = r.DB.Find(&resp).Error
	return
}

// 根据分页获取应用列表
func (r *resource) GetAppList(where db.AppInfo, currentPage, pageSize int, keyType, keyWords, searchPort string, sort string) (resp []db.AppInfo, page *view.Pagination, err error) {
	page = view.NewPagination(currentPage, pageSize)
	sql := r.DB.Model(db.AppInfo{}).Where(where)
	switch keyType {
	case "app_name":
		keyWords = strings.TrimSpace(keyWords)
		if len(keyWords) > 0 {
			sql = sql.Where("`app_name` like ?", "%"+keyWords+"%")
		}
	case "aid":
		aid, _ := strconv.Atoi(strings.TrimSpace(keyWords))
		if aid > 0 {
			sql = sql.Where("`aid` = ? ", aid)
		}
	}
	searchPort = strings.TrimSpace(searchPort)
	if searchPort != "" {
		sql = sql.Where("`http_port` = ? OR `rpc_port` = ? OR `govern_port` = ? ", searchPort, searchPort, searchPort)
	}
	sql.Count(&page.Total)
	if sort != "" {
		sql = sql.Order(sort)
	}
	err = sql.Offset((page.Current - 1) * page.PageSize).Limit(page.PageSize).Find(&resp).Error
	return
}

func (r *resource) GetAppCnt() (cnt int) {
	r.DB.Model(db.AppInfo{}).Count(&cnt)
	return
}

// 获取所有应用列表按lang约束
func (a *resource) FilterListInLangs(langs []string) ([]view.RespAppInfo, error) {
	list := make([]view.RespAppInfo, 0)
	query := a.Table("app")
	if len(langs) > 0 {
		query = query.Where("lang IN (?)", langs)
	}
	if err := query.Find(&list).Error; err != nil {
		return list, err
	}
	return list, nil
}

// SimpleAppList 获取应用及对应的负责人信息，主要用于访问gitlab交互
func (a *resource) SimpleAppList(lang string) (resp []db.AppInfo) {
	invoker.JunoMysql.Where("lang = ?", lang).Find(&resp)
	return
}

// 根据应用名,获取机房信息
func (a *resource) GetAppIDCList(appName string) (idcs []db.AppNode, err error) {
	idcs = make([]db.AppNode, 0)
	if err = a.Where("app_name = ?", appName).Group("env, zone_code").Find(&idcs).Error; err != nil {
		return idcs, err
	}
	return idcs, nil
}

// 根据应用名,获取机房信息
func (a *resource) GetIDCList() (idcs []db.AppNode, err error) {
	idcs = make([]db.AppNode, 0)
	if err = a.Group("env, zone_code").Select("env, zone_code").Find(&idcs).Error; err != nil {
		return idcs, err
	}
	return idcs, nil
}

// 根据应用名,获取机房信息
func (a *resource) GetAppIDCListOld(appName string) (idcs []db.AppNode, err error) {
	idcs = make([]db.AppNode, 0)
	if err = a.Where("app_name = ?", appName).Group("zone_code").Find(&idcs).Error; err != nil {
		return idcs, err
	}
	return idcs, nil
}

// 获取jupiter版本信息
func (a *resource) GetMinervaVersion(appName string) (string, error) {
	appInfo := db.AppInfo{}
	if err := a.DB.Where("app_name = ?", appName).First(&appInfo).Error; err != nil {
		return "", err
	}
	if appInfo.Aid == 0 {
		return "", errors.New("appInfo.Aid为0")
	}
	appPackage := db.AppPackage{}
	if err := a.DB.Where("aid = ? and name = 'github.com/labstack/echo/v4'", appInfo.Aid).First(&appPackage).Error; err != nil {
		return "", err
	}
	return appPackage.Version, nil
}

func (a *resource) updateAppInfo(info *db.AppInfo, user *db.User) {
	var count int
	a.DB.Model(db.AppInfo{}).Where("app_name = ?", info.AppName).Count(&count)
	if count == 0 { // 新增
		a.DB.Create(info)
		if err := a.appUpEvent(info, user); err != nil {
			log.Error("put appUpEvent failed", err.Error())
		}
	} else { // 更新
		a.DB.Model(db.AppInfo{}).Where("app_name = ?", info.AppName).Save(info)
		if err := a.appUpdateEvent(info, user); err != nil {
			log.Error("put appUpdateEvent failed", err.Error())
		}
	}
}

func (a *resource) updateAppUser(appName string, userNames []string) {
	a.DB.Where("app_name = ? ", appName).Delete(&db.AppUserRelation{})
	for _, name := range userNames {
		a.DB.Create(&db.AppUserRelation{
			AppName:   appName,
			UserName:  name,
			UpdatedAt: time.Now().Unix(),
		})
	}
}

// 保存用户访问的应用
func (a *resource) SaveVisitedApp(appName, userName string) {
	var userVisitedApp db.UserVisitedApp
	err := a.DB.Where("app_name = ? and user_name = ?", appName, userName).First(&userVisitedApp).Error
	if err == gorm.ErrRecordNotFound {
		userVisitedAppNew := db.UserVisitedApp{
			AppName:     appName,
			UserName:    userName,
			VisitedTime: time.Now().Unix(),
		}
		a.DB.Create(&userVisitedAppNew)
		return
	}
	a.DB.Table("user_visited_app").Where("app_name = ? and user_name = ?", appName, userName).Update(map[string]interface{}{
		"visited_time": time.Now().Unix(),
	})
}

func (a *resource) GetVisitedApp(userName string) []db.UserVisitedApp {
	var userVisitedApp []db.UserVisitedApp
	a.DB.Order("visited_time desc").Where("user_name = ?", userName).Find(&userVisitedApp)
	return userVisitedApp
}

// Delete 删除对应aid的App，action为对应的删除行为
func (a *resource) Delete(appName string, action db.AppLogAction) (err error) {
	app := db.AppInfo{}

	// 先找到
	query := a.DB.Table("app").Where("app_name = ?", appName).First(&app)

	err = query.Error
	if err != nil {
		return
	}

	tx := a.DB.Begin()

	queryLog := tx.Table("app_log").Create(&db.AppLog{
		Aid:        app.Aid,
		Gid:        app.Gid,
		Name:       app.Name,
		AppName:    app.AppName,
		CreateTime: app.CreateTime,
		UpdateTime: app.UpdateTime,
		Level:      app.Level,
		Lang:       app.Lang,
		BizDomain:  app.BizDomain,
		CreatedBy:  app.CreatedBy,
		UpdatedBy:  app.UpdatedBy,
		HttpPort:   app.HttpPort,
		RpcPort:    app.RpcPort,
		HealthPort: app.GovernPort,
		HookId:     app.HookId,
		Users:      app.Users,
		WebUrl:     app.WebUrl,
		Action:     string(action),
	})
	if err := queryLog.Error; err != nil {
		tx.Rollback()
		log.Error("create app_log failed,", err.Error())
		return err
	}
	queryDelete := tx.Table("app").Delete(&app)
	if err := queryDelete.Error; err != nil {
		tx.Rollback()
		log.Error("delete app failed", err.Error())
		return err
	}
	err = tx.Table("app_change_map").Where("app_name = ?", app.AppName).Delete(&db.AppChangeMap{}).Error
	if err != nil {
		log.Error("app.Delete: delete AppChangeMap query failed", err.Error())
		tx.Rollback()
		return
	}

	err = tx.Commit().Error

	return
}

func (a *resource) removeAppDown(appDownList []db.AppInfo, user *db.User) error {
	for _, item := range appDownList {
		err := a.Delete(item.AppName, db.AppLogActionDelete)
		if err != nil {
			log.Error("removeAppDown: app.Delete failed", err.Error())
			continue
		}

		if err := a.appDownEvent(&item, user); err != nil {
			log.Error("removeAppDown: ", err.Error())
			// 考虑到事件流不能影响业务逻辑，此处不rollback
		}
	}
	return nil
}

func (a *resource) appDownEvent(app *db.AppInfo, user *db.User) error {
	metaData, err := json.Marshal(app)
	appEvent := &db.AppEvent{
		AppName:   app.AppName,
		Aid:       app.Aid,
		ZoneCode:  "",
		Env:       "prod",
		UserName:  user.Username,
		Uid:       user.Uid,
		Operation: event.EventCMDBAppDelete,
		Source:    event.SourceCMDB,
		Metadata:  string(metaData),
	}
	appEvent.HandleOperationName()
	appEvent.HandleSourceName()
	return err
}

func (a *resource) appUpEvent(app *db.AppInfo, user *db.User) error {
	metaData, err := json.Marshal(app)
	ev := &db.AppEvent{
		AppName:   app.AppName,
		Aid:       app.Aid,
		ZoneCode:  "",
		Env:       "prod",
		Operation: event.EventCMDBAppCreate,
		Source:    event.SourceCMDB,
		Metadata:  string(metaData),
	}
	if user != nil {
		ev.Uid = user.Uid
		ev.UserName = user.Username
	}
	ev.HandleOperationName()
	ev.HandleSourceName()
	return err
}

func (a *resource) appUpdateEvent(app *db.AppInfo, user *db.User) error {
	metaData, err := json.Marshal(app)
	ev := &db.AppEvent{
		AppName:   app.AppName,
		Aid:       app.Aid,
		ZoneCode:  "",
		Env:       "prod",
		Operation: event.EventCMDBAppUpdate,
		Source:    event.SourceCMDB,
		Metadata:  string(metaData),
	}
	if user != nil {
		ev.Uid = user.Uid
		ev.UserName = user.Username
	}
	ev.HandleOperationName()
	ev.HandleSourceName()
	return err
}

func (a *resource) Count() (count int, err error) {
	err = a.DB.Table("app").Where("biz_domain = ?", "项目A").Count(&count).Error
	return
}

func (a *resource) WhereAID(aid uint) (app *db.AppInfo, err error) {
	app = &db.AppInfo{}
	err = a.DB.Where("aid = ?", aid).First(app).Error
	return app, err
}

// WhereNickname 根据负责人和应用名进行查询
func (a *resource) WhereNickname(username, qs string, page, pageSize uint) (apps []db.AppInfo, total uint, err error) {
	if pageSize == 0 {
		return
	}

	wg := sync.WaitGroup{}
	wg.Add(2)

	errChan := make(chan error, 2)

	query := a.DB.Table("app").Where("users like ?", "%"+username+"%")
	// Where("biz_domain = ?", BizDomainA)

	if qs != "" {
		query = query.Where("app_name like ?", "%"+qs+"%")
	}

	go func() {
		defer wg.Done()
		err := query.Count(&total).Error
		if err != nil {
			log.Error("app.WhereNickname: sql count failed", err.Error())
			errChan <- err
		}
	}()

	go func() {
		defer wg.Done()
		offset := page * pageSize
		err := query.Limit(pageSize).Offset(offset).Find(&apps).Error
		if err != nil {
			log.Error("app.WhereNickname: sql find failed", err.Error())
			errChan <- err
		}
	}()

	wg.Wait()

	select {
	case err := <-errChan:
		return apps, total, err
	default:
		break
	}

	return
}
