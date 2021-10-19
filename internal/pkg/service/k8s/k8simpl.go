package k8s

import (
	"crypto/tls"
	"encoding/json"
	"errors"
	"net"
	"net/url"
	"time"

	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/go-resty/resty/v2"
	"github.com/jinzhu/gorm"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes/scheme"
	"k8s.io/client-go/rest"
)

type k8sImpl struct {
	db         *gorm.DB
	resty      *resty.Client
	config     map[string]view.K8sConfig
	clientMap  map[string]*rest.Config
	clusterMap map[string]*cluster
}

// newK8sImpl ..
func newK8sImpl(kc map[string]view.K8sConfig) apiServer {
	var d k8sImpl
	d.clientMap = make(map[string]*rest.Config)
	d.clusterMap = make(map[string]*cluster)
	for zoneCode, kcItem := range kc {
		apiServerURL, err := url.Parse(kcItem.Domain)
		if err != nil {
			panic("k8s client init error, domain:" + kcItem.Domain + err.Error())
		}
		// 开始运行之前先dial一下地址，避免一直报错
		conn, err := net.DialTimeout("tcp", apiServerURL.Host, time.Second*3)
		if err != nil {
			xlog.Error("k8sWork",
				xlog.String("step", "Dial"),
				xlog.String("zoneCode", zoneCode),
				xlog.String("host", apiServerURL.Host),
				xlog.String("err", err.Error()),
			)
			continue
		}
		if conn != nil {
			conn.Close()
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
		SetDebug(false).
		SetTimeout(3*time.Second).
		SetHeader("Content-Type", "application/json;charset=utf-8").
		SetTLSClientConfig(&tls.Config{InsecureSkipVerify: true})
	return &d
}

// allClusterSync ..
func (g *k8sImpl) allClusterStart(prefix string, excludeSuffix []string) {
	for zc, config := range g.clientMap {
		g.clusterMap[zc] = newCluster(zc, prefix, excludeSuffix, config, g.db)
	}
}

// 触发同步,aid==0同步全量数据
func (g *k8sImpl) allClusterSync(namespace string, aid uint32) error {
	//从数据库捞出所有namespace相关的domain配置，
	dimainList, err := mysqlNamespaceList(namespace, aid)
	if err != nil {
		xlog.Error("k8sImpl",
			xlog.String("err", err.Error()),
			xlog.String("namespace", namespace),
			xlog.String("step", "mysqlNamespaceList"),
			xlog.Int("aid", int(aid)),
		)
		return err
	}
	existDomain := map[string]bool{}
	for zonecode, cluster := range g.clusterMap {
		err := cluster.syncPod.sync(namespace, aid)
		if err != nil {
			xlog.Error("k8sImpl",
				xlog.String("err", err.Error()),
				xlog.String("namespace", namespace),
				xlog.String("step", "sync"),
				xlog.String("zonecode", zonecode),
				xlog.Int("aid", int(aid)),
			)
			return err
		}
		existDomain[cluster.syncPod.getDomain()] = true
	}

	for _, domain := range dimainList {
		if !existDomain[domain] { //删除数据库配置
			xlog.Warn("k8sImpl",
				xlog.String("namespace", namespace),
				xlog.String("domain", domain),
				xlog.Int("aid", int(aid)),
			)
			cleanByDomain(namespace, aid, domain)
		}
	}
	return nil
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
