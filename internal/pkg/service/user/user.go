package user

import (
	"encoding/json"
	"errors"
	"fmt"
	"sort"
	"time"

	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	log "github.com/sirupsen/logrus"
	"go.uber.org/zap"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/store/gorm"
	"github.com/labstack/echo/v4"
)

// User 指定Menu结构体对应的表名
type user struct {
	*gorm.DB
}

// InitUser ...
func InitUser(invokerDB *gorm.DB) *user {
	u := &user{
		DB: invokerDB,
	}
	return u
}

// GetUser ...
func GetUser(c echo.Context) *db.User {
	user := Session.Read(c)
	// return default user
	if user == nil {
		return &db.User{}
	}
	return user
}

func IsAdmin(c echo.Context) bool {
	user := Session.Read(c)
	if user == nil {
		return false
	}
	if user.Access == "admin" {
		return true
	}
	return false
}

func (u *user) GetList(where db.User, currentPage, pageSize int, sort string) (out []db.UserInfo, total int64, err error) {
	if pageSize == 0 {
		pageSize = 20
	}
	if currentPage == 0 {
		currentPage = 1
	}
	var resp []db.User
	sql := u.DB.Model(db.User{}).Where(where)
	sql.Count(&total)
	err = sql.Order(sort).Offset((currentPage - 1) * pageSize).Limit(pageSize).Find(&resp).Error
	if err != nil {
		return
	}
	for _, user := range resp {
		out = append(out, user.TransformUserInfo())
	}
	return
}

// GetUserBuOaUID 根据oaUid获取用户
func (u *user) GetUserByName(name string) (userData db.User) {
	u.DB.Where("username=?", name).Find(&userData)
	return
}

// GetUserBuOaUID 根据oaUid获取用户
func (u *user) GetUserByUID(uid int) (userData db.User) {
	u.DB.Where("uid=?", uid).Find(&userData)
	return
}

// GetNameByUID ...
func (u *user) GetNameByUID(uid int) string {
	var userData db.User
	u.DB.Where("uid=?", uid).Find(&userData)
	return userData.Username
}

// 根据oauth获取用户
func (u *user) CreateOrUpdateOauthUser(info *db.User) (err error) {
	var user db.User
	err = u.DB.Where("oauth = ? and oauth_id = ?", info.Oauth, info.OauthId).First(&user).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		// system error
		return
	}
	// not found
	if errors.Is(err, gorm.ErrRecordNotFound) {
		err = u.Create(info)
		if err != nil {
			return
		}
	}

	err = u.Update(user.Uid, info)
	if err != nil {
		return
	}

	u.DB.Where("oauth = ? and oauth_id = ?", info.Oauth, info.OauthId).First(info)
	return
}

// 设置APP信息
func (u *user) Create(item *db.User) (err error) {
	err = u.DB.Where("username = ?", item.Username).First(item).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return
	}
	if item.Uid > 0 {
		err = errors.New("user name is exist")
		return
	}

	item.CreateTime = time.Now().Unix()
	item.UpdateTime = time.Now().Unix()
	err = u.DB.Create(item).Error
	if err != nil {
		return err
	}

	groupName := "default"
	if item.Access == "admin" {
		groupName = "admin"
	}

	err = u.DB.Save(&db.CasbinPolicyGroup{
		GroupName: groupName,
		Uid:       item.Uid,
		Type:      db.CasbinGroupTypeUser,
	}).Error
	if err != nil {
		return err
	}

	return
}

func (u *user) Update(uid int, user *db.User) (err error) {
	var info db.User
	err = u.DB.Where("uid = ?", uid).First(&info).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return
	}
	if info.Uid == 0 {
		err = errors.New("user is not exist")
		return
	}
	user.UpdateTime = time.Now().Unix()
	err = u.DB.Model(db.User{}).Where("uid = ?", uid).UpdateColumns(&user).Error
	return
}

func (u *user) Delete(item db.User) (err error) {
	var info db.User
	err = u.DB.Where("uid = ?", item.Uid).First(&info).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return
	}
	if info.Uid == 0 {
		err = errors.New("用户不存在")
		return
	}
	err = u.DB.Where("uid = ?", item.Uid).Delete(&db.User{}).Error

	return
}

func (u *user) GetAppViewHistory(uid uint32) (resp []db.AppViewHistory, err error) {
	resp = make([]db.AppViewHistory, 0)
	ids := make([]uint32, 0)
	if err = u.DB.Table("app_view_history").Select("max(id) as id").Where("uid = ?", uid).Group("aid").Pluck("id", &ids).Error; err != nil {
		return
	}
	if err = u.DB.Table("app_view_history").Select("*").Where("id in (?)", ids).Order("created_at desc").Limit(10).Find(&resp).Error; err != nil {
		return
	}

	return resp, nil
}

func (u *user) PostAppViewHistory(uid uint32, aid uint32, appName string) (err error) {
	return u.DB.Table("app_view_history").Create(&db.AppViewHistory{
		Aid:     uint(aid),
		AppName: appName,
		UID:     uint(uid),
	}).Error
}

func (u *user) GetUserAppConfig(uid, aid uint32) (config db.UserConfigInfo, err error) {
	config = db.UserConfigInfo{}
	record := db.UserConfig{}

	if err = u.DB.Table("user_config").Where("uid = ? AND aid = ?", uid, aid).Order("update_time desc").Find(&record).Error; err != nil && err != gorm.ErrRecordNotFound {
		return
	}

	if record.Id == 0 || record.Content == "" {
		return config, nil
	}

	if err = json.Unmarshal([]byte(record.Content), &config); err != nil {
		return
	}

	return config, nil
}

func (u *user) PostUserAppConfig(uid, aid uint32, info db.UserConfigInfo) (err error) {
	var (
		tx       = u.DB.Table("user_config").Begin()
		infoData = make([]byte, 0)
		record   = db.UserConfig{}
		config   = db.UserConfigInfo{}
	)

	if err = tx.Where("uid = ? AND aid = ?", uid, aid).Order("update_time desc").First(&record).Error; err != nil && err != gorm.ErrRecordNotFound {
		tx.Rollback()
		return
	}

	// 创建
	if record.Id == 0 {
		if infoData, err = json.Marshal(info); err != nil {
			tx.Rollback()
			return
		}

		if err = tx.Create(&db.UserConfig{
			Uid:        int(uid),
			Aid:        int(aid),
			Content:    string(infoData),
			CreateTime: time.Now().Unix(),
			UpdateTime: time.Now().Unix(),
		}).Error; err != nil {
			tx.Rollback()
			return
		}

		tx.Commit()
		return nil
	}

	if err = json.Unmarshal([]byte(record.Content), &config); err != nil {
		xlog.Error("PostUserAppConfig.Unmarshal", zap.Any("err", err), zap.Any("content", record.Content), zap.Any("aid", aid), zap.Any("uid", uid))
	}

	if info.DashboardPath == "" {
		info.DashboardPath = config.DashboardPath
	}

	if info.VersionKey == "" {
		info.VersionKey = config.VersionKey
	}

	if infoData, err = json.Marshal(info); err != nil {
		tx.Rollback()
		return
	}

	if err = tx.Where("id = ?", record.Id).Updates(map[string]interface{}{
		"content":     string(infoData),
		"update_time": time.Now().Unix(),
	}).Error; err != nil {
		tx.Rollback()
		return
	}

	tx.Commit()
	return nil
}

func (u *user) PostTabVisit(record db.UserVisit) (err error) {
	return u.DB.Table("user_visit").Create(&record).Error
}

func (u *user) GetTabVisit(req view.ReqGetTabVisit) (records []db.UserVisit, err error) {
	dbConn := u.DB.Table("user_visit")
	records = make([]db.UserVisit, 0)
	if req.StartTime > 0 && req.EndTime > 0 {
		dbConn = dbConn.Where("ts > ? AND ts < ?", req.StartTime, req.EndTime)
	}
	if err = dbConn.Find(&records).Error; err != nil {
		xlog.Error("GetTabVisit", zap.Any("err", err), zap.Any("req", req))
		return
	}
	return records, nil
}

func (u *user) SolveTabVisit(records []db.UserVisit) (userTabList []view.UserTabVisit, appTabList []view.AppTabVisit, pageTabList []view.TabVisit) {
	userTabList = make([]view.UserTabVisit, 0)
	appTabList = make([]view.AppTabVisit, 0)
	pageTabList = make([]view.TabVisit, 0)
	if len(records) == 0 {
		return
	}

	var (
		userPageMap = make(map[int]view.UserTabVisit)
		appVisitMap = make(map[int]view.AppTabVisit)
		pageMap     = make(map[string]view.TabVisit)
	)

	for _, v := range records {
		info, ok := userPageMap[v.Uid]
		if !ok {
			appMap := map[int]struct{}{
				v.Aid: {},
			}
			userPageMap[v.Uid] = view.UserTabVisit{
				Uid:      uint32(v.Uid),
				AppSum:   1,
				VisitSum: 1,
				AppMap:   appMap,
			}
		} else {
			// 新的app
			if _, ok1 := info.AppMap[v.Aid]; !ok1 {
				info.AppSum += 1
				info.AppMap[v.Aid] = struct{}{} // 记录aid
			}
			info.VisitSum += 1
			userPageMap[v.Uid] = info
		}

		appStat, ok2 := appVisitMap[v.Aid]
		if !ok2 {
			appVisitMap[v.Aid] = view.AppTabVisit{
				Aid:      uint32(v.Aid),
				AppName:  v.AppName,
				VisitSum: 1,
			}
		} else {
			appStat.VisitSum += 1
			appVisitMap[v.Aid] = appStat
		}

		record, ok3 := pageMap[v.Tab]
		if !ok3 {
			tab, ok4 := view.TabNameMap[v.Tab]
			if !ok4 {
				tab = v.Tab
			}
			pageMap[v.Tab] = view.TabVisit{
				Tab:      v.Tab,
				TabName:  tab,
				VisitSum: 1,
			}
		} else {
			record.VisitSum += 1
			pageMap[v.Tab] = record
		}
	}

	uids := make([]int, 0)

	for k, v := range userPageMap {
		userTabList = append(userTabList, v)
		uids = append(uids, k)
	}

	uidMap, _ := u.GetListByUids(uids)

	for index, v := range userTabList {
		userName := fmt.Sprintf("uid:%v", v.Uid)
		tmp, ok := uidMap[int(v.Uid)]
		if ok {
			userName = tmp.Username
		}
		userTabList[index].UserName = userName
	}

	for _, v := range appVisitMap {
		appTabList = append(appTabList, v)
	}

	for _, v := range pageMap {
		pageTabList = append(pageTabList, v)
	}

	sort.Slice(userTabList, func(i, j int) bool {
		return userTabList[i].VisitSum > userTabList[j].VisitSum
	})

	sort.Slice(appTabList, func(i, j int) bool {
		return appTabList[i].VisitSum > appTabList[j].VisitSum
	})

	sort.Slice(pageTabList, func(i, j int) bool {
		return pageTabList[i].VisitSum > pageTabList[j].VisitSum
	})

	return
}

func (u *user) CronCleanUserVisitRecord() (err error) {
	cleanDay := cfg.Cfg.UserVisit.CleanDay // 默认的是90天
	xlog.Info("CronCleanUserVisitRecord", zap.String("run", "start"), zap.Any("cleanDay", cleanDay))

	ts := time.Now().Unix() - int64(cleanDay*86400)
	if ts < 0 || cleanDay <= 0 {
		err = fmt.Errorf("cleanDay error")
		log.Error("CronCleanUserVisitRecord", zap.Any("err", err), zap.Any("cleanDay", cleanDay))
		return
	}
	if err = u.DB.Table("user_visit").Where("`ts` < ?", time.Now().Unix()-int64(cleanDay*86400)).Delete(&db.UserVisit{}).Error; err != nil {
		log.Error("CronCleanUserVisitRecord", zap.Any("err", err), zap.Any("cleanDay", cleanDay))
		return
	}
	xlog.Info("CronCleanUserVisitRecord", zap.String("run", "end"))
	return
}

func (u *user) GetListByUids(uids []int) (out map[int]db.User, err error) {
	out = make(map[int]db.User)
	var resp = make([]db.User, 0)
	err = u.DB.Model(db.User{}).Where("uid in (?)", uids).Find(&resp).Error
	if err != nil {
		return
	}
	for _, user := range resp {
		out[user.Uid] = user
	}
	return
}
