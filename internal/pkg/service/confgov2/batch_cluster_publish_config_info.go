package confgov2

import (
	"github.com/douyu/juno/pkg/model/view"
	"golang.org/x/sync/errgroup"
)

func BatchClusterPublishConfigInfo(clusters []string, configId uint64) (ret map[string]*view.ClusterConfigInfo, err error) {
	ret = make(map[string]*view.ClusterConfigInfo)
	if len(clusters) == 0 {
		return
	}
	tmpRet := make([]*view.ClusterConfigInfo, len(clusters))
	eg := errgroup.Group{}
	for idx, cluster := range clusters {
		tmpIdx := idx
		tmpCluster := cluster
		eg.Go(func() error {
			tmpItem, err := ClusterPublishConfigInfo(tmpCluster, configId)
			if err != nil {
				return nil
			}
			tmpRet[tmpIdx] = &tmpItem
			return nil
		})
	}
	err = eg.Wait()
	if err != nil {
		return
	}
	for idx, tmpItem := range tmpRet {
		if tmpItem == nil {
			continue
		}
		ret[clusters[idx]] = tmpItem
	}

	return
}
