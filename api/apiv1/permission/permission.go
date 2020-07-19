package permission

import (
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/casbin"
	"github.com/labstack/echo/v4"
)

func MenuAPITree(c echo.Context) (err error) {
	return output.JSON(c, output.MsgOk, "success", casbin.Casbin.Resource.Permission)
}
