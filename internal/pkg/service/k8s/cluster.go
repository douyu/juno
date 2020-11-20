package k8s

import (
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

// NewCluster Cluster data synchronization initialization
func NewCluster(zoneCode string, config *rest.Config) *cluster {
	return &cluster{
		zoneCode: zoneCode,
		syncPod:  newSyncPod(zoneCode, config),
	}
}
