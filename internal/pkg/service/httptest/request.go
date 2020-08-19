package httptest

import (
	"context"
	"net/http"
	"strings"

	"github.com/douyu/juno/internal/pkg/packages/xtest"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/go-resty/resty/v2"
	"golang.org/x/sync/errgroup"
)

type (
	Request struct {
		*resty.Request
		script string
		tester *xtest.XTest
	}

	HttpResponse struct {
		Body    string      `json:"body"`
		Status  int         `json:"status"`
		Headers http.Header `json:"headers"`
		Size    int64       `json:"size"`
	}
)

func SendRequest(uid uint, param view.ReqSendHttpRequest) (res view.HttpTestResponse, err error) {
	var testCase db.HttpTestCase
	var result xtest.TestResult
	var httpResp HttpResponse
	var req *Request

	// check test case
	err = option.DB.Where("id = ?", param.ID).Preload("Collection").First(&testCase).Error
	if err != nil {
		return
	}

	defer func() {
		reqQuery := make(db.HttpTestParam, 0)
		for k, v := range req.QueryParam {
			if len(v) == 0 {
				continue
			}

			reqQuery = append(reqQuery, db.HttpTestParamItem{
				Key:         k,
				Value:       v[0],
				Description: "",
			})
		}

		reqHeader := make(db.HttpTestParam, 0)
		for k, v := range req.Header {
			if len(v) == 0 {
				continue
			}

			reqHeader = append(reqHeader, db.HttpTestParamItem{
				Key:         k,
				Value:       v[0],
				Description: "",
			})
		}

		log := db.HttpTestLog{
			OperatorType:    "user",
			OperatorID:      uid,
			AppName:         testCase.Collection.AppName,
			Name:            param.Name,
			URL:             param.URL,
			Method:          param.Method,
			Query:           reqQuery,
			Headers:         reqHeader,
			Body:            req.Body.(string),
			ResponseBody:    res.Body,
			ResponseHeaders: res.Headers,
			Size:            res.Size,
			Cost:            res.TimeCost,
			Code:            res.Code,
			Status:          "success",
			Error:           "",
			TestLogs:        result.Logs,
		}

		if err != nil {
			log.Status = "failed"
			log.Error = err.Error()
		}

		if !result.Success {
			log.Status = "failed"
		}

		if result.Error != nil {
			log.Status = "failed"
			log.Error = result.Error.Error()
		}

		err := option.DB.Save(&log).Error
		if err != nil {
			xlog.Error("SendRequest save log failed", xlog.String("err", err.Error()))
		}
	}()

	req = newRequest(param.Script, param)
	result, err = req.Send(context.Background())
	if err != nil {
		return
	}

	httpResp = result.RawResponse.(HttpResponse)

	res.Body = httpResp.Body
	res.Code = httpResp.Status
	res.Size = httpResp.Size
	res.TimeCost = result.TimeCost.Milliseconds()
	res.Headers = httpResp.Headers
	res.Success = result.Success
	res.Logs = result.Logs
	if result.Error != nil {
		res.Error = result.Error.Error()
	}

	return
}

func RequestHistory(uid uint, param view.ReqListHttpTestHistory) (resp view.RespListHttpTestHistory, err error) {
	var logs []db.HttpTestLog
	var eg errgroup.Group

	query := option.DB.Where("app_name = ?", param.AppName).
		Where("operator_type = ?", "user").
		Where("operator_id = ?", uid)

	eg.Go(func() error {
		page := param.Page
		pageSize := param.PageSize
		if pageSize > 100 {
			pageSize = 100
		}
		if pageSize == 0 {
			pageSize = 10
		}
		offset := page * pageSize

		err = query.Limit(pageSize).Offset(offset).Order("id desc").Find(&logs).Error
		if err != nil {
			return err
		}

		resp.Pagination.Current = int(page)
		resp.Pagination.PageSize = int(pageSize)

		for _, log := range logs {
			resp.List = append(resp.List, view.HttTestLogListItem{
				ID:           log.ID,
				OperatorType: log.OperatorType,
				OperatorID:   log.OperatorID,
				Name:         log.Name,
				URL:          log.URL,
				Method:       log.Method,
				Size:         log.Size,
				Cost:         log.Cost,
				Code:         log.Code,
			})
		}

		return nil
	})

	eg.Go(func() error {
		return query.Model(&db.HttpTestLog{}).Count(&resp.Pagination.Total).Error
	})

	err = eg.Wait()
	if err != nil {
		return
	}

	return
}

func RequestHistoryDetail(historyID uint) (detail view.HttpTestLog, err error) {
	var log db.HttpTestLog

	err = option.DB.Where("id = ?", historyID).First(&log).Error
	if err != nil {
		return
	}

	detail = view.HttpTestLog{
		OperatorType:    log.OperatorType,
		OperatorID:      log.OperatorID,
		Name:            log.Name,
		URL:             log.URL,
		Method:          log.Method,
		Query:           log.Query,
		Headers:         log.Headers,
		ContentType:     log.ContentType,
		Body:            log.Body,
		ResponseBody:    log.ResponseBody,
		ResponseHeaders: log.ResponseHeaders,
		Size:            log.Size,
		Cost:            log.Cost,
		Code:            log.Code,
	}

	return
}

func newRequest(script string, param view.ReqSendHttpRequest) *Request {
	request := option.client.R()
	tester := xtest.New(xtest.WithInterpreter(xtest.InterpreterTypeJS))

	request.Method = strings.ToUpper(param.Method)
	request.URL = param.URL

	request.SetBody(param.Body)
	request.SetHeader("Content-Type", param.ContentType)
	for _, query := range param.Query {
		request.SetQueryParam(query.Key, query.Value)
	}
	for _, header := range param.Headers {
		request.SetHeader(header.Key, header.Value)
	}

	// register script functions
	{
		_ = tester.Interpreter().RegisterFunc("setHeader", func(key, val string) {
			request.SetHeader(key, val)
		})

		_ = tester.Interpreter().RegisterFunc("setQueryParam", func(key, val string) {
			request.SetQueryParam(key, val)
		})

		_ = tester.Interpreter().RegisterFunc("setBody", func(body string) {
			request.SetBody(body)
		})
	}

	return &Request{
		Request: request,
		tester:  tester,
		script:  script,
	}
}

func (r *Request) Send(c context.Context) (result xtest.TestResult, err error) {
	script := xtest.TestScript{Source: r.script}
	result = r.tester.Run(c, script, r.onRequest)
	return
}

func (r *Request) onRequest() (data xtest.Response, err error) {
	resp, err := r.Request.Send()
	if err != nil {
		return
	}

	data = HttpResponse{
		Body:    resp.String(),
		Status:  resp.StatusCode(),
		Headers: resp.Header(),
		Size:    resp.Size(),
	}
	return
}
