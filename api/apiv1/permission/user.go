package permission

import (
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/permission"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/labstack/echo/v4"
)

func ListUser(c echo.Context) (err error) {
	param := view.ReqListUser{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	resp, err := permission.User.List(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success", resp)
}
