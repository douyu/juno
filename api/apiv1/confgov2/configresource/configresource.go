package configresource

import (
	"regexp"

	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/configresource"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/labstack/echo/v4"
)

//List 资源列表
func List(c echo.Context) (err error) {
	param := view.ReqListConfigResource{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "invalid param:"+err.Error())
	}

	u := user.GetUser(c)

	resp, err := configresource.List(u.Uid, param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "", resp)
}

//Create 创建资源
func Create(c echo.Context) (err error) {
	param := view.ReqCreateConfigResource{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "invalid param:"+err.Error())
	}

	err = c.Validate(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	if !regexp.MustCompile(configresource.ResourceNameRegex).MatchString(param.Name) {
		return output.JSON(c, output.MsgErr, "无效的资源名称，需要符合规则:"+configresource.ResourceNameRegex)
	}

	u := user.GetUser(c)

	err = configresource.Create(u.Uid, param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "")
}

//Detail 配置资源详情(包括历史版本列表等)
func Detail(c echo.Context) (err error) {
	param := view.ReqDetailConfigResource{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "invalid param:"+err.Error())
	}

	resp, err := configresource.Detail(param.ID)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "", resp)
}

//GetByName 通过资源名称进行查询资源详情
func GetByName(c echo.Context) (err error) {
	param := view.ReqGetConfigResourceByName{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "invalid param:"+err.Error())
	}

	u := user.GetUser(c)
	resp, err := configresource.GetByName(u, param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "", resp)
}

//CreateVersion 增加新版本
func CreateVersion(c echo.Context) (err error) {
	param := view.ReqCreateConfigResourceVersion{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "invalid param:"+err.Error())
	}

	err = configresource.CreateVersion(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "")
}

//BatchCheckVersion 批量检查依赖版本
func BatchCheckVersion(c echo.Context) (err error) {
	param := view.ReqBatchCheckResourceVersion{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "invalid param:"+err.Error())
	}

	resp, err := configresource.BatchCheckVersion(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "", resp)
}

func Tags(c echo.Context) (err error) {
	tags, err := configresource.Tags()
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "", tags)
}
