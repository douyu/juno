package static

import (
	"github.com/labstack/echo/v4"
)

func File(file string) echo.HandlerFunc {
	return func(c echo.Context) error {
		return c.File(file)
	}
}
