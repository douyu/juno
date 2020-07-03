package middleware

import (
	"errors"
	"github.com/douyu/juno/internal/pkg/service/user"
	"net/http"
	"strconv"

	"github.com/casbin/casbin/v2"
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

			if pass, err := config.CheckPermission(c); err == nil && pass {
				return next(c)
			} else if err != nil {
				return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
			}

			return echo.ErrForbidden
		}
	}
}

// CheckPermission checks the user/method/path combination from the request.
// Returns true (permission granted) or false (permission forbidden)
func (a *CasbinConfig) CheckPermission(c echo.Context) (bool, error) {
	u := user.GetUser(c)
	if !u.IsLogin() {
		return false, errors.New("no user")
	}
	path := c.Request().URL.Path
	appName := c.QueryParam("appname")

	// app name is empty
	if appName == "" {
		appName = "juno_default"
	}

	return a.Enforcer.Enforce(strconv.Itoa(u.Uid), appName, path)
}

func AllowPathPrefixSkipper(prefixes ...string) func(c echo.Context) bool {
	return func(c echo.Context) bool {
		path := c.Request().URL.Path
		pathLen := len(path)
		for _, p := range prefixes {
			if pl := len(p); pathLen >= pl && path[:pl] == p {
				return true
			}
		}
		return false
	}
}
