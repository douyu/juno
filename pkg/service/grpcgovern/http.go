package grpcgovern

import (
	"encoding/json"
	"errors"

	"github.com/go-resty/resty/v2"
)

type governCommonResp struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
}

// PostJSON post json 数据请求
func (g *GrpcGovern) Post(env, zoneCode string, url string, v interface{}, resp interface{}) (err error) {
	domain := g.getDomain(GenNewZoneCode(env, zoneCode))
	// 根据机房信息,获取域名
	if domain == "" {
		err = errors.New("该环境与机房并未查询到该应用相关数据")
		return
	}

	var output *resty.Response
	output, err = g.R().SetHeader("Authorization", g.Token).SetBody(v).Post(domain + url)
	if err != nil {
		return
	}
	err = json.Unmarshal(output.Body(), &resp)
	if err != nil {
		return
	}
	return
}

// PostJSON post json 数据请求
func (g *GrpcGovern) Get(env, zoneCode string, url string, v map[string]string, resp interface{}) (err error) {
	domain := g.getDomain(GenNewZoneCode(env, zoneCode))
	// 根据机房信息,获取域名
	if domain == "" {
		err = errors.New("该环境与机房并未查询到该应用相关数据")
		return
	}

	var output *resty.Response
	output, err = g.R().SetHeader("Authorization", g.Token).SetQueryParams(v).Get(domain + url)
	if err != nil {
		return
	}

	basicInfo := governCommonResp{}
	err = json.Unmarshal(output.Body(), &basicInfo)
	if err != nil {
		return
	}

	if basicInfo.Code != 0 {
		return errors.New("GrpcGovern Error:" + basicInfo.Msg)
	}

	err = json.Unmarshal(output.Body(), &resp)
	if err != nil {
		return
	}
	// fmt.Printf("------------------------url = %v\n ", string(output.Body()))
	return
}

// PostJSON post json 数据请求
func (g *GrpcGovern) PostStream(env, zoneCode string, url string, v interface{}) (stream []byte, err error) {
	domain := g.getDomain(GenNewZoneCode(env, zoneCode))
	// 根据机房信息,获取域名
	if domain == "" {
		err = errors.New("该环境与机房并未查询到该应用相关数据")
		return
	}

	var output *resty.Response
	output, err = g.R().SetHeader("Authorization", g.Token).SetBody(v).Post(domain + url)
	if err != nil {
		return
	}
	stream = output.Body()
	return
}
