package assist

import (
	"encoding/json"

	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/service/appevent"
	"github.com/douyu/juno/internal/pkg/service/openauth"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/errorconst"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/labstack/echo/v4"
)

//Action ...
func Action(c echo.Context, param view.AppAction) (action view.RespAppAction, err error) {
	var app db.AppInfo
	var node db.AppNode

	err = invoker.JunoMysql.Where("app_name = ?", param.AppName).First(&app).Error
	if err != nil {
		return
	}

	err = invoker.JunoMysql.Where("host_name = ?", param.NodeName).First(&node).Error
	if err != nil {
		return
	}

	resp, err := invoker.Resty.R().SetBody(param).Post(cfg.Cfg.Assist.Action.URL)
	if err != nil {
		xlog.Error("Action", xlog.String("setp", "query"), xlog.Any("param", param), xlog.String("url", cfg.Cfg.Assist.Action.URL), xlog.String("error", err.Error()))
		return
	}
	var out view.RespAppAction
	if err = json.Unmarshal(resp.Body(), &out); err != nil {
		xlog.Error("Action", xlog.String("setp", "Unmarshal"), xlog.Any("param", param), xlog.String("url", cfg.Cfg.Assist.Action.URL), xlog.String("error", err.Error()))
		return
	}
	if out.Code != 0 {
		out.Code = int(errorconst.AppActionFailed.Code())
		out.Msg = errorconst.AppActionFailed.Name()
		return out, errorconst.AppActionFailed.Error()
	}

	metadata, _ := json.Marshal(&param)
	u := user.GetUser(c)
	ok, accessToken := openauth.GetAccessToken(c)
	if ok {
		switch param.Action {
		case "restart":
			appevent.AppEvent.OpenAPIAppRestart(
				app.Aid, app.AppName, node.ZoneCode, node.Env, node.HostName, string(metadata), accessToken)
		}
	} else {
		switch param.Action {
		case "restart":
			appevent.AppEvent.UserAppRestart(
				app.Aid, app.AppName, node.ZoneCode, node.Env, node.HostName, string(metadata), u)
		}
	}

	return out, nil
}
