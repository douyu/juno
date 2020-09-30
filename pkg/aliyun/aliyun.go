package aliyun

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/aliyun/alibaba-cloud-sdk-go/services/sts"
	"github.com/go-resty/resty/v2"
)

//Aliyun ..
type Aliyun struct {
	client          *resty.Client
	key             string
	secret          string
	roleArn         string
	loginURL        string
	regionID        string
	roleSessionName string
}

// New ..
func New(key, secret, roleArn, roleSessionName, loginURL, regionID string) *Aliyun {
	return &Aliyun{
		client:          resty.New().SetDebug(true).SetTimeout(3*time.Second).SetHeader("Content-Type", "application/json;charset=utf-8"),
		key:             key,
		secret:          secret,
		roleArn:         roleArn,
		loginURL:        loginURL,
		regionID:        regionID,
		roleSessionName: roleSessionName,
	}
}

// Auth 申请临时用户授权，获取临时的AccessKeyId，AccessKeySecret以及安全的Token
func (t *Aliyun) Auth() (response *sts.AssumeRoleResponse, err error) {
	client, err := sts.NewClientWithAccessKey(t.regionID, t.key, t.secret)
	if err != nil {
		return
	}
	request := sts.CreateAssumeRoleRequest()
	request.Scheme = "https"
	request.RoleArn = t.roleArn
	request.RoleSessionName = t.roleSessionName
	response, err = client.AssumeRole(request)
	if err != nil {
		return
	}
	return
}

// Token 通过临时用户信息获取有效期为三小时的用户登录Token
// http://signin.aliyun.com/federation?Action=GetSigninToken
//    &AccessKeyId=<STS 返回的临时 AccessKeyId>
//    &AccessKeySecret=<STS 返回的临时 AccessKeySecret>
//    &SecurityToken=<STS 返回的安全 Token>
//    &TicketType=mini
func (t *Aliyun) Token(accessKeyId, accessKeySecret, safeToken string) (signInToken string, err error) {
	v := make(map[string]string, 0)
	v["Action"] = "GetSigninToken"
	v["AccessKeyId"] = accessKeyId
	v["AccessKeySecret"] = accessKeySecret
	v["SecurityToken"] = safeToken
	v["TicketType"] = "mini"
	response, err := t.client.R().SetQueryParams(v).Get("http://signin.aliyun.com/federation")
	if err != nil {
		return
	}
	response.Body()
	var res struct {
		RequestId   string
		SigninToken string
	}
	_ = json.Unmarshal(response.Body(), &res)
	return res.SigninToken, nil
}

// Url 获取链路跳转链接
// http://signin.aliyun.com/federation?Action=Login
//    &LoginUrl=<登录失效跳转的地址，一般配置为自建 Web 配置 302 跳转的 URL>
//    &Destination=<链路追踪控制台页面链接>
//    &SigninToken=<获取到的登录 Token>
func (t *Aliyun) Url(destination string) (url string, err error) {
	resq, err := t.Auth()
	if err != nil {
		return
	}
	signInToken, err := t.Token(resq.Credentials.AccessKeyId, resq.Credentials.AccessKeySecret, resq.Credentials.SecurityToken)
	url = fmt.Sprintf("http://signin.aliyun.com/federation?Action=Login&SigninToken=%s&LoginUrl=%s&Destination=%s",
		signInToken,
		t.loginURL,
		destination)
	return
}
