package system

import (
	"fmt"

	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/system"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/labstack/echo/v4"
)

//SettingList 设置项列表
func SettingList(c echo.Context) error {
	settings, err := system.System.Setting.GetAll()
	if err != nil {
		return output.JSON(c, output.MsgErr, "获取系统设置失败:"+err.Error())
	}

	return output.JSON(c, output.MsgOk, "", settings)
}

//SettingUpdate 设置项更新
func SettingUpdate(c echo.Context) error {
	req := view.ReqUpdateSettings{}
	err := c.Bind(&req)
	if err != nil {
		return output.JSON(c, output.MsgErr, "无效的参数:"+err.Error())
	}

	settingName := req.Name
	config, ok := view.GetSettingFieldConfig(settingName)
	if !ok {
		// 没有配置该设置项
		return output.JSON(c, output.MsgErr, "无效的设置项:"+string(req.Name))
	}

	// 校验参数
	if err := config.Validate(req.Content); err != nil {
		return output.JSON(c, output.MsgErr, fmt.Sprintf("参数校验失败: %s", err.Error()))
	}

	err = system.System.Setting.Set(req.Name, req.Content)
	if err != nil {
		return output.JSON(c, output.MsgErr, "保存失败:"+err.Error())
	}

	return output.JSON(c, output.MsgOk, "Success")
}

func SettingCreate(c echo.Context) error {
	req := view.ReqUpdateSettings{}
	err := c.Bind(&req)
	if err != nil {
		return output.JSON(c, output.MsgErr, "无效的参数:"+err.Error())
	}

	settingName := req.Name
	config, ok := view.GetSettingFieldConfig(settingName)
	if !ok {
		// 没有配置该设置项
		return output.JSON(c, output.MsgErr, "无效的设置项:"+string(req.Name))
	}

	// 校验参数
	if err := config.Validate(req.Content); err != nil {
		return output.JSON(c, output.MsgErr, fmt.Sprintf("参数校验失败: %s", err.Error()))
	}

	err = system.System.Setting.Create(req.Name, req.Content)
	if err != nil {
		return output.JSON(c, output.MsgErr, "保存失败:"+err.Error())
	}

	return output.JSON(c, output.MsgOk, "Success")
}
