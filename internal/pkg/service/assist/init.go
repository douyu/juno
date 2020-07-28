package assist

import (
	"encoding/json"
	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/errorconst"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
)

// Action ...
func Action(param view.AppAction) (action view.RespAppAction, err error) {
	resp, err := invoker.Resty.R().SetBody(param).Post(cfg.Cfg.Assist.Action.URL)
	if err!= nil {
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
	return out, nil
}
