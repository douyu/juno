package clientproxy

import (
	"fmt"
	"time"

	"github.com/douyu/juno/pkg/constx"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/go-resty/resty/v2"
)

type RestyClient struct {
	conn *resty.Client
	mode string
	err  error
}

func NewRestyClient(mode string, proxyAddr string) (obj *RestyClient) {
	obj = &RestyClient{
		mode: mode,
	}
	obj.conn = resty.New().SetDebug(true).
		SetTimeout(3*time.Second).
		SetHeader("Content-Type", "application/json;charset=utf-8")
	if mode == constx.ModeMultiple {
		obj.conn.SetHostURL(proxyAddr)
	}
	return
}

func (r *RestyClient) Get(req view.ReqHTTPProxy) (*resty.Response, error) {
	if r.mode == constx.ModeMultiple {
		req.Type = "GET"
		r.conn.Debug = true
		return r.conn.R().SetBody(req).Post(req.URL)
	}
	return r.conn.R().SetQueryParams(req.Params).Get(fmt.Sprintf("http://%s%s", req.Address, req.URL))
}

func (r *RestyClient) Post(req view.ReqHTTPProxy) (*resty.Response, error) {
	if r.mode == constx.ModeMultiple {
		req.Type = "POST"
		r.conn.Debug = true
		return r.conn.R().SetBody(req).Post(req.URL)
	}
	return r.conn.R().SetBody(req.Params).Post(fmt.Sprintf("http://%s%s", req.Address, req.URL))
}
