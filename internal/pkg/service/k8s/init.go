package k8s

import (
	"github.com/douyu/juno/internal/pkg/service/system"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/util/xgo"
	"github.com/douyu/jupiter/pkg/xlog"
)

var IK8s apiServer

// Init ..
func Init() {

	if !cfg.Cfg.K8s.Enable {
		xlog.Warn("k8sInit", xlog.String("step", "init"), xlog.Any("cfg.Cfg.K8s", cfg.Cfg.K8s))
		return
	}

	k8sSystemConfig, err := system.System.Setting.K8SClusterSetting()
	if err != nil {
		xlog.Error("k8sInit", xlog.String("step", "init"), xlog.Any("err", err))
		return
	}
	if len(k8sSystemConfig.List) == 0 {
		xlog.Error("k8sInit",
			xlog.String("step", "len"),
			xlog.Any("k8sSystemConfig", k8sSystemConfig))
		return
	}

	var kc map[string]view.K8sConfig
	kc = make(map[string]view.K8sConfig, 0)
	for _, v := range k8sSystemConfig.List {
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
