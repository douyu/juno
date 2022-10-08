package service

import (
	"math"

	"github.com/douyu/juno/internal/pkg/invoker"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
)

type tool struct{}

// TplCreate ...
func (t *tool) Create(tool *view.RespToolDetail) (int, error) {
	if err := invoker.JunoMysql.Table("tool").Save(&tool).Error; err != nil {
		return 0, err
	}
	return int(tool.Id), nil
}

// List ...
func (t *tool) List(currentPage int, pageSize int, queryObj string) *view.RespToolList {
	if pageSize == 0 || pageSize > 100 {
		pageSize = 100
	}

	cnt := int64(0)
	toolList := make([]*db.ToolInfo, 0)
	offset := 0
	offset = currentPage * pageSize

	sql := invoker.JunoMysql.Table("tool").Select("id, name, url, pic_url, create_time, `desc`")
	if queryObj != "" {
		sql = sql.Where("name like ?", "%"+queryObj+"%")
	}
	sql.Count(&cnt)
	sql = sql.Limit(pageSize).Offset(offset)
	sql.Find(&toolList)

	var retJson = &view.RespToolList{}
	retJson.CurrentPage = currentPage
	retJson.ShowNum = pageSize
	retJson.TotalPage = int(math.Ceil(float64(cnt) / float64(pageSize)))
	retJson.List = toolList

	return retJson
}

// Detail ...
func (t *tool) Detail(id int) *db.ToolInfo {
	resp := new(db.ToolInfo)
	invoker.JunoMysql.Table("tool").Select("id, name, url, pic_url, create_time, `desc`").
		Where("id = ?", id).Find(&resp)
	return resp
}

// Delete ...
func (t *tool) Delete(id int) (err error) {
	resp := new(db.ToolInfo)
	return invoker.JunoMysql.Table("tool").Where("id = ?", id).Delete(&resp).Error
}

// Update ...
func (t *tool) Update(id uint64, tool *view.RespToolDetail) (int, error) {

	if err := invoker.JunoMysql.Table("tool").Where("id = ?", id).Updates(&tool).Error; err != nil {
		return 0, err
	}
	return int(tool.Id), nil
}
