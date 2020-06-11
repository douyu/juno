package analysis

import (
	"github.com/douyu/juno/internal/pkg/model/db"
	"github.com/douyu/juno/internal/pkg/model/view"
	"github.com/douyu/jupiter/pkg/store/gorm"
)

type analysis struct {
	*gorm.DB
}

var Analysis *analysis

func InitAnalysis(db *gorm.DB) {
	Analysis = &analysis{
		db,
	}
}

// 根据分页获取应用列表
func (r *analysis) GetTopologyList(where db.AppTopology, currentPage, pageSize int, sort string) (resp []db.AppTopology, page view.Pagination, err error) {
	page.Current = currentPage
	page.PageSize = pageSize
	if pageSize == 0 {
		page.PageSize = 20
	}
	if currentPage == 0 {
		page.Current = 1
	}

	sql := r.DB.Model(db.AppTopology{}).Where(where)
	sql.Count(&page.Total)
	err = sql.Order(sort).Offset((page.Current - 1) * page.PageSize).Limit(page.PageSize).Find(&resp).Error
	return
}

// ListAllCfgType 列出表中所有的类型，不重复
func (r *analysis) ListAllCfgType() ([]string, error) {
	types := make([]struct {
		Type string `json:"type"`
	}, 0)
	result := make([]string, 0)
	if err := r.DB.Table("app_topology").Select("type").Group("type").Find(&types).Error; err != nil {
		return result, err
	}

	for _, e := range types {
		result = append(result, e.Type)
	}
	return result, nil
}

// ListAllCfgType 列出表中所有的类型，不重复
func (r *analysis) ListAddr() ([]string, error) {
	addrs := make([]db.AppTopology, 0)
	result := make([]string, 0)
	if err := r.DB.Table("app_topology").Select("addr").Group("addr").Find(&addrs).Error; err != nil {
		return result, err
	}

	for _, e := range addrs {
		result = append(result, e.Addr)
	}
	return result, nil
}
