package huaweilog

import (
	"context"

	"github.com/douyu/jupiter/pkg/conf"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/huaweicloud/huaweicloud-sdk-go-v3/services/lts/v2/model"
	"go.uber.org/zap"
)

// LogStoreMenu 日志菜单
func (s *Service) LogStoreMenu(ctx context.Context) (ret map[string]*LogNodeMap, err error) {
	ret = s.menus
	return
}

// LogStoreMenu 日志菜单
func (s *Service) logStoreMenu(ctx context.Context) (ret map[string]*LogNodeMap, err error) {
	ret = make(map[string]*LogNodeMap, 10)
	areas := conf.GetStringMapString("huawei.regions")
	for area := range areas {
		tmp := &LogNodeMap{
			Label: area,
			Value: area,
		}
		tmp.Children = s.logStoreMenuProject(ctx, area)
		if len(tmp.Children) <= 0 {
			continue
		}
		ret[area] = tmp
	}
	return
}

func (s *Service) logStoreMenuProject(ctx context.Context, area string) (ret map[string]*LogNodeMap) {
	ret = make(map[string]*LogNodeMap, 10)
	client, ok := s.Clients[area]
	if !ok {
		return
	}
	projects, err := client.ListLogGroups(&model.ListLogGroupsRequest{})
	if err != nil {
		xlog.Error("logStoreMenu.Client.ListLogGroups", zap.Error(err))
		return
	}
	for _, project := range *projects.LogGroups {
		tmp := &LogNodeMap{
			Label: project.LogGroupName,
			Value: project.LogGroupId,
		}
		tmp.Children = s.logStoreMenuLog(ctx, area, project.LogGroupId)
		if len(tmp.Children) <= 0 {
			continue
		}
		ret[tmp.Label] = tmp
	}
	return
}

func (s *Service) logStoreMenuLog(ctx context.Context, area, project string) (ret map[string]*LogNodeMap) {
	ret = make(map[string]*LogNodeMap, 10)

	Client, ok := s.Clients[area]
	if !ok {
		return
	}
	logstorelist, _ := Client.ListLogStream(&model.ListLogStreamRequest{
		LogGroupId: project,
	})
	for _, logstore := range *logstorelist.LogStreams {
		tmp := &LogNodeMap{
			Label: *logstore.LogStreamName,
			Value: *logstore.LogStreamId,
		}
		ret[tmp.Label] = tmp
	}
	return
}
