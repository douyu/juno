package confgo

import (
	"github.com/douyu/juno/internal/pkg/model/db"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/confgo"
	"github.com/labstack/echo/v4"
)

// StatusList Application configuration usage status
func StatusList(c echo.Context) error {
	var err error
	reqModel := new(db.CmcHistory)
	if err = c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	list, err := confgo.ConfuSrv.UsingStatus(reqModel.Caid)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	// todo 根据env获取prometheus中的启动时间
	return output.JSON(c, output.MsgOk, "", list)
}

// StatusRefresh Sync application configuration usage status
func StatusRefresh(c echo.Context) error {
	reqModel := new(struct {
		Caid int `json:"caid"`
	})
	if err := c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	list, err := confgo.ConfuSrv.StatusRefresh(reqModel.Caid)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	// Update the database
	if err := confgo.ConfuSrv.UpdateNewStatus(list); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "", list)
}
