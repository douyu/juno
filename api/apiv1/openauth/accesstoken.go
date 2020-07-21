package openauth

import (
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/openauth"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/labstack/echo/v4"
)

func CreateAccessToken(c echo.Context) (err error) {
	var param view.ReqCreateAccessToken
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	accessToken, err := openauth.OpenAuthService.Create(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success", accessToken)
}

func DeleteAccessToken(c echo.Context) (err error) {
	var param view.ReqDeleteAccessToken
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	err = openauth.OpenAuthService.Delete(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

func ListAccessToken(c echo.Context) (err error) {
	var param view.ReqListAccessToken
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	list, err := openauth.OpenAuthService.List(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success", list)
}
