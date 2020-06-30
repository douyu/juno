package user

import (
	"errors"
	"sync"
	"time"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/conf"
	"github.com/douyu/jupiter/pkg/store/gorm"
	"github.com/labstack/echo/v4"
)

// User 指定Menu结构体对应的表名
type user struct {
	l      sync.RWMutex
	search map[string]db.User
	data   map[int]db.User
	*gorm.DB
}

// InitUser ...
func InitUser(invokerDB *gorm.DB) *user {
	u := &user{
		search: make(map[string]db.User, 0),
		data:   make(map[int]db.User, 0),
		DB:     invokerDB,
	}
	u.initUser()
	return u
}

// GetUser ...
func GetUser(c echo.Context) *db.User {
	user := Session.Read(c)
	// 如果user为nil就创建一个
	if user == nil {
		if conf.GetString("app.mode") == "local" {
			return &db.User{
				Uid:              1,
				Oaid:             0,
				Username:         "local-test",
				Nickname:         "local-test",
				CurrentAuthority: "admin",
				Access:           "admin",
			}
		}
		return nil
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

func (u *user) initUser() {
	searchTmp := make(map[string]db.User, 0)
	dataTmp := make(map[int]db.User, 0)
	tmpList := make([]db.User, 0)
	u.DB.Table("user").Find(&tmpList)
	for _, userData := range tmpList {
		searchTmp[userData.Username] = userData
		if userData.Email != "" {
			searchTmp[userData.Email] = userData
		}
		dataTmp[userData.Uid] = userData
	}
	u.l.Lock()
	u.search = searchTmp
	u.data = dataTmp
	u.l.Unlock()
}

func (u *user) GetList(where db.User, currentPage, pageSize int, sort string) (out []db.UserInfo, total int, err error) {
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

//GetUserBuOaUID 根据oaUid获取用户
func (u *user) GetUserByName(name string) (userData db.User) {
	u.DB.Where("username=?", name).Find(&userData)
	return
}

//GetUserBuOaUID 根据oaUid获取用户
func (u *user) GetUserByUID(uid int) (userData db.User) {
	u.l.RLock()
	userData = u.data[uid]
	u.l.RUnlock()
	return
}

// GetNameByUID ...
func (u *user) GetNameByUID(uid int) string {
	u.l.RLock()
	userData := u.data[uid]
	u.l.RUnlock()
	return userData.Username
}

// 根据oauth获取用户
func (u *user) CreateOrUpdateOauthUser(info *db.User) (err error) {
	err = u.DB.Where("oauth = ? and oauth_id = ?", info.Oauth, info.OauthId).Find(&info).Error
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		// system error
		return
	}
	// not found
	if gorm.IsRecordNotFoundError(err) {
		err = u.Create(info)
		if err != nil {
			return
		}
	}

	err = u.Update(info.Uid, info)
	if err != nil {
		return
	}
	return
}

// 设置APP信息
func (u *user) Create(item *db.User) (err error) {
	err = u.DB.Where("username = ?", item.Username).Find(item).Error
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return
	}
	if item.Uid > 0 {
		err = errors.New("user name is exist")
		return
	}

	item.CreateTime = time.Now().Unix()
	item.UpdateTime = time.Now().Unix()
	err = u.DB.Create(item).Error

	u.l.Lock()
	u.data[item.Uid] = *item
	u.search[item.Username] = *item
	u.l.Unlock()

	return
}

func (u *user) Update(uid int, user *db.User) (err error) {
	var info db.User
	err = u.DB.Where("uid = ?", uid).Find(&info).Error
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return
	}
	if info.Uid == 0 {
		err = errors.New("user is not exist")
		return
	}
	user.UpdateTime = time.Now().Unix()

	err = u.DB.Model(db.User{}).Where("uid = ?", uid).UpdateColumns(&user).Error

	_ = u.DB.Where("uid = ?", uid).Find(&info)

	u.l.Lock()
	u.data[uid] = info
	u.search[info.Username] = info
	u.l.Unlock()

	return
}

func (u *user) Delete(item db.User) (err error) {
	var info db.User
	err = u.DB.Where("uid = ?", item.Uid).Find(&info).Error
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return
	}
	if info.Uid == 0 {
		err = errors.New("用户不存在")
		return
	}
	err = u.DB.Where("uid = ?", item.Uid).Delete(&db.User{}).Error

	u.l.Lock()
	delete(u.data, item.Uid)
	delete(u.search, item.Username)
	u.l.Unlock()
	return
}
