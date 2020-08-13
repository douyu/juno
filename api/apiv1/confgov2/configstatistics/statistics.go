package configstatics

import (
	"time"

	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/confgov2"
	"github.com/labstack/echo/v4"
)

// Statics ..
func Statics(c echo.Context) error {
	end := time.Now().Unix()
	start := end - 86400*30
	envCnt, total, err := confgov2.StatisticsEnv()
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	cmcCnt, total, err := confgov2.StatisticsCommit(start, end)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	resp := RespStatics{
		EnvCnt: make([]Info, 0),
		CmcCnt: make([]Info, 0),
		Total:  total,
	}
	for _, v := range envCnt {
		item := Info{
			Name:  v.Env,
			Value: v.Cnt,
		}
		resp.EnvCnt = append(resp.EnvCnt, item)
	}
	for _, v := range cmcCnt {
		item := Info{
			Name:  v.DayTime,
			Value: v.Cnt,
		}
		resp.CmcCnt = append(resp.CmcCnt, item)
	}
	return output.JSON(c, output.MsgOk, "success", resp)
}
