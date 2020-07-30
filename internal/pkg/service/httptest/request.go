package httptest

import (
	"strings"

	"golang.org/x/sync/errgroup"

	"github.com/douyu/jupiter/pkg/xlog"

	"github.com/douyu/juno/pkg/model/db"

	"github.com/douyu/juno/pkg/model/view"
	"github.com/go-resty/resty/v2"
)

func SendRequest(uid uint, param view.ReqSendHttpRequest) (res view.HttpTestResponse, err error) {
	var response *resty.Response
	var testCase db.HttpTestCase

	// check test case
	err = option.DB.Where("id = ?", param.ID).Preload("Collection").First(&testCase).Error
	if err != nil {
		return
	}

	defer func() {
		log := db.HttpTestLog{
			OperatorType:    "user",
			OperatorID:      uid,
			AppName:         testCase.Collection.AppName,
			Name:            param.Name,
			URL:             param.URL,
			Method:          param.Method,
			Query:           param.Query,
			Headers:         param.Headers,
			ContentType:     param.ContentType,
			Body:            param.Body,
			ResponseBody:    res.Body,
			ResponseHeaders: res.Headers,
			Size:            res.Size,
			Cost:            res.TimeCost,
			Code:            res.Code,
			Status:          "success",
			Error:           "",
		}

		if err != nil {
			log.Status = "failed"
			log.Error = err.Error()
		}

		err := option.DB.Save(&log).Error
		if err != nil {
			xlog.Error("SendRequest save log failed", xlog.String("err", err.Error()))
		}
	}()

	response, err = sendRequest(param)
	if err != nil {
		return
	}

	res.Body = response.String()
	res.Code = response.StatusCode()
	res.Size = response.Size()
	res.TimeCost = response.Time().Milliseconds()
	res.Headers = response.Header()

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

func sendRequest(param view.ReqSendHttpRequest) (response *resty.Response, err error) {
	req := option.client.R()
	req.Method = strings.ToUpper(param.Method)
	req.URL = param.URL

	response, err = req.Send()
	if err != nil {
		return
	}

	return
}
