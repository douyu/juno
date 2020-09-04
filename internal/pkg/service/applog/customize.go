package applog

import (
	"encoding/json"
	"fmt"

	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/errorconst"
	"github.com/douyu/jupiter/pkg/util/xtime"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/go-resty/resty/v2"
)

type customize struct {
	client       *resty.Client
	dashboardUrl string
	logStoreUrl  string
}

type resp struct {
	Code    int    `json:"code"`
	Message string `json:"msg"`
	Data    string `json:"data"`
}

//NewCustomize new customize
func newCustomize() *customize {
	return &customize{
		client:       resty.New().SetDebug(true).SetHeader("Content-Type", "application/json").SetTimeout(xtime.Duration("3s")),
		dashboardUrl: cfg.Cfg.AppLog.Default.DashboardUrl,
		logStoreUrl:  cfg.Cfg.AppLog.Default.LogStoreUrl,
	}
}

//DashboardUrl url for dashboard
func (c *customize) DashboardUrl(project, dashboard string) (string, error) {
	out, err := c.client.R().Get(fmt.Sprintf(c.dashboardUrl, project, dashboard))
	if err != nil {
		xlog.Error("DashboardUrl", xlog.String("step", "query"), xlog.String("project", project), xlog.String("dashboard", dashboard), xlog.Any("err", err.Error()))
		return "", errorconst.AppLogCustomizeDashboard.Error()
	}
	var result resp
	if err = json.Unmarshal(out.Body(), &result); err != nil {
		xlog.Error("DashboardUrl", xlog.String("step", "Unmarshal"), xlog.String("project", project), xlog.String("dashboard", dashboard), xlog.Any("err", err.Error()))
		return "", errorconst.AppLogCustomizeDashboard.Error()
	}
	return result.Data, nil
}

//LogStoreUrl url for log store
func (c *customize) LogStoreUrl(project, store, query string) (string, error) {
	out, err := c.client.R().Get(fmt.Sprintf(c.logStoreUrl, project, store, query))
	if err != nil {
		xlog.Error("DashboardUrl", xlog.String("step", "query"), xlog.String("project", project), xlog.String("store", store), xlog.String("query", query), xlog.Any("err", err.Error()))
		return "", errorconst.AppLogCustomizeDashboard.Error()
	}
	var result resp
	if err = json.Unmarshal(out.Body(), &result); err != nil {
		xlog.Error("DashboardUrl", xlog.String("step", "Unmarshal"), xlog.String("project", project), xlog.String("store", store), xlog.String("query", query), xlog.Any("err", err.Error()))
		return "", errorconst.AppLogCustomizeDashboard.Error()
	}
	return result.Data, nil
}
