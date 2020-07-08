package proxy

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/proxy"
	"github.com/douyu/juno/pkg/constx"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/juno/pkg/pb"
	"github.com/go-resty/resty/v2"
	"github.com/labstack/echo/v4"
)

// NodeHeartBeat 只有可用区的创建功能
func NodeHeartBeat(c echo.Context) error {
	var (
		err error
	)
	reqModel := view.ReqNodeHeartBeat{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	info, err := json.Marshal(reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	if proxy.StreamStore.IsStreamExist() {
		err = proxy.StreamStore.GetStream().Send(&pb.NotifyResp{
			MsgId: constx.MsgNodeHeartBeatResp,
			Msg:   info,
		})
		if err != nil {
			return output.JSON(c, output.MsgErr, err.Error())
		}
	} else {
		return output.JSON(c, output.MsgErr, "stream is not exist")
	}
	return output.JSON(c, output.MsgOk, "success")
}

// ConfigurationTakeEffect ..
func ConfigurationTakeEffect(c echo.Context) error {
	var err error
	reqModel := view.ReqHTTPProxy{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	// TODO 接口调用 权限限制
	// http://%s:%s/debug/config
	client := resty.New().SetTimeout(time.Duration(time.Second * 3))
	resp, err := client.R().SetHeader("Content-Type", "application/json").Get(reqModel.URL)
	if err != nil {
		return err
	}
	return c.HTMLBlob(http.StatusOK, resp.Body())
}

// ConfigurationUsed ..
func ConfigurationUsed(c echo.Context) error {
	var err error
	reqModel := view.ReqHTTPProxy{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	// TODO 接口调用 权限限制
	// http://%s/api/v1/conf/command_line/status
	client := resty.New().SetTimeout(time.Duration(time.Second * 3))
	resp, err := client.R().SetHeader("Content-Type", "application/json").SetBody(reqModel.Params).Post(reqModel.URL)
	if err != nil {
		return err
	}
	return c.HTMLBlob(http.StatusOK, resp.Body())
}
