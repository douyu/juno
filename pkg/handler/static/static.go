package static

import (
	"path"

	"github.com/douyu/juno/pkg/library"
	"github.com/labstack/echo/v4"
)

func Static(root string) echo.HandlerFunc {
	return func(c echo.Context) error {
		filePath := path.Join(root, c.Request().URL.Path)
		if library.IsFile(filePath) {
			return c.File(filePath)
		}
		return c.File(path.Join(root, "index.html"))
	}
}

func File(file string) echo.HandlerFunc {
	return func(c echo.Context) error {
		return c.File(file)
	}
}
