package cfg

import (
	"github.com/douyu/jupiter/pkg/conf"
	"github.com/douyu/jupiter/pkg/ecode"
	"github.com/douyu/jupiter/pkg/xlog"
	"go.uber.org/zap"
	"net/url"
	"strings"
)

var Cfg cfg

type cfg struct {
	AppUrl            string
	AppSubUrl         string
	AuthProxyEnabled  bool
	DisableLoginForm  bool
	DisableUserSignUp bool
	App               App
	Auth              Auth
	Server            Server
}

// DefaultConfig ...
func defaultConfig() cfg {
	return cfg{
		AppUrl:            "",
		AuthProxyEnabled:  false,
		DisableLoginForm:  false,
		DisableUserSignUp: false,
		Auth: Auth{
			LoginCookieName:                  "juno_session",
			LoginMaximumInactiveLifetimeDays: 7,
			LoginMaximumLifetimeDays:         30,
			TokenRotationIntervalMinutes:     10,
			DisableLoginForm:                 false,
			DisableSignoutMenu:               false,
			SignoutRedirectUrl:               "",
			OauthAutoLogin:                   false,
			OauthStateCookieMaxAge:           60,
			ApiKeyMaxSecondsToLive:           -1,
		},
		Server: Server{
			Host:           "0.0.0.0",
			Port:           50000,
			Domain:         "",
			RootUrl:        "http://localhost:50000/",
			StaticRootPath: "",
			EnableGzip:     false,
		},
	}
}

// StdConfig ...
func InitCfg() {
	var (
		err    error
		config = defaultConfig()
	)
	if err := conf.UnmarshalKey("", &config); err != nil {
		xlog.Panic("parse cfg error", xlog.FieldErrKind(ecode.ErrKindUnmarshalConfigErr), xlog.FieldErr(err), xlog.FieldKey("system cfg"), xlog.FieldValueAny(config))
	}

	config.AppUrl, config.AppSubUrl, err = parseAppUrlAndSubUrl(config.Server.RootUrl)
	if err != nil {
		xlog.Panic("parse root url err", zap.Error(err))
	}
	Cfg = config
}

func parseAppUrlAndSubUrl(rootUrl string) (string, string, error) {
	appUrl := rootUrl
	if appUrl[len(appUrl)-1] != '/' {
		appUrl += "/"
	}

	// Check if has app suburl.
	url, err := url.Parse(appUrl)
	if err != nil {
		xlog.Fatal("invalid root url", zap.String("appUrl", appUrl), zap.Error(err))
		return "", "", nil
	}
	appSubUrl := strings.TrimSuffix(url.Path, "/")
	return appUrl, appSubUrl, nil
}
