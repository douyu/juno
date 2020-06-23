package confgo

import (
	"fmt"

	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/confgo"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/jinzhu/gorm"
	"github.com/labstack/echo/v4"
)

// ListVersions ..
func ListVersions(c echo.Context) error {
	var err error
	reqModel := new(db.CmcHistory)
	if err = c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	if reqModel.Caid == 0 {
		return output.JSON(c, output.MsgErr, "caid不能为空")
	}

	res, err := confgo.HistorySrv.ListVersions(reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "", res)
}

// VersionChange View historical version snapshot
func VersionChange(c echo.Context) error {
	var err error
	reqModel := new(db.CmcHistory)
	if err = c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	if reqModel.ID == 0 {
		return output.JSON(c, output.MsgErr, "id不能为空")
	}
	result, err := confgo.HistorySrv.GetHistoryChange(reqModel.ID)
	if err != nil {
		return output.JSON(c, output.MsgErr, "查询失败:"+err.Error())
	}
	return output.JSON(c, output.MsgOk, "", result)
}

// VersionChangeOrigin View current modifications and last published version
func VersionChangeOrigin(c echo.Context) error {
	var err error
	reqModel := new(db.CmcHistory)
	if err = c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	if reqModel.Caid == 0 {
		return output.JSON(c, output.MsgErr, "caid不能为空")
	}
	// 上次发布
	result, err := confgo.HistorySrv.GetPrePublish(reqModel.Caid)
	if err != nil && err != gorm.ErrRecordNotFound { // 第一次发布没有历史记录
		return output.JSON(c, output.MsgErr, "查询失败:"+err.Error())
	}
	// 本地保存的配置
	cfgs, err := confgo.ConfuSrv.GetAppKVs(reqModel.Caid, 0)
	if err != nil {
		return output.JSON(c, output.MsgErr, "查询失败:"+err.Error())
	}

	typ, _, _, err := confgo.ConfuSrv.GetConfigTyp(reqModel.Caid)
	if err != nil {
		return output.JSON(c, output.MsgErr, "查询失败:"+err.Error())
	}
	text, _, err := confgo.FormatByKvs(cfgs, typ, "")
	if err != nil {
		return output.JSON(c, output.MsgErr, fmt.Sprintf("配置编码错误%s", err.Error()))
	}

	return output.JSON(c, output.MsgOk, "", map[string]interface{}{
		"pre": result.Text,
		"now": text,
	})
}
