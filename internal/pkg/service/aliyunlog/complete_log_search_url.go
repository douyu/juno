package aliyunlog

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"

	"github.com/aliyun/alibaba-cloud-sdk-go/sdk/requests"
	"github.com/aliyun/alibaba-cloud-sdk-go/services/sts"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/conf"
)

type CompleteLogSearchUrlRequest struct {
	Region    string `query:"region"`
	Project   string `query:"project"`
	LogStore  string `query:"logstore"`
	Query     string `query:"query"`
	StartTime string `query:"startTime"`
	EndTime   string `query:"endTime"`
}

type CompleteTraceSearchUrlRequest struct {
	Region string `query:"region"`
	ToURL  string `query:"toURL"`
}
type TokenBody struct {
	SigninToken string `json:"SigninToken"`
}

//参考:https://help.aliyun.com/document_detail/74971.html

// CompleteLogSearchUrl 获取
func (s *Service) CompleteLogSearchUrl(ctx context.Context, req *CompleteLogSearchUrlRequest, u *db.User) (signInUrl string, err error) {
	client, ok := s.StsClients[req.Region]
	if !ok {
		err = errors.New("no client")
		return
	}
	//构建请求对象。
	request := sts.CreateAssumeRoleRequest()
	request.Scheme = "https"

	//设置参数。关于参数含义和设置方法，请参见《API参考》。
	request.RoleArn = conf.GetString("aliyun.roleArn")
	request.RoleSessionName = fmt.Sprintf("user_%d", u.Uid)
	request.DurationSeconds = requests.Integer(strconv.Itoa(3600 * 12))

	//发起请求，并得到响应。
	response, err := client.AssumeRole(request)
	if err != nil {
		fmt.Print(err.Error())
	}
	tokenURl := fmt.Sprintf("https://signin.aliyun.com/federation?Action=GetSigninToken&AccessKeyId=%s&AccessKeySecret=%s&SecurityToken=%s&TicketType=mini",
		url.QueryEscape(response.Credentials.AccessKeyId),
		url.QueryEscape(response.Credentials.AccessKeySecret),
		url.QueryEscape(response.Credentials.SecurityToken))
	dataRes, err := http.Get(tokenURl)
	if err != nil {
		return
	}
	dataBytes, err := ioutil.ReadAll(dataRes.Body)
	if err != nil {
		return
	}
	tokenItem := new(TokenBody)
	err = json.Unmarshal(dataBytes, tokenItem)
	if err != nil {
		return
	}
	toURL := fmt.Sprintf("https://sls4service.console.aliyun.com/next/project/%s/logsearch/%s", req.Project, req.LogStore)
	query := url.Values{}
	query.Add("isShare", "true")
	query.Add("hideTopbar", "true")
	query.Add("hideSidebar", "true")
	if req.Query != "" {
		query.Add("encode", "base64")
		query.Add("queryString", base64.StdEncoding.EncodeToString([]byte(req.Query)))
	}
	if req.StartTime != "" {
		query.Add("startTime", req.StartTime)
		query.Add("endTime", req.EndTime)
	}
	query.Add("readOnly", "true")
	query.Add("hiddenBack", "true")
	toURL = toURL + "?" + query.Encode()
	signInUrl = fmt.Sprintf("https://signin.aliyun.com/federation?Action=Login&LoginUrl=%s&Destination=%s&SigninToken=%s", conf.GetString("server.http.rootUrl"), url.QueryEscape(toURL), tokenItem.SigninToken)
	return

}

//参考:https://help.aliyun.com/document_detail/123491.html

// CompleteLogSearchUrl 获取
func (s *Service) CompleteTraceSearchUrl(ctx context.Context, req *CompleteTraceSearchUrlRequest, u *db.User) (signInUrl string, err error) {
	client, ok := s.StsClients[req.Region]
	if !ok {
		err = errors.New("no client")
		return
	}
	//构建请求对象。
	request := sts.CreateAssumeRoleRequest()
	request.Scheme = "https"

	//设置参数。关于参数含义和设置方法，请参见《API参考》。
	request.RoleArn = conf.GetString("aliyun.roleArn")
	request.RoleSessionName = fmt.Sprintf("user_%d", u.Uid)
	request.DurationSeconds = requests.Integer(strconv.Itoa(3600 * 12))

	//发起请求，并得到响应。
	response, err := client.AssumeRole(request)
	if err != nil {
		fmt.Print(err.Error())
	}
	tokenURl := fmt.Sprintf("https://signin.aliyun.com/federation?Action=GetSigninToken&AccessKeyId=%s&AccessKeySecret=%s&SecurityToken=%s&TicketType=mini",
		url.QueryEscape(response.Credentials.AccessKeyId),
		url.QueryEscape(response.Credentials.AccessKeySecret),
		url.QueryEscape(response.Credentials.SecurityToken))
	dataRes, err := http.Get(tokenURl)
	if err != nil {
		return
	}
	dataBytes, err := ioutil.ReadAll(dataRes.Body)
	if err != nil {
		return
	}
	tokenItem := new(TokenBody)
	err = json.Unmarshal(dataBytes, tokenItem)
	if err != nil {
		return
	}
	signInUrl = fmt.Sprintf("https://signin.aliyun.com/federation?Action=Login&LoginUrl=%s&Destination=%s&SigninToken=%s", conf.GetString("server.http.rootUrl"), url.QueryEscape(req.ToURL), tokenItem.SigninToken)
	return
}
