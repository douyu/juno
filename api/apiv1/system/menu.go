package system

import (
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	casbin2 "github.com/douyu/juno/internal/pkg/service/casbin"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/labstack/echo/v4"
)

func MenuList(c echo.Context) (err error) {
	u := user.GetUser(c)

	menu, err := casbin2.Casbin.UserMenu(u)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "", menu)
}
