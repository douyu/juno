package clientproxy

import (
	"fmt"
	"time"

	"github.com/douyu/juno/pkg/constx"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/go-resty/resty/v2"
)

//ClientDefaultTimeout ..
const ClientDefaultTimeout = 1

type restyClient struct {
	conn *resty.Client
	mode string
	err  error
}

func newRestyClient(mode string, proxyAddr string) (obj *restyClient) {
	obj = &restyClient{
		mode: mode,
	}
	obj.conn = resty.New().SetDebug(true).
		SetTimeout(ClientDefaultTimeout*time.Second).
		SetHeader("Content-Type", "application/json;charset=utf-8")
	if mode == constx.ModeMultiple {
		obj.conn.SetHostURL(proxyAddr)
	}
	return
}

//Get ..
func (r *restyClient) Get(req view.ReqHTTPProxy) (*resty.Response, error) {
	timeout := req.Timeout
	if timeout == 0 {
		timeout = ClientDefaultTimeout
	}
	request := r.conn.SetTimeout(time.Duration(timeout) * time.Second).R().SetBody(req.Body).SetQueryParams(req.Params)
	if r.mode == constx.ModeMultiple {
		req.Type = "GET"
		r.conn.Debug = true
		return request.Post(req.URL)
	}

	return request.Get(fmt.Sprintf("http://%s%s", req.Address, req.URL))
}

//Post ..
func (r *restyClient) Post(req view.ReqHTTPProxy) (*resty.Response, error) {
	timeout := req.Timeout
	if timeout == 0 {
		timeout = ClientDefaultTimeout
	}
	request := r.conn.SetTimeout(time.Duration(timeout) * time.Second).R().SetBody(req.Body).SetQueryParams(req.Params)
	if r.mode == constx.ModeMultiple {
		req.Type = "POST"
		r.conn.Debug = true
		return request.Post(req.URL)
	}

	return request.Post(fmt.Sprintf("http://%s%s", req.Address, req.URL))
}
