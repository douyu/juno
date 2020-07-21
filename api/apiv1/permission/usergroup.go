package permission

import (
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/casbin"
	"github.com/douyu/juno/internal/pkg/service/permission"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/labstack/echo/v4"
)

func ListUserGroup(c echo.Context) (err error) {
	list, err := permission.UserGroup.List()
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "", list)
}

func UpdateUserGroup(c echo.Context) (err error) {
	var param view.ReqUpdateGroup

	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	err = permission.UserGroup.Update(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

func ChangeUserGroup(c echo.Context) (err error) {
	var param view.ReqChangeUserGroup

	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	err = permission.UserGroup.ChangeUserGroup(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

func SetAPIPerm(c echo.Context) (err error) {
	var param view.ReqSetGroupAPIPerm
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	err = permission.UserGroup.SetAPIPerm(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

func SetMenuPerm(c echo.Context) (err error) {
	var param view.ReqSetGroupMenuPerm
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	err = permission.UserGroup.SetMenuPerm(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

func GetMenuPerm(c echo.Context) (err error) {
	var param view.ReqGetGroupMenuPerm
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	resp, err := permission.UserGroup.GetMenuPerm(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success", resp)
}

func GetAPIPerm(c echo.Context) (err error) {
	var param view.ReqGetGroupAPIPerm
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	perm, err := permission.UserGroup.GetAPIPerm(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "", perm)
}

func SetAppPerm(c echo.Context) (err error) {
	var param view.ReqSetGroupAppPerm

	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	err = permission.UserGroup.CreateAppPermission(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

func GetAppPerm(c echo.Context) (err error) {

	return output.JSON(c, output.MsgOk, "success")
}

func AppPermissionList(c echo.Context) (err error) {
	return output.JSON(c, output.MsgOk, "success", casbin.Casbin.AppPermissionList())
}
