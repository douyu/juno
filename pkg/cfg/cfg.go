package cfg

import (
	"fmt"
	"net/url"
	"os"
	"strings"

	"github.com/douyu/jupiter/pkg/conf"
	"github.com/douyu/jupiter/pkg/ecode"
	"github.com/douyu/jupiter/pkg/util/xtime"
	"github.com/douyu/jupiter/pkg/xlog"
	"go.uber.org/zap"
)

var Cfg cfg

//
type cfg struct {
	AppUrl            string
	AppSubUrl         string
	AuthProxyEnabled  bool
	DisableUserSignUp bool
	App               App
	Auth              Auth
	Server            Server
	GrafanaProxy      GrafanaProxy
	Gateway           Gateway
	Proxy             Proxy
	Database          Database
}

// DefaultConfig ...
func defaultConfig() cfg {
	return cfg{
		AppUrl:            "",
		AuthProxyEnabled:  false,
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
			Http: ServerSchema{
				Host:           "0.0.0.0",
				Port:           50000,
				Domain:         "",
				RootUrl:        "http://localhost:50000/",
				StaticRootPath: "",
				EnableGzip:     false,
			},
			Govern: ServerSchema{
				Host: "0.0.0.0",
				Port: 50001,
			},
		},
		GrafanaProxy: GrafanaProxy{
			Enable: false,
			Name:   "grafana",
		},
		Gateway: Gateway{
			Enable: false,
			Name:   "gateway",
		},
		Proxy: Proxy{
			Stream: ProxyStream{
				Enable:    false,
				ProxyAddr: nil,
			},
			HeartBeat: HeartBeat{
				Enable:     true,
				Debug:      false,
				Addr:       "stream",
				Internal:   xtime.Duration("60s"),
				HostName:   "",
				RegionCode: "",
				RegionName: "",
				ZoneCode:   "",
				ZoneName:   "",
				Env:        "",
			},
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

	config.AppUrl, config.AppSubUrl, err = parseAppUrlAndSubUrl(config.Server.Http.RootUrl)
	if err != nil {
		xlog.Panic("parse root url err", zap.Error(err))
	}
	config.parseHeartBeat()
	Cfg = config
	fmt.Println("config.database", config.Database)
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

func (c *cfg) parseHeartBeat() {
	c.Proxy.HeartBeat.RegionCode = os.Getenv(c.Proxy.HeartBeat.RegionCode)
	c.Proxy.HeartBeat.RegionName = os.Getenv(c.Proxy.HeartBeat.RegionName)
	c.Proxy.HeartBeat.ZoneCode = os.Getenv(c.Proxy.HeartBeat.ZoneCode)
	c.Proxy.HeartBeat.ZoneName = os.Getenv(c.Proxy.HeartBeat.ZoneName)
	c.Proxy.HeartBeat.HostName = GetHostName(c.Proxy.HeartBeat.HostName)
	env := os.Getenv(c.Proxy.HeartBeat.Env)
	if env != "" {
		c.Proxy.HeartBeat.Env = env
	}
}

// GetHostName ...
func GetHostName(hostName string) string {
	if host := os.Getenv(hostName); host != "" {
		return host
	}
	name, err := os.Hostname()
	if err != nil {
		return fmt.Sprintf("error:%s", err.Error())
	}
	return name
}
