package user

import (
	"encoding/json"
	"time"

	"github.com/douyu/juno/internal/pkg/model/db"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/appevent"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

// List user list
func List(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqUserList{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	list, total, err := user.User.GetList(db.User{}, reqModel.CurrentPage, reqModel.PageSize, "update_time desc")
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", map[string]interface{}{
		"total": total,
		"list":  list,
	})
}

// Create 只有可用区的创建功能
func Create(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqUserCreate{}
	err = c.Bind(&reqModel)

	if reqModel.Username == "" || reqModel.Password == "" {
		return output.JSON(c, output.MsgErr, "参数异常")
	}

	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(reqModel.Password), bcrypt.DefaultCost)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	reqModel.Password = string(hash)
	err = user.User.Create(reqModel.User)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	meta, _ := json.Marshal(reqModel)
	appevent.AppEvent.UserCreateEvent(reqModel.Username, string(meta), user.Session.Read(c))
	return output.JSON(c, output.MsgOk, "success")
}

// Update 只有可用区的更新功能
func Update(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqUserUpdate{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	err = user.User.Update(reqModel.User.Uid, &db.User{
		UpdateTime: time.Now().Unix(),
		Access:     reqModel.Access,
	})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	meta, _ := json.Marshal(reqModel)
	appevent.AppEvent.UserUpdateEvent(reqModel.Username, string(meta), user.Session.Read(c))
	return output.JSON(c, output.MsgOk, "success")
}

// Delete 只有可用区的删除功能
func Delete(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqUserUpdate{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	err = user.User.Delete(reqModel.User)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	meta, _ := json.Marshal(reqModel)
	appevent.AppEvent.UserDeleteEvent(reqModel.Username, string(meta), user.Session.Read(c))
	return output.JSON(c, output.MsgOk, "success")
}

func Info(c echo.Context) error {
	return output.JSON(c, output.MsgOk, "", user.GetUser(c))
}

type login struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// Login
func Login(c echo.Context) error {
	var data login
	_ = c.Bind(&data)
	// TODO 三种登录方式：账号密码、header头、gitlab oauth2
	// TODO 账号密码验证
	// TODO gitlab oauth
	u := user.User.GetUserByName(data.Username)
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(data.Password))
	if err != nil {
		return output.JSON(c, output.MsgErr, "账号或密码错误", "")
	}
	user.Session.Save(c, &u)
	return output.JSON(c, output.MsgOk, "", u)
}

func Logout(c echo.Context) error {
	user.Session.Logout(c)
	return output.JSON(c, output.MsgOk, "", "")
}
