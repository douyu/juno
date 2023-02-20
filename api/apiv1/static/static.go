package static

import (
	_ "embed"
	"log"
	"net/http"
	"net/url"
	"strings"

	"github.com/douyu/juno/assets"
	"github.com/douyu/juno/internal/app/middleware"
	"github.com/labstack/echo/v4"
)

func File(file string) echo.HandlerFunc {
	return func(c echo.Context) error {
		return c.File(file)
	}
}

var statikFS http.FileSystem

const (
	indexPage = "index.html"
)

func Static(e *echo.Echo, prefix string) {
	var err error
	statikFS, err = assets.Assets()
	if err != nil {
		log.Fatal("statikFS", err)
	}
	h := func(c echo.Context) error {
		p, err := url.PathUnescape(c.Request().URL.Path)

		if err != nil {
			return err
		}
		p = strings.TrimPrefix(p, prefix)
		return CFile(c, p)
	}
	e.GET("/", h, middleware.LoginAuth("/user/login", middleware.RedirectTypeHttp).Func())
	e.GET(prefix, h)
	e.GET(prefix+"/*", h)
}

// File 返回文件
func CFile(c echo.Context, file string) (err error) {
	if file == "/" {
		file += indexPage
	}
	if !strings.HasPrefix(file, "/") {
		file = "/" + file
	}
	f, err := statikFS.Open(file)

	if file != "" && err != nil {
		f, err = statikFS.Open(file + ".gz")
		if file != "" && err != nil {
			return echo.ErrNotFound
		}
	}
	defer f.Close()
	fi, _ := f.Stat()
	if fi.IsDir() {
		file = strings.Join([]string{file, indexPage}, "/")
		f, err = statikFS.Open(file)
		if err != nil {
			return echo.ErrNotFound
		}
		defer f.Close()
		if fi, err = f.Stat(); err != nil {
			return
		}
	}
	http.ServeContent(c.Response(), c.Request(), fi.Name(), fi.ModTime(), f)
	return
}
