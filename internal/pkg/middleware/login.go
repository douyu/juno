package middleware

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/labstack/echo/v4"
)

var DefaultAuth = Auth{}

type Auth struct {
	Authenticator func(echo.Context) error
	Unauthorized  func(echo.Context) error
}

func (a Auth) Func() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(context echo.Context) error {
			if err := a.Authenticator(context); err != nil {
				return a.Unauthorized(context)
			}
			return next(context)
		}
	}
}

type RedirectType string

const (
	RedirectTypeHttp RedirectType = "http_redirect"
	RedirectTypeJson RedirectType = "json_redirect"
)

var RedirectParam string = "return_url"

func LoginAuth(loginURL string, redirectType RedirectType) *Auth {
	return &Auth{
		Authenticator: func(context echo.Context) error {
			u := user.GetUser(context)
			if u == nil {
				return errors.New("no session")
			}
			err := user.Session.Save(context, u)
			if err != nil {
				return errors.New(fmt.Sprintf("update session err: %s", err.Error()))
			}
			context.Set("user", u)
			return nil
		},
		Unauthorized: func(context echo.Context) error {
			auth := context.Request().Header.Get("dy_auth")
			if auth != "" {
				return nil
			}
			if redirectType == RedirectTypeHttp {
				return context.Redirect(http.StatusFound, "/user/login?return_url="+context.Request().URL.EscapedPath())
			}
			return context.JSON(http.StatusOK, map[string]interface{}{
				"code": 302,
				"msg":  fmt.Sprintf("%s?%s=%s", loginURL, RedirectParam, context.Request().RequestURI),
				"data": "",
			})
		},
	}
}
