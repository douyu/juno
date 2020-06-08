package confgo

import (
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/packages/proxy"
	"github.com/douyu/jupiter/pkg/conf"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
)

func AppRestart(c echo.Context) error {
	reqModel := new(struct {
		AppName  string `json:"app_name" form:"app_name"`
		IdcCode  string `json:"idc_code" form:"idc_code"`
		HostName string `json:"host_name" form:"host_name"`
		Action   string `json:"action" form:"action"`
		Caid     int    `json:"caid" form:"caid"`
	})
	if err := c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error(), nil)
	}
	// todo 用户权限验证，验证用户对当前app的操作权限

	// todo 获取ip数据以及重启的操作类型
	ip := "127.0.0.1"
	port := conf.GetInt("confgo.agent.port")
	resp, err := proxy.Confgo.AppRestart(ip, port, reqModel.AppName, "supervisor")
	if err != nil {
		log.Error("AppAction", "err", "CallAppSystemd error: "+err.Error(), "req", reqModel)
		return output.JSON(c, output.MsgErr, err.Error(), nil)
	}

	// todo 触发event事件
	return output.JSON(c, output.MsgOk, "", resp)
}
