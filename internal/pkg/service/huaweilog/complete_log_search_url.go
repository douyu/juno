package huaweilog

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"net/http"
	"net/url"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/conf"
	"github.com/douyu/jupiter/pkg/util/xstring"
	iamv3model "github.com/huaweicloud/huaweicloud-sdk-go-v3/services/iam/v3/model"
	iamv3region "github.com/huaweicloud/huaweicloud-sdk-go-v3/services/iam/v3/region"
	ltsv2region "github.com/huaweicloud/huaweicloud-sdk-go-v3/services/lts/v2/region"
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

type LoginTokenReq struct {
	Auth Auth `json:"auth"`
}
type Securitytoken struct {
	Access          string `json:"access"`
	Secret          string `json:"secret"`
	ID              string `json:"id"`
	DurationSeconds int    `json:"duration_seconds"`
}
type Auth struct {
	Securitytoken Securitytoken `json:"securitytoken"`
}

// https://support.huaweicloud.com/bestpractice-lts/lts_07_0006.html
// CompleteLogSearchUrl 获取
func (s *Service) CompleteLogSearchUrl(ctx context.Context, req *CompleteLogSearchUrlRequest, u *db.User) (signInUrl string, err error) {
	client, ok := s.StsClients[req.Region]
	if !ok {
		err = errors.New("华为日志账号未正确配置，请联系管理员。")
		return
	}
	areaMap, ok := s.menus[req.Region]
	if !ok || len(areaMap.Children) == 0 {
		err = errors.New("华为日志账号未正确配置，请联系管理员。")
		return
	}
	projectData, ok := areaMap.Children[req.Project]
	if !ok || len(projectData.Children) == 0 {
		err = errors.New("华为日志账号未正确配置，请联系管理员。")
		return
	}
	logStoreData, ok := projectData.Children[req.LogStore]
	if !ok {
		err = errors.New("华为日志账号未正确配置，请联系管理员。")
		return
	}
	//构建请求对象。
	request := &iamv3model.CreateTemporaryAccessKeyByTokenRequest{}
	body := &iamv3model.CreateTemporaryAccessKeyByTokenRequestBody{}
	durationSeconds := int32(3600 * 24)
	tokenIdentity := &iamv3model.IdentityToken{
		DurationSeconds: &durationSeconds,
	}
	tokenAuthIdentity := &iamv3model.TokenAuthIdentity{
		Methods: []iamv3model.TokenAuthIdentityMethods{iamv3model.GetTokenAuthIdentityMethodsEnum().TOKEN},
		Token:   tokenIdentity,
	}
	body.Auth = &iamv3model.TokenAuth{
		Identity: tokenAuthIdentity,
	}
	request.Body = body
	//发起请求，并得到响应。
	response, err := client.CreateTemporaryAccessKeyByToken(request)
	if err != nil {
		return
	}
	logInReq := LoginTokenReq{
		Auth: Auth{
			Securitytoken: Securitytoken{
				Access:          response.Credential.Access,
				Secret:          response.Credential.Secret,
				ID:              response.Credential.Securitytoken,
				DurationSeconds: 86400,
			},
		},
	}
	tokenURl := iamv3region.CN_NORTH_4.Endpoints[0] + "/v3.0/OS-AUTH/securitytoken/logintokens"
	dataRes, err := http.Post(tokenURl, "application/json", bytes.NewReader(xstring.JsonBytes(logInReq)))
	if err != nil {
		return
	}
	signInToken := dataRes.Header.Get("X-Subject-LoginToken")
	toURL := fmt.Sprintf("https://console.huaweicloud.com/lts/?region=%s&cfModuleHide=header_sidebar_floatlayer#/cts/logEventsLeftMenu/events?groupId=%s&topicId=%s&hideHeader=true&fastAnalysisCollapsed=false&hideDashboard=true&hideFeedback=true&isFoldLabel=true&hideStreamName=false&hideBarChart=false", ltsv2region.CN_NORTH_4.Id, projectData.Value, logStoreData.Value)
	query := url.Values{}
	if req.StartTime != "" {
		query.Add("selectDate", req.StartTime)
		query.Add("createTime", req.EndTime)
	}
	toURL = toURL + query.Encode()
	signInUrl = fmt.Sprintf("https://auth.huaweicloud.com/authui/federation/login?service=%s&logintoken=%s&idp_login_url=%s", url.QueryEscape(toURL), url.QueryEscape(signInToken), url.QueryEscape(conf.GetString("server.http.rootUrl")))
	return

}
