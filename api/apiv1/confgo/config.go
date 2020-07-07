package confgo

import (
	"time"

	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/confgo"
	"github.com/labstack/echo/v4"
)

// ConfigStatics ..
func ConfigStatics(c echo.Context) error {
	end := time.Now().Unix()
	start := end - 86400*30
	envCnt, cmcCnt, total, err := confgo.ConfuSrv.GetCmcStat(start, end)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	resp := RespStatics{
		EnvCnt: make([]ConfigStaticsInfo, 0),
		CmcCnt: make([]ConfigStaticsInfo, 0),
		Total:  total,
	}

	for _, v := range envCnt {
		item := ConfigStaticsInfo{
			Name:  v.Env,
			Value: v.Cnt,
		}
		resp.EnvCnt = append(resp.EnvCnt, item)
	}
	for _, v := range cmcCnt {
		item := ConfigStaticsInfo{
			Name:  v.DayTime,
			Value: v.Cnt,
		}
		resp.CmcCnt = append(resp.CmcCnt, item)
	}

	return output.JSON(c, output.MsgOk, "success", resp)
}
