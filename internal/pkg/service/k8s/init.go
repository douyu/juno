package k8s

import (
	"strings"

	"github.com/douyu/jupiter/pkg/util/xgo"
	"k8s.io/client-go/rest"

	"github.com/douyu/juno/internal/pkg/service/system"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
)

var IK8s apiServer

var (
	NameSpace = "wsd"
)

// Init ..
func Init() {
	if !cfg.Cfg.K8s.Enable {
		xlog.Warn("k8sWork", xlog.String("step", "init"), xlog.Any("cfg.Cfg.K8s", cfg.Cfg.K8s))
		return
	}
	k8sSystemConfig, err := system.System.Setting.K8SClusterSetting()
	if err != nil {
		xlog.Error("k8sWork", xlog.String("step", "init"), xlog.Any("err", err))
		return
	}
	if cfg.Cfg.K8s.NameSpace != "" {
		NameSpace = cfg.Cfg.K8s.NameSpace
	}
	if len(k8sSystemConfig.List) == 0 {
		xlog.Error("k8sWork",
			xlog.String("step", "length"),
			xlog.Any("k8sSystemConfig", k8sSystemConfig))
		return
	}
	var kc map[string]view.K8sConfig
	kc = make(map[string]view.K8sConfig, 0)
	for _, v := range k8sSystemConfig.List {
		v.Domain = strings.TrimSpace(v.Domain)
		v.Token = strings.TrimSpace(v.Token)
		if v.Domain == "" || v.Token == "" {
			continue
		}
		// 如果配置了incluster，则使用incluster的方式获取
		if strings.ToLower(v.Domain) == "incluster" || strings.ToLower(v.Token) == "incluster" {
			k8sConfig, err := rest.InClusterConfig()
			if err == nil && k8sConfig != nil {
				v.Domain = k8sConfig.Host
				v.Token = k8sConfig.BearerToken
			}
		}
		clusterItem := view.K8sConfig{
			ZoneCode: v.ZoneCode,
			Domain:   v.Domain,
			Token:    v.Token,
		}
		kc[v.ZoneCode+"|"+v.Domain] = clusterItem
	}
	IK8s = newK8sImpl(kc)
	xgo.Go(func() {
		IK8s.allClusterStart(cfg.Cfg.K8s.Prefix, cfg.Cfg.K8s.ExcludeSuffix)
	})

}
