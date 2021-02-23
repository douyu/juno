package user

import (
	"encoding/json"
	"strings"
	"time"

	"github.com/douyu/juno/internal/pkg/service/confgov2"
	"github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	"go.uber.org/zap"

	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/appevent"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/model/db"
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
	err = user.User.Create(&reqModel.User)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	meta, _ := json.Marshal(reqModel)
	appevent.AppEvent.UserCreateEvent(string(meta), user.Session.Read(c))
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
	reqModel.Username = user.User.GetNameByUID(reqModel.User.Uid)
	meta, _ := json.Marshal(reqModel)
	appevent.AppEvent.UserUpdateEvent(string(meta), user.Session.Read(c))
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
	reqModel.Username = user.User.GetNameByUID(reqModel.User.Uid)

	err = user.User.Delete(reqModel.User)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	meta, _ := json.Marshal(reqModel)
	appevent.AppEvent.UserDeleteEvent(string(meta), user.Session.Read(c))
	return output.JSON(c, output.MsgOk, "success")
}

// Info get userinfo
func Info(c *core.Context) error {
	u := user.GetUser(c)
	if !u.IsLogin() {
		return c.OutputJSON(output.MsgErr, "err")
	}
	return c.OutputJSON(output.MsgOk, "", c.WithData(u))
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

// 获取应用浏览历史
func GetAppViewHistory(c echo.Context) error {
	u := user.GetUser(c)
	if !u.IsLogin() {
		return output.JSON(c, output.MsgErr, "invalid user")
	}
	resp, err := user.User.GetAppViewHistory(uint32(u.Uid))
	if err != nil {
		return output.JSON(c, output.MsgErr, "mysql query failed:"+err.Error())
	}

	return output.JSON(c, output.MsgOk, "success", resp)
}

// 添加应用浏览历史
func PostAppViewHistory(c echo.Context) error {
	req := view.ReqUserAppViewHistory{}
	if err := c.Bind(&req); err != nil {
		return output.JSON(c, output.MsgErr, "invalid params")
	}

	u := user.GetUser(c)
	if !u.IsLogin() {
		return output.JSON(c, output.MsgErr, "invalid user")
	}

	if req.Aid == 0 {
		return output.JSON(c, output.MsgErr, "invalid aid")
	}

	// 基础信息
	appInfo, err := resource.Resource.GetApp(req.Aid)
	if err != nil {
		return output.JSON(c, output.MsgErr, "invalid aid")
	}

	err = user.User.PostAppViewHistory(uint32(u.Uid), uint32(appInfo.Aid), appInfo.AppName)
	if err != nil {
		return output.JSON(c, output.MsgErr, "mysql query failed:"+err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

// 获取用户使用的一些基本情况
func GetAppConfig(c echo.Context) error {
	req := view.ReqGetAppConfig{}
	if err := c.Bind(&req); err != nil {
		return output.JSON(c, output.MsgErr, "invalid params")
	}

	u := user.GetUser(c)
	if !u.IsLogin() {
		//return output.JSON(c, output.MsgErr, "invalid user")
	}

	if req.Aid == 0 {
		return output.JSON(c, output.MsgErr, "invalid aid")
	}

	resp, err := user.User.GetUserAppConfig(uint32(u.Uid), uint32(req.Aid))
	if err != nil {
		xlog.Error("GetUserAppConfig", zap.Any("err", err), zap.Any("uid", u.Uid), zap.Any("aid", req.Aid))
	}

	return output.JSON(c, output.MsgOk, "success", resp)
}

func PostAppConfig(c echo.Context) error {
	req := view.ReqPostAppConfig{}
	if err := c.Bind(&req); err != nil {
		return output.JSON(c, output.MsgErr, "invalid params")
	}

	u := user.GetUser(c)
	if !u.IsLogin() {
		//return output.JSON(c, output.MsgErr, "invalid user")
	}

	if req.Aid == 0 {
		return output.JSON(c, output.MsgErr, "invalid aid")
	}

	if req.Config.VersionKey == "" && req.Config.DashboardPath == "" {
		return output.JSON(c, output.MsgErr, "invalid config")
	}

	err := user.User.PostUserAppConfig(uint32(u.Uid), uint32(req.Aid), req.Config)
	if err != nil {
		xlog.Error("PostUserAppConfig", zap.Any("err", err), zap.Any("uid", u.Uid), zap.Any("aid", req.Aid), zap.Any("config", req.Config))
		// 返回成功即可
		return output.JSON(c, output.MsgOk, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

func PostTabVisit(c echo.Context) error {
	req := view.ReqPostUserVisit{}
	if err := c.Bind(&req); err != nil {
		return output.JSON(c, output.MsgErr, "invalid params")
	}

	if err := req.Check(); err != nil {
		return output.JSON(c, output.MsgErr, "invalid params:"+err.Error())
	}

	u := user.GetUser(c)
	if !u.IsLogin() {
		return output.JSON(c, output.MsgErr, "invalid user")
	}

	// 基础信息
	appInfo, err := resource.Resource.GetApp(req.Aid)
	if err != nil {
		return output.JSON(c, output.MsgErr, "invalid aid")
	}

	record := db.UserVisit{
		Uid:      u.Uid,
		Aid:      int(req.Aid),
		AppName:  appInfo.AppName,
		ZoneCode: req.ZoneCode,
		Env:      req.Env,
		Tab:      req.Tab,
		Url:      req.Url,
		Ts:       time.Now().Unix(),
	}

	err = user.User.PostTabVisit(record)
	if err != nil {
		xlog.Error("PostTabVisit", zap.Any("err", err), zap.Any("uid", u.Uid), zap.Any("aid", req.Aid), zap.Any("req", req))
		// 返回成功即可
		return output.JSON(c, output.MsgOk, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

func GetTabVisit(c echo.Context) error {
	req := view.ReqGetTabVisit{}
	if err := c.Bind(&req); err != nil {
		return output.JSON(c, output.MsgErr, "invalid params")
	}

	if err := req.Check(); err != nil {
		return output.JSON(c, output.MsgErr, "invalid params:"+err.Error())
	}

	// 基础信息
	//appInfo, err := resource.Resource.GetApp(req.Aid)
	//if err != nil {
	//	return output.JSON(c, output.MsgErr, "invalid aid")
	//}

	records, err := user.User.GetTabVisit(req)
	if err != nil {
		return output.JSON(c, output.MsgErr, "db find err:"+err.Error())
	}

	userTabList, appTabList, pageTabList := user.User.SolveTabVisit(records)

	// 拿到线上所有配置文件
	appConfMap, _ := confgov2.GetAllConfigByEnv("prod")

	allApp, _ := resource.Resource.GetAllApp()

	appList := make([]db.AppInfo, 0)
	appSum := 0
	appConf := 0

	for _, v := range allApp {
		if v.Lang != "Go" && v.Lang != "go" {
			continue
		}

		if !strings.HasSuffix(v.AppName, "-go") {
			continue
		}

		if !strings.HasPrefix(v.AppName, "wsd-") {
			continue
		}

		if v.BizDomain == "项目A" {
			continue
		}

		appSum++

		_, ok := appConfMap[uint(v.Aid)]
		if !ok {
			appList = append(appList, v)
		} else {
			appConf++
		}

	}

	return output.JSON(c, output.MsgOk, "success", view.VisitStat{
		AppVisit:  appTabList,
		UserVisit: userTabList,
		PageVisit: pageTabList,
		AppList:   appList,
		AppSum:    appSum,
		AppConf:   appConf,
	})
}
