package permission

import (
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/casbin"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/labstack/echo/v4"
)

func ListMenu(c echo.Context) (err error) {
	u := user.GetUser(c)

	menu, err := casbin.Casbin.UserMenu(u)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success", menu)
}
