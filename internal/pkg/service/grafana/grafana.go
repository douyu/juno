package grafana

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/system"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
)

type (
	Option struct {
		Host           string `toml:"host"`
		Scheme         string `toml:"scheme"`
		AuthHeaderName string `toml:"authHeaderName"`
	}
)

// 通过这里获取设置，方便后面将设置集成到“系统设置”里面
func getOption() (opt Option, err error) {
	var ErrNotConfigured error = fmt.Errorf("未配置Grafana")
	opt = Option{
		Host:           "",
		Scheme:         "",
		AuthHeaderName: "",
	}

	settingContent, err := system.System.Setting.Get(cfg.Cfg.GrafanaProxy.Name)
	if err != nil {
		log.Error("get grafana setting failed:" + err.Error())
		return
	}

	if settingContent == "" {
		err = ErrNotConfigured
		return
	}

	setting := view.SettingGrafana{}
	err = json.Unmarshal([]byte(settingContent), &setting)
	if err != nil {
		log.Error("unmarshal grafana setting failed:" + err.Error())
		return
	}

	if setting.Host == "" {
		err = ErrNotConfigured
		return
	}

	grafanaUrl, err := url.Parse(setting.Host)
	if err != nil {
		log.Error("unmarshal grafana setting failed:" + err.Error())
		err = fmt.Errorf("无效的Grafana地址")
		return
	}

	opt.Scheme = grafanaUrl.Scheme
	opt.Host = grafanaUrl.Host
	opt.AuthHeaderName = setting.HeaderName

	return
}

func Proxy(c echo.Context) (err error) {
	opt, err := getOption()
	if err != nil {
		return output.JSON(c, 1, err.Error())
	}

	u := user.GetUser(c)
	if u == nil {
		return c.Redirect(http.StatusTemporaryRedirect, "/user/login")
	}

	reverseProxy := httputil.ReverseProxy{
		Director: func(req *http.Request) {
			req.URL.Scheme = opt.Scheme
			req.URL.Host = opt.Host
			req.URL.Path = c.Request().URL.Path

			req.Header.Add(opt.AuthHeaderName, u.Username)
		},
		ErrorHandler: func(w http.ResponseWriter, r *http.Request, e error) {
			if e != nil {
				err = e
			}
		},
	}

	reverseProxy.ServeHTTP(c.Response(), c.Request())

	return
}
