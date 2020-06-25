package confgov2

import (
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/confgov2"
	"github.com/douyu/juno/internal/pkg/service/user"
	view2 "github.com/douyu/juno/pkg/model/view"
	"github.com/labstack/echo/v4"
)

//List 配置文件列表
func List(c echo.Context) (err error) {
	param := view2.ReqListConfig{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}

	list, err := confgov2.List(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "", list)
}

func Detail(c echo.Context) (err error) {
	param := view2.ReqDetailConfig{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}

	detail, err := confgov2.Detail(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "", detail)
}

func Create(c echo.Context) (err error) {
	param := view2.ReqCreateConfig{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效: "+err.Error())
	}

	err = confgov2.Create(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

func Update(c echo.Context) (err error) {
	param := view2.ReqUpdateConfig{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效: "+err.Error())
	}

	u := user.GetUser(c)

	err = confgov2.Update(u.Uid, param)
	if err != nil {
		if err == confgov2.ErrConfigNotExists {
			return output.JSON(c, output.MsgErr, "当前配置不存在，无法更新")
		}

		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "")
}

func Publish(c echo.Context) (err error) {
	param := view2.ReqPublishConfig{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效: "+err.Error())
	}

	err = confgov2.Publish(param)
	if err != nil {
		if err == confgov2.ErrConfigNotExists {
			return output.JSON(c, output.MsgErr, "当前配置不存在，无法发布")
		}

		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "")
}

func History(c echo.Context) (err error) {
	param := view2.ReqHistoryConfig{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效: "+err.Error())
	}

	history, err := confgov2.History(param)
	if err != nil {
		if err == confgov2.ErrConfigNotExists {
			return output.JSON(c, output.MsgErr, "当前配置不存在，无法更新")
		}

		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "", history)
}

func Diff(c echo.Context) (err error) {
	param := view2.ReqDiffConfig{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}

	resp, err := confgov2.Diff(param.ID)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "", resp)
}

func Delete(c echo.Context) (err error) {
	param := view2.ReqDiffConfig{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}

	err = confgov2.Delete(param.ID)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "")
}
