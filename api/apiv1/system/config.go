package system

import (
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/pkg/auth/authconfig"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/labstack/echo/v4"
)

// 配置文件数据给前端
func Config(c echo.Context) error {
	enabledOAuths := make(map[string]interface{})
	for key, oauth := range authconfig.OAuthService.OAuthInfos {
		enabledOAuths[key] = map[string]string{"name": oauth.Name}
	}
	viewSetting := map[string]interface{}{
		"appUrl":            cfg.Cfg.AppUrl,
		"authProxyEnabled":  cfg.Cfg.AuthProxyEnabled,
		"disableLoginForm":  cfg.Cfg.DisableLoginForm,
		"oauth":             enabledOAuths,
	}
	return output.JSON(c, output.MsgOk, "success", viewSetting)
}

