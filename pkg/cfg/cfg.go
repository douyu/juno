// Copyright 2020 Douyu
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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

// Cfg ..
var Cfg cfg

type cfg struct {
	AppURL            string
	AppSubURL         string
	AuthProxyEnabled  bool
	DisableUserSignUp bool
	App               App
	Auth              Auth
	Server            Server
	GrafanaProxy      GrafanaProxy
	Gateway           Gateway
	ClientProxy       []ClientProxy
	ServerProxy       ServerProxy
	Database          Database
	Configure         Configure
}

// DefaultConfig ...
func defaultConfig() cfg {
	return cfg{
		AppURL:            "",
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
		Configure: Configure{
			Dir: "",
		},
		ClientProxy: []ClientProxy{
			{
				Name: "",
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
		},
		ServerProxy: ServerProxy{
			Name: "",
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

// InitCfg ...
func InitCfg() {
	var (
		err    error
		config = defaultConfig()
	)
	if err := conf.UnmarshalKey("", &config); err != nil {
		xlog.Panic("parse cfg error", xlog.FieldErrKind(ecode.ErrKindUnmarshalConfigErr), xlog.FieldErr(err), xlog.FieldKey("system cfg"), xlog.FieldValueAny(config))
	}

	config.AppURL, config.AppSubURL, err = parseAppAndSubURL(config.Server.Http.RootUrl)
	if err != nil {
		xlog.Panic("parse root url err", zap.Error(err))
	}
	config.parseHeartBeat()
	Cfg = config
	fmt.Println("config.database", config.Database)
}

func parseAppAndSubURL(rootURL string) (string, string, error) {
	appURL := rootURL
	if appURL[len(appURL)-1] != '/' {
		appURL += "/"
	}

	// Check if has app suburl.
	url, err := url.Parse(appURL)
	if err != nil {
		xlog.Fatal("invalid root url", zap.String("appUrl", appURL), zap.Error(err))
		return "", "", nil
	}
	appSubURL := strings.TrimSuffix(url.Path, "/")
	return appURL, appSubURL, nil
}

func (c *cfg) parseHeartBeat() {
	c.ServerProxy.Name = os.Getenv(c.ServerProxy.HeartBeat.Env) + "_" + os.Getenv(c.ServerProxy.HeartBeat.ZoneCode)
	c.ServerProxy.HeartBeat.RegionCode = os.Getenv(c.ServerProxy.HeartBeat.RegionCode)
	c.ServerProxy.HeartBeat.RegionName = os.Getenv(c.ServerProxy.HeartBeat.RegionName)
	c.ServerProxy.HeartBeat.ZoneCode = os.Getenv(c.ServerProxy.HeartBeat.ZoneCode)
	c.ServerProxy.HeartBeat.ZoneName = os.Getenv(c.ServerProxy.HeartBeat.ZoneName)
	c.ServerProxy.HeartBeat.HostName = GetHostName(c.ServerProxy.HeartBeat.HostName)
	env := os.Getenv(c.ServerProxy.HeartBeat.Env)
	if env != "" {
		c.ServerProxy.HeartBeat.Env = env
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
