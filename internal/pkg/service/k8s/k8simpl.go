package k8s

import (
	"crypto/tls"
	"encoding/json"
	"errors"
	"net/url"
	"time"

	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/util/xgo"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/go-resty/resty/v2"
	"github.com/jinzhu/gorm"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes/scheme"
	"k8s.io/client-go/rest"
)

type k8sImpl struct {
	db        *gorm.DB
	resty     *resty.Client
	config    map[string]view.K8sConfig
	clientMap map[string]*rest.Config
}

// newK8sImpl ..
func newK8sImpl(kc map[string]view.K8sConfig) apiServer {
	var d k8sImpl
	d.clientMap = make(map[string]*rest.Config)
	for zoneCode, kcItem := range kc {
		apiServerURL, err := url.Parse(kcItem.Domain)
		if err != nil {
			panic("k8s client init error, domain:" + kcItem.Domain)
		}
		restConfig := &rest.Config{
			Host:        apiServerURL.String(),
			BearerToken: kcItem.Token,
		}
		restConfig.TLSClientConfig.Insecure = true
		restConfig.ContentConfig.GroupVersion = &v1.Unversioned
		restConfig.ContentConfig.NegotiatedSerializer = scheme.Codecs
		d.clientMap[zoneCode] = restConfig
	}
	d.db = invoker.JunoMysql
	d.config = kc
	d.resty = resty.
		New().
		SetDebug(true).
		SetTimeout(3*time.Second).
		SetHeader("Content-Type", "application/json;charset=utf-8").
		SetTLSClientConfig(&tls.Config{InsecureSkipVerify: true})
	return &d
}

// allClusterSync ..
func (g *k8sImpl) allClusterSync(prefix string) {
	for zc, config := range g.clientMap {
		xgo.Go(func() {
			newCluster(zc, prefix, config, g.db)
		})
	}
}

// post post json 数据请求
func (g *k8sImpl) post(zoneCode string, url string, v interface{}, resp interface{}) (err error) {
	domain, token := g.getConfig(zoneCode)
	// 根据机房信息,获取域名
	if domain == "" || token == "" {
		err = errors.New("该环境与机房并未查询到该应用相关数据")
		return
	}
	var output *resty.Response
	output, err = g.resty.R().SetHeader("Authorization", "Bearer "+token).SetBody(v).Post(domain + url)
	if err != nil {
		return
	}
	err = json.Unmarshal(output.Body(), &resp)
	if err != nil {
		xlog.Error("post", xlog.Any("UnmarshalError", err.Error()), xlog.Any("output.Body()", output.Body()))
		return
	}
	return
}

// get post json 数据请求
func (g *k8sImpl) get(zoneCode string, url string, v map[string]string, resp interface{}) (err error) {
	domain, token := g.getConfig(zoneCode)
	// 根据机房信息,获取域名
	if domain == "" || token == "" {
		err = errors.New("该环境与机房并未查询到该应用相关数据")
		return
	}
	var output *resty.Response
	output, err = g.resty.R().SetHeader("Authorization", "Bearer "+token).SetQueryParams(v).Get(domain + url)
	if err != nil {
		return
	}
	err = json.Unmarshal(output.Body(), &resp)
	if err != nil {
		xlog.Error("get", xlog.Any("UnmarshalError", err.Error()), xlog.Any("output.Body()", output.Body()))
		return
	}
	return
}

// postStream post json 数据请求
func (g *k8sImpl) postStream(zoneCode string, url string, v interface{}) (stream []byte, err error) {
	domain, token := g.getConfig(zoneCode)
	// 根据机房信息,获取域名
	if domain == "" || token == "" {
		err = errors.New("该环境与机房并未查询到该应用相关数据")
		return
	}
	var output *resty.Response
	output, err = g.resty.R().SetHeader("Authorization", "Bearer "+token).SetBody(v).Post(domain + url)
	if err != nil {
		xlog.Error("postStream", xlog.Any("UnmarshalError", err.Error()), xlog.Any("output.Body()", output.Body()))
		return
	}
	stream = output.Body()
	return
}

// getStream post json 数据请求
func (g *k8sImpl) getStream(zoneCode string, url string, v map[string]string) (stream []byte, err error) {
	domain, token := g.getConfig(zoneCode)
	// 根据机房信息,获取域名
	if domain == "" || token == "" {
		err = errors.New("该环境与机房并未查询到该应用相关数据")
		return
	}
	var output *resty.Response
	output, err = g.resty.R().SetHeader("Authorization", "Bearer "+token).SetQueryParams(v).Get(domain + url)
	if err != nil {
		xlog.Error("getStream", xlog.Any("UnmarshalError", err.Error()), xlog.Any("output.Body()", output.Body()))
		return
	}
	stream = output.Body()
	return
}

func (g *k8sImpl) getConfig(zoneCode string) (domain, token string) {
	c, _ := g.config[zoneCode]
	return c.Domain, c.Token
}
