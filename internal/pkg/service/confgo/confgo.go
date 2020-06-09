package confgo

import (
	"encoding/json"
	"strconv"
	"time"

	"github.com/douyu/juno/internal/pkg/model"
	"github.com/douyu/juno/internal/pkg/model/db"
	"github.com/douyu/juno/internal/pkg/util"
	"github.com/douyu/jupiter/pkg/store/gorm"
)

type confgo struct {
	DB *gorm.DB
}

// PublishRecordHistory Add configuration to history
func (c *confgo) PublishRecordHistory(history *db.CmcHistory, items []db.CmcConfig, commonVal string) (diffKeyList []db.ConfigDiffData, err error) {
	tx := c.DB.Begin()
	dbConn := tx.Table("cmc_history")
	if err = dbConn.Create(history).Error; err != nil {
		tx.Rollback()
		return
	}
	if err = c.publishRecordHistoryItem(tx, items, history); err != nil {
		tx.Rollback()
		return
	}
	if diffKeyList, err = c.publishLogAdd(tx, history.Caid, history.ID, commonVal); err != nil {
		tx.Rollback()
		return
	}
	if err = c.syncItemsStatus(tx, history.Caid); err != nil {
		tx.Rollback()
		return
	}
	tx.Commit()
	return
}

// publishRecordHistoryItem ...
func (c *confgo) publishRecordHistoryItem(tx *gorm.DB, items []db.CmcConfig, history *db.CmcHistory) (err error) {
	for _, item := range items {
		var historyItem = db.CmcHistoryItem{
			Caid:         item.Caid,
			KeyId:        int(item.ID),
			CmcHistoryId: history.ID,
			Aid:          history.Aid,
			AppName:      history.AppName,
			ZoneCode:     history.ZoneCode,
			Env:          history.Env,
			Key:          item.Key,
			Value:        item.Value,
			CreateTime:   time.Now().Unix(),
		}
		err = tx.Save(&historyItem).Error
		if err != nil {
			return
		}
	}
	return
}

// publishLogAdd Obtain the configuration data released in the previous version, and save the changes in diff to json
func (c *confgo) publishLogAdd(tx *gorm.DB, caid int, historyID int, commonVal string) (diffKeyList []db.ConfigDiffData, err error) {

	diffKeyList = make([]db.ConfigDiffData, 0)
	resultList := make([]db.CmcHistory, 0)

	dbConn := tx.Table("cmc_history")
	if err = dbConn.Where("caid = ?", caid).Limit(2).Order("create_time desc").Find(&resultList).Error; err != nil {
		return
	}

	getValStr := func(val interface{}) string {
		nowBuf, _ := json.Marshal(val)
		return string(nowBuf)
	}

	createPublishLogFunc := func(preContent, content string) error {
		diffText := db.DiffText{
			PreContent:    preContent,
			Content:       content,
			CommonContent: commonVal,
		}
		publishLogData := db.CmcPublishLog{
			HistoryId:  historyID,
			Type:       1, // publish
			CreateTime: time.Now().Unix(),
			DiffText:   getValStr(diffText),
		}
		if err = tx.Create(&publishLogData).Error; err != nil {
			return err
		}
		return nil
	}

	if len(resultList) < 2 {
		if len(resultList) == 1 { // First version
			tomlData := resultList[0]
			if err = createPublishLogFunc("", tomlData.Text); err != nil {
				return
			}
			return
		}
		// No release record
		return
	}

	latestData, preData := resultList[0], resultList[1]
	if err = createPublishLogFunc(preData.Text, latestData.Text); err != nil {
		return
	}
	return
}

// Synchronize configuration item status after successful publication
func (c *confgo) syncItemsStatus(tx *gorm.DB, caid int) error {
	// Really delete configuration items
	if err := tx.Table("cmc_config").Where("caid = ? AND status = ?", caid, model.ItemStatusDel).Delete(db.CmcConfig{}).Error; err != nil {
		return err
	}
	// Reset the remaining configuration items to release
	if err := tx.Table("cmc_config").Where("caid = ? ANd status <> ?", caid, model.ItemStatusDel).Updates(map[string]interface{}{"status": model.ItemStatusPub}).Error; err != nil {
		return err
	}
	return nil
}

func (c *confgo) Rollback(configID int, nowID, historyID int, u *db.User) (err error) {
	tx := c.DB.Begin()
	if err = c.rollbackItems(tx, configID); err != nil {
		tx.Rollback()
		return
	}
	nowItems, err := c.getVersionKVList(nowID)
	if err != nil {
		tx.Rollback()
		return
	}

	historyItems, err := c.getVersionKVList(historyID)
	if err != nil {
		tx.Rollback()
		return
	}

	// Find differences between versions
	oldTargetMap := make(map[string]interface{}, 0)
	for _, item := range nowItems {
		oldTargetMap[strconv.Itoa(item.KeyId)] = item
	}

	newTargetMap := make(map[string]interface{}, 0)
	for _, item := range historyItems {
		newTargetMap[strconv.Itoa(item.KeyId)] = item
	}

	add := util.Diff(newTargetMap, oldTargetMap)
	del := util.Diff(oldTargetMap, newTargetMap)

	var update []db.CmcHistoryItem
	for historyItemKeyID, row := range newTargetMap {
		if _, ok := oldTargetMap[historyItemKeyID]; ok {
			update = append(update, row.(db.CmcHistoryItem))
		}
	}
	if err = c.updateConfigKV(tx, update, u); err != nil {
		tx.Rollback()
		return
	}
	if err = c.addConfigKV(tx, c.convertConfigItem(add), u); err != nil {
		tx.Rollback()
		return
	}

	if err = c.deleteConfigKV(tx, c.convertConfigItem(del), u); err != nil {
		tx.Rollback()
		return
	}
	tx.Commit()
	return
}

func (c *confgo) convertConfigItem(in map[string]interface{}) (out []db.CmcHistoryItem) {
	for _, v := range in {
		out = append(out, v.(db.CmcHistoryItem))
	}
	return out
}

func (c *confgo) getVersionKVList(historyID int) (result []db.CmcHistoryItem, err error) {
	result = make([]db.CmcHistoryItem, 0)
	dbConn := c.DB.Table("cmc_history_item")
	if err := dbConn.Where("cmc_history_id = ?", historyID).Find(&result).Error; err != nil {
		return result, err
	}
	return result, nil
}

func (c *confgo) addConfigKV(tx *gorm.DB, historyItems []db.CmcHistoryItem, u *db.User) (err error) {
	for _, item := range historyItems {
		if err = ConfuSrv.AddWithTx(item.Caid, item.Key, item.Value, 0, u.Nickname, tx); err != nil {
			return
		}
	}
	return
}

func (c *confgo) deleteConfigKV(tx *gorm.DB, historyItems []db.CmcHistoryItem, u *db.User) (err error) {
	for _, item := range historyItems {
		if err = ConfuSrv.DeleteWithTx(uint64(item.KeyId), u.Nickname, tx); err != nil {
			return
		}
	}
	return
}

func (c *confgo) updateConfigKV(tx *gorm.DB, historyItems []db.CmcHistoryItem, u *db.User) (err error) {
	for _, item := range historyItems {
		if err = ConfuSrv.UpdateWithTx(uint64(item.KeyId), item.Caid, "", item.Value, 0, u.Nickname, tx); err != nil {
			return
		}
	}
	return
}

// 清除caid下的数据项，再重新写入数据项
func (c *confgo) rollbackItems(tx *gorm.DB, caid int) error {
	// 删除还没有发布的配置项
	if err := c.DB.Where("caid = ? AND status <> 1", caid).Delete(&db.CmcConfig{}).Error; err != nil {
		return err
	}
	return nil
}
