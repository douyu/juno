package grafana

import (
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/labstack/echo/v4"
	"net/http"
	"net/http/httputil"
)

type (
	Option struct {
		Flag           bool   `toml:"flag"`
		Host           string `toml:"host"`
		Scheme         string `toml:"scheme"`
		AuthHeaderName string `toml:"authHeaderName"`
	}
)

var (
	opt Option
)

func Init(o Option) {
	opt = o
}

// 通过这里获取设置，方便后面将设置集成到“系统设置”里面
func getOption() Option {
	return opt
}

func Proxy(c echo.Context) (err error) {
	opt := getOption()

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
