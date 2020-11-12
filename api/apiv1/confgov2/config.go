package confgov2

import (
	"regexp"

	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/jupiter/pkg/xlog"

	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/assist"
	"github.com/douyu/juno/internal/pkg/service/confgov2"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/errorconst"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/labstack/echo/v4"
)

//List 配置文件列表
func List(c echo.Context) (err error) {
	param := view.ReqListConfig{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}

	err = c.Validate(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}

	list, err := confgov2.List(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "", list)
}

// Detail ..
func Detail(c echo.Context) (err error) {
	param := view.ReqDetailConfig{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}

	err = c.Validate(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}

	detail, err := confgov2.Detail(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "", detail)
}

// Create ..
func Create(c echo.Context) (err error) {
	param := view.ReqCreateConfig{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效: "+err.Error())
	}

	err = c.Validate(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效: "+err.Error())
	}

	fileNameRegex := regexp.MustCompile("^[a-zA-Z][a-zA-Z0-9_-]{1,32}$")
	if !fileNameRegex.MatchString(param.FileName) {
		return output.JSON(c, output.MsgErr, "无效的文件名")
	}

	resp, err := confgov2.Create(c, param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success", resp)
}

// Update ..
func Update(c echo.Context) (err error) {
	param := view.ReqUpdateConfig{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效: "+err.Error())
	}

	err = c.Validate(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}

	err = confgov2.Update(c, param)
	if err != nil {
		if err == errorconst.ParamConfigNotExists.Error() {
			return output.JSON(c, output.MsgErr, "当前配置不存在，无法更新")
		}
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "")
}

// Publish ..
func Publish(c *core.Context) (err error) {
	param := view.ReqPublishConfig{}
	err = c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, "参数无效: "+err.Error())
	}

	err = confgov2.Publish(param, c)
	if err != nil {
		if err == errorconst.ParamConfigNotExists.Error() {
			return c.OutputJSON(output.MsgErr, "当前配置不存在，无法发布")
		}
		return c.OutputJSON(output.MsgErr, err.Error())
	}
	return c.OutputJSON(output.MsgOk, "发布成功")
}

// History ..
func History(c echo.Context) (err error) {
	param := view.ReqHistoryConfig{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效: "+err.Error())
	}

	err = c.Validate(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}

	history, err := confgov2.History(param, user.GetUser(c).Uid)
	if err != nil {
		if err == errorconst.ParamConfigNotExists.Error() {
			return output.JSON(c, output.MsgErr, "当前配置不存在，无法更新")
		}

		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "", history)
}

// Diff ..
func Diff(c echo.Context) (err error) {
	param := view.ReqDiffConfig{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}

	//老业务对比流程
	if param.ID > 0 {
		resp, err := confgov2.Diff(param.ID, param.HistoryID)
		if err != nil {
			return output.JSON(c, output.MsgErr, err.Error())
		}
		return output.JSON(c, output.MsgOk, "", resp)
	}

	//对比已发布的跟服务器实际运行的配置
	resp, err := confgov2.DiffVersion(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "", resp)

}

// DiffReleaseConfig ..
func DiffReleaseConfig(c echo.Context) (err error) {
	param := view.ReqDiffReleaseConfig{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}
	resp, err := confgov2.DiffReleaseConfig(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "", resp)
}

// Delete ..
func Delete(c echo.Context) (err error) {
	param := view.ReqDeleteConfig{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}

	err = c.Validate(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}

	err = confgov2.Delete(c, param.ID)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "")
}

// InstanceList ..
func InstanceList(c echo.Context) (err error) {
	param := view.ReqConfigInstanceList{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}
	err = c.Validate(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}
	resp, err := confgov2.Instances(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error(), resp)
	}
	return output.JSON(c, output.MsgOk, "success", resp)
}

// AppAction ..
func AppAction(c echo.Context) (err error) {
	param := view.ReqAppAction{}
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}
	err = c.Validate(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}

	xlog.Debug("AppAction", xlog.String("setp", "begin"), xlog.Any("param", param), xlog.String("url", cfg.Cfg.Assist.Action.URL))
	resp, err := assist.Action(
		c,
		view.AppAction{
			Action:   param.Action,
			AppName:  param.AppName,
			NodeName: param.NodeName,
			Typ:      param.Typ,
		})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, resp.Code, resp.Msg, resp.Data)
}

// InstanceConfigContent  ...
func InstanceConfigContent(c *core.Context) (err error) {
	param := view.ReqReadInstanceConfig{}
	err = c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	err = c.Validate(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+err.Error())
	}

	configContents, err := confgov2.ReadInstanceConfig(param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(configContents))
}

func Lock(c *core.Context) (err error) {
	param := view.ReqLockConfig{}
	err = c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, "invalid params "+err.Error())
	}

	u := user.GetUser(c)
	err = confgov2.TryLock(uint(u.Uid), param.ConfigID)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success")
}

func Unlock(c *core.Context) (err error) {
	param := view.ReqLockConfig{}
	err = c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, "invalid params "+err.Error())
	}

	u := user.GetUser(c)
	err = confgov2.Unlock(uint(u.Uid), param.ConfigID)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success")
}
