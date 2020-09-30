package loggerplatform

import (
	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/loggerplatform"
	"github.com/douyu/juno/pkg/errorconst"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
)

// LogStore ..
func LogStore(c *core.Context) (err error) {

	var param view.ReqAliyunLogDefault
	err = c.Bind(&param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	xlog.Info("LogStore", xlog.String("step", "param"), xlog.Any("param", param))
	data, err := loggerplatform.LogStore(param)
	if err != nil {
		xlog.Error("LogStore", xlog.String("step", "logstore"), xlog.Any("err", "GetBaseLogger error: "+err.Error()), xlog.Any("param", param))
		return c.OutputJSON(output.MsgErr, err.Error())
	}
	if data == "" {
		return c.OutputJSON(output.MsgErr, errorconst.AppLogNoPermission.Error().Error())

	}
	return c.OutputJSON(output.MsgOk, "success", c.WithData(data))
}
