package k8s

import (
	"github.com/jinzhu/gorm"
	"k8s.io/client-go/rest"
)

type sync interface {
	watch()
	clean()
	add(obj interface{})
	update(old interface{}, new interface{})
	delete(obj interface{})
}

type cluster struct {
	zoneCode    string
	syncPod     sync
	syncEvent   sync
	syncService sync
	syncIngress sync
}

// newCluster Cluster data synchronization initialization
func newCluster(zoneCode, prefix string, config *rest.Config, db *gorm.DB) *cluster {
	return &cluster{
		zoneCode: zoneCode,
		syncPod:  newSyncPod(zoneCode, prefix, config, db),
	}
}
