package user

import (
	"errors"
	"time"

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

	err = u.Update(user.Uid, info)
	if err != nil {
		return
	}

	u.DB.Where("oauth = ? and oauth_id = ?", info.Oauth, info.OauthId).First(info)
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
	if err != nil && !gorm.IsRecordNotFoundError(err) {
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
	err = u.DB.Where("uid = ?", item.Uid).Find(&info).Error
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return
	}
	if info.Uid == 0 {
		err = errors.New("用户不存在")
		return
	}
	err = u.DB.Where("uid = ?", item.Uid).Delete(&db.User{}).Error

	return
}
