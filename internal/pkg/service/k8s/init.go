package k8s

import (
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/util/xgo"
)

var IK8s apiServer

// Init ..
func Init() {

	if !cfg.Cfg.K8s.Enable {
		return
	}

	var kc map[string]view.K8sConfig
	kc = make(map[string]view.K8sConfig, 0)
	for _, v := range cfg.Cfg.K8s.Cluster {
		clusterItem := view.K8sConfig{
			Domain: v.Domain,
			Token:  v.Token,
		}
		kc[v.ZoneCode] = clusterItem
	}

	IK8s = newK8sImpl(kc)

	xgo.Go(func() {
		IK8s.allClusterSync(cfg.Cfg.K8s.Prefix)
	})
}
