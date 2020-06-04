package confgo

import (
	"encoding/json"
	"fmt"

	"github.com/pkg/errors"

	"github.com/douyu/juno/pkg/model/db"

	"github.com/douyu/jupiter/pkg/store/gorm"
)

type history struct {
	DB *gorm.DB
}

func (h *history) GetHistoryChange(historyID int) (result db.DiffText, err error) {
	result = db.DiffText{}
	publishLog := db.CmcPublishLog{}
	if err = h.DB.Where("history_id = ?", historyID).First(&publishLog).Error; err != nil {
		return
	}
	if publishLog.Id == 0 {
		err = fmt.Errorf("no data")
		return
	}
	if err = json.Unmarshal([]byte(publishLog.DiffText), &result); err != nil {
		return
	}
	return
}

// ListVersions查询历史记录
func (cmc *history) ListVersions(c *db.CmcHistory) ([]db.CmcHistory, error) {
	var err error
	var res []db.CmcHistory
	dbConn := cmc.DB.Table("cmc_history")
	err = dbConn.Where("caid = ?", c.Caid).Order("create_time desc").Find(&res).Error
	if err != nil {
		return res, err
	}
	return res, nil
}

func (h *history) GetPreHistory(caid int) (nowId, historyId int, err error) {
	resultList := make([]db.CmcHistory, 0)
	dbConn := h.DB.Table("cmc_history")
	if err = dbConn.Where("caid = ?", caid).Limit(2).Order("create_time desc").Find(&resultList).Error; err != nil {
		return
	}
	if len(resultList) < 2 {
		err = errors.New("没有历史版本配置")
		return
	}
	return resultList[0].Id, resultList[1].Id, nil
}

func (h *history) GetPrePublish(caid int) (result db.CmcHistory, err error) {
	result = db.CmcHistory{}
	dbConn := h.DB.Table("cmc_history")
	if err := dbConn.Where("caid = ?", caid).Order("create_time desc").First(&result).Error; err != nil {
		return result, err
	}
	if result.Id == 0 {
		return result, fmt.Errorf("没有历史版本")
	}
	return result, nil
}
