package middleware

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"

	"github.com/douyu/juno/internal/pkg/service/permission"

	"github.com/casbin/casbin/v2"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	casbin2 "github.com/douyu/juno/internal/pkg/service/casbin"
	"github.com/douyu/juno/internal/pkg/service/confgov2"
	"github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type (
	// CasbinConfig defines the config for CasbinAuth middleware.
	CasbinConfig struct {
		// Skipper defines a function to skip middleware.
		Skipper middleware.Skipper

		// Enforcer CasbinAuth main rule.
		// Required.
		Enforcer *casbin.SyncedEnforcer
	}

	// 从 echo context 中获取 app 和 env 参数的函数
	AppEnvParser func(c echo.Context) (appName, env string, err error)
)

var (
	// DefaultConfig is the default CasbinAuth middleware config.
	DefaultConfig = CasbinConfig{
		Skipper: middleware.DefaultSkipper,
	}
)

// MiddlewareWithConfig returns a CasbinAuth middleware with config.
// See `CasbinMiddleware()`.
func CasbinMiddleware(config CasbinConfig) echo.MiddlewareFunc {
	// Defaults
	if config.Skipper == nil {
		config.Skipper = DefaultConfig.Skipper
	}

	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if config.Skipper(c) {
				return next(c)
			}

			u := user.GetUser(c)
			if u == nil {
				return output.JSON(c, output.MsgNeedLogin, "forbidden")
			}

			pass, err := config.CheckPermission(u, c.Path(), c.Request().Method)
			if err != nil {
				return output.JSON(c, output.MsgErr, err.Error())
			}

			if pass {
				return next(c)
			}

			apiItem := casbin2.Casbin.GetAPIItem(c.Path(), c.Request().Method)
			if apiItem == nil {
				return AuthFailedResp(c, "当前用户没有接口权限，请联系管理员", c.Path(), c.Request().Method)
			}

			return AuthFailedResp(c, "当前用户没有接口权限，请联系管理员", c.Path(), apiItem.Name)
		}
	}
}

// CheckUserPermission checks the user/method/path combination from the request.
// Returns true (permission granted) or false (permission forbidden)
func (a *CasbinConfig) CheckPermission(user *db.User, path, method string) (bool, error) {
	return casbin2.Casbin.CheckUserPermission(user, path, method, db.CasbinPolicyTypeAPI)
}

func AllowPathPrefixSkipper(prefixes ...string) func(c echo.Context) bool {
	return func(c echo.Context) bool {
		path := c.Request().URL.Path
		for _, p := range prefixes {
			if strings.HasPrefix(path, p) {
				return true
			}
		}
		return false
	}
}

//ParseAppEnvFromContext 从Query/Body参数中获取应用环境信息
func ParseAppEnvFromContext(c echo.Context) (appName, env string, err error) {
	payload := struct {
		AppName string `json:"app_name" query:"app_name"`
		Env     string `json:"env" query:"env"`
	}{}
	err = c.Bind(&payload)
	if err != nil {
		return "", "", err
	}

	appName, env = payload.AppName, payload.Env
	return
}

//ParseAppEnvFromConfigID 从
func ParseAppEnvFromConfigID(c echo.Context) (appName, env string, err error) {
	payload := struct {
		ID uint `json:"id" query:"id"`
	}{}
	err = c.Bind(&payload)
	if err != nil {
		return "", "", err
	}

	detail, err := confgov2.Detail(view.ReqDetailConfig{ID: payload.ID})
	if err != nil {
		return
	}

	app, err := resource.Resource.GetApp(detail.AID)
	if err != nil {
		return
	}
	if app.Aid == 0 {
		err = fmt.Errorf("不存在该应用")
		return
	}

	appName, env = app.AppName, detail.Env

	return
}

func CasbinAppMW(parserFn AppEnvParser, action string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// 获取 Body 内容
			bodyBytes, _ := ioutil.ReadAll(c.Request().Body)
			c.Request().Body = ioutil.NopCloser(bytes.NewReader(bodyBytes))

			appName, env, err := parserFn(c)

			// 写回 Request Body
			c.Request().Body = ioutil.NopCloser(bytes.NewReader(bodyBytes))
			if err != nil {
				return output.JSON(c, output.MsgErr, "can not get app,env from context: "+err.Error(), nil)
			}

			u := user.GetUser(c)
			if u == nil {
				return output.JSON(c, output.MsgNeedLogin, "forbidden")
			}

			sub := strconv.Itoa(u.Uid)
			obj := casbin2.CasbinAppObjKey(appName, env)

			hasPerm, err := casbin2.Casbin.CheckPermission(sub, obj, action, db.CasbinPolicyTypeApp)
			if err != nil {
				return output.JSON(c, output.MsgErr, err.Error())
			}

			if hasPerm {
				return next(c)
			}

			err = permission.Permission.CheckGitlabAuth(uint(u.Uid), appName, env)
			if err != nil {
				return AuthFailedResp(c, "当前用户没有应用权限，请联系管理员", obj, action)
			}

			return next(c)
		}
	}
}

func GrafanaAuthMW(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		u := user.GetUser(c)
		obj := "monitor"
		sub := strconv.Itoa(u.Uid)
		hasManagePerm, _ := casbin2.Casbin.CheckPermission(sub, obj, db.MonitorPermWrite, db.CasbinPolicyTypeMonitor)
		if hasManagePerm {
			return next(c)
		}

		// 这里只能拦截页面请求，无法拦截 api 请求
		if strings.Trim(c.Request().URL.Path, "/") == "grafana" && !hasManagePerm {
			return c.HTML(http.StatusForbidden, "<div style=\"text-align:center;\">没有管理权限</div>")
		}

		// grafana document 请求
		// 这里只能拦截页面请求，无法拦截 api 请求
		if strings.HasPrefix(c.Request().URL.Path, "/grafana/d/") {
			param := struct {
				AppName string `query:"var-appname"`
				Env     string `query:"var-env"`
			}{}

			_ = c.Bind(&param)
			obj := casbin2.CasbinAppObjKey(param.AppName, param.Env)
			sub := strconv.Itoa(u.Uid)
			act := db.AppPermMonitorRead

			// 检查应用权限
			hasPerm, err := casbin2.Casbin.CheckPermission(sub, obj, act, db.CasbinPolicyTypeApp)
			if err != nil {
				return err
			}

			if hasPerm {
				return next(c)
			}

			err = permission.Permission.CheckGitlabAuth(uint(u.Uid), param.AppName, param.Env)
			if err != nil {
				return c.HTML(http.StatusForbidden,
					fmt.Sprintf("<div style=\"text-align:center;\">没有权限</div>"),
				)
			}

			return next(c)
		}

		return next(c)
	}
}

func AuthFailedResp(c echo.Context, msg, obj, act string) error {
	return c.JSON(http.StatusForbidden, map[string]interface{}{
		"code": output.MsgNoAuth,
		"msg":  msg,
		"data": map[string]interface{}{
			"obj": obj,
			"act": act,
		},
	})
}
