package static

import (
	_ "embed"
	"log"
	"net/http"
	"net/url"

	"github.com/douyu/juno/assets"
	"github.com/labstack/echo/v4"
)

func File(file string) echo.HandlerFunc {
	return func(c echo.Context) error {
		return c.File(file)
	}
}

var statikFS http.FileSystem
var (
	Prefix = ""
)

func Static(e *echo.Echo, prefix string) {
	Prefix = prefix
	var err error
	statikFS, err = assets.Assets()
	if err != nil {
		log.Fatal("statikFS", err)
	}

	h := func(c echo.Context) error {
		_, err := url.PathUnescape(c.Request().URL.Path)
		if err != nil {
			return err
		}
		hanlde := FileServer(Dir("./"))
		hanlde.ServeHTTP(c.Response(), c.Request())
		return nil
	}
	e.GET("/", h)
	e.GET(prefix, h)
	e.GET(prefix+"/*", h)
}
