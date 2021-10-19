package k8s

import (
	"github.com/jinzhu/gorm"
	"k8s.io/client-go/rest"
)

type k8sSync interface {
	watch()
	clean()
	add(obj interface{})
	update(old interface{}, new interface{})
	delete(obj interface{})
	sync(namespace string, aid uint32) error //同步该集群数据到数据库 aid=0时 同步全量的
	getDomain() string                       //返回拉取配置的domain信息
	close()
}

type cluster struct {
	zoneCode    string
	syncPod     k8sSync
	syncEvent   k8sSync
	syncService k8sSync
	syncIngress k8sSync
}

// newCluster Cluster data synchronization initialization
func newCluster(zoneCode, prefix string, excludeSuffix []string, config *rest.Config, db *gorm.DB) *cluster {
	c := &cluster{
		zoneCode: zoneCode,
		syncPod:  newSyncPod(zoneCode, prefix, excludeSuffix, config, db),
	}
	return c
}
