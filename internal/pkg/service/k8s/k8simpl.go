package k8s

import (
	"net/url"

	"github.com/douyu/jupiter/pkg/util/xgo"

	"github.com/douyu/juno/pkg/model/view"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes/scheme"
	"k8s.io/client-go/rest"
)

type k8sImpl struct {
	ClientMap map[string]*rest.Config
}

func NewK8sImpl(kc map[string]view.K8sConfig) ApiServer {
	var d k8sImpl
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
		d.ClientMap[zoneCode] = restConfig
	}
	return &d
}

func (g *k8sImpl) AllClusterSync() {
	for zc, config := range g.ClientMap {
		go xgo.Go(func() {
			NewCluster(zc, config)
		})
	}
}
