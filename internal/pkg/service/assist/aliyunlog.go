package assist

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/errorconst"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
)

//AliyunLog Gets the aliyun log access address
func AliyunLog(project, logStore, query string) (url string, err error) {
	if project == "" || logStore == "" {
		return "", errorconst.AppLogDefaultLogStore.Error()
	}

	xlog.Info("AliyunLog", xlog.String("step", "param"), xlog.Any("(cfg.Cfg.AppLog.Default.LogStoreUrl", fmt.Sprintf(cfg.Cfg.AppLog.Default.LogStoreUrl, project, logStore, query)))

	resp, err := invoker.Resty.R().Get(fmt.Sprintf(cfg.Cfg.AppLog.Default.LogStoreUrl, project, logStore, query))
	if err != nil {
		xlog.Error("AliyunLog", xlog.String("step", "query"), xlog.String("logStore", logStore), xlog.String(query, query), xlog.String("url", fmt.Sprintf(cfg.Cfg.AppLog.Default.LogStoreUrl, logStore, query)), xlog.String("error", err.Error()))
		return
	}
	var out view.RespAliyunLogDefault
	if err = json.Unmarshal(resp.Body(), &out); err != nil {
		xlog.Error("AliyunLog", xlog.String("step", "Unmarshal"), xlog.Any("resp.Body(", string(resp.Body())), xlog.String("url", fmt.Sprintf(cfg.Cfg.AppLog.Default.LogStoreUrl, logStore, query)), xlog.String("error", err.Error()))
		return
	}
	if out.Code != 0 {
		return "", errors.New(out.Msg)
	}
	return out.Data, nil
}
