package permission

import (
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/casbin"
	"github.com/labstack/echo/v4"
)

func ListAPI(c echo.Context) error {
	return output.JSON(c, output.MsgOk, "", casbin.Casbin.Resource.API)
}
