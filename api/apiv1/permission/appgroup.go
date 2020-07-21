package permission

import (
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/permission"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/labstack/echo/v4"
)

func ListAppGroup(c echo.Context) (err error) {
	list, err := permission.AppGroup.List()
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success", list)
}

func UpdateAppGroup(c echo.Context) (err error) {
	var param view.ReqUpdateGroup

	err = permission.AppGroup.Update(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

func ChangeAppGroup(c echo.Context) (err error) {
	var param view.ReqChangeAppGroup

	err = permission.AppGroup.ChangeAppGroup(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}
