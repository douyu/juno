package system

import (
	"github.com/douyu/juno/internal/pkg/model/db"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/system"
	"github.com/labstack/echo/v4"
)

// 可用区信息
func OptionInfo(c echo.Context) error {
	var (
		err  error
		info db.Option
	)
	reqModel := ReqOptionInfo{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	info, err = system.System.GetOptionInfo(db.Option{
		Id:          reqModel.Id,
		OptionTitle: reqModel.OptionTitle,
	})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", info)
}

// 可用区列表
func OptionList(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqOptionList{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	list, pagination, err := system.System.GetOptionList(db.Option{}, reqModel.CurrentPage, reqModel.PageSize, "update_time desc")
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", map[string]interface{}{
		"pagination": pagination,
		"list":       list,
	})
}

// 只有可用区的创建功能
func OptionCreate(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqOptionCreate{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	err = system.System.CreateOption(reqModel.Option, &db.User{})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success")
}

// 只有可用区的更新功能
func OptionUpdate(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqOptionUpdate{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	err = system.System.UpdateOption(reqModel.Option, &db.User{})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success")
}

// 只有可用区的删除功能
func OptionDelete(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqOptionDelete{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	err = system.System.DeleteOption(reqModel.Option, &db.User{})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success")
}
