package proxyintegrat

import (
	"context"
	"errors"

	"github.com/douyu/juno/pkg/model/view/vproxyintegrat"
)

//UIList UI功能页面
func UIList(ctx context.Context, params *vproxyintegrat.ProxyUIParams) (list []vproxyintegrat.ProxyMenuFunc, err error) {
	list = make([]vproxyintegrat.ProxyMenuFunc, 0, 20)
	tmpList := make([]vproxyintegrat.ProxyMenu, 0)
	isValid, msg := params.Valid()
	if !isValid {
		err = errors.New(msg)
		return
	}
	offset := (params.Current - 1) * params.PageSize
	query := mysql.Where("delete_time = ?", 0)
	err = query.Limit(params.PageSize).Offset(offset).Order("id desc").Find(&tmpList).Error
	if err != nil {
		return
	}
	if len(tmpList) == 0 {
		return
	}
	for _, item := range tmpList {
		if item.Key == "" || item.Title == "" || item.PanelType == "" || item.ProxyUrl == "" {
			continue
		}
		list = append(list, vproxyintegrat.ProxyMenuFunc{
			Title:     item.Title,
			PanelType: item.PanelType,
			Key:       item.Key,
			Config:    vproxyintegrat.ProxyMenuFuncConfig{ProxyURL: item.ProxyUrl},
		})
	}
	return
}
