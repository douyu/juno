package aliyunlog

import (
	"context"

	"github.com/douyu/jupiter/pkg/conf"
	"github.com/douyu/jupiter/pkg/xlog"
	"go.uber.org/zap"
)

//LogStoreMenu 日志菜单
func (s *Service) LogStoreMenu(ctx context.Context) (ret []*LogNode, err error) {
	ret = s.menus
	return
}

//LogStoreMenu 日志菜单
func (s *Service) logStoreMenu(ctx context.Context) (ret []*LogNode, err error) {
	ret = make([]*LogNode, 0, 10)
	areas := conf.GetStringMapString("aliyun.regions")
	for area, _ := range areas {
		tmp := &LogNode{
			Label: area,
			Value: area,
		}
		tmp.Children = s.logStoreMenuProject(ctx, area)
		if len(tmp.Children) <= 0 {
			continue
		}
		ret = append(ret, tmp)
	}
	return
}

func (s *Service) logStoreMenuProject(ctx context.Context, area string) (ret []*LogNode) {
	ret = make([]*LogNode, 0, 10)

	Client, ok := s.Clients[area]
	if !ok {
		return
	}

	projects, _, _, err := Client.ListProjectV2(0, 1000)
	if err != nil {
		xlog.Error("logStoreMenu.Client.ListProjectV2", zap.Error(err))
		return
	}
	for _, project := range projects {
		tmp := &LogNode{
			Label: project.Name,
			Value: project.Name,
		}
		tmp.Children = s.logStoreMenuLog(ctx, area, project.Name)
		if len(tmp.Children) <= 0 {
			continue
		}
		ret = append(ret, tmp)
	}
	return
}

func (s *Service) logStoreMenuLog(ctx context.Context, area, project string) (ret []*LogNode) {
	ret = make([]*LogNode, 0, 10)

	Client, ok := s.Clients[area]
	if !ok {
		return
	}
	logstorelist, _ := Client.ListLogStore(project)
	for _, logstore := range logstorelist {
		tmp := &LogNode{
			Label: logstore,
			Value: logstore,
		}
		ret = append(ret, tmp)
	}
	return
}
