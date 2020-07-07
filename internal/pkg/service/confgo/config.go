package confgo

import (
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/store/gorm"
)

type cmc struct{}

type confu struct {
	DB *gorm.DB
}

func (cmc *confu) GetCmcStat(start, end int64) ([]db.AppCmcStat, []db.CmcCnt, int, error) {
	dbConn := cmc.DB.Table("cmc_app")
	// var res = make(map[string]model.ConfigVal)
	var (
		res    = make([]db.AppCmcStat, 0)
		cmcCnt = make([]db.CmcCnt, 0)
		total  = 0
	)

	if err := dbConn.Count(&total).Error; err != nil {
		return res, cmcCnt, total, err
	}

	if err := dbConn.Select("env,count(id) as cnt").Group("env").Find(&res).Error; err != nil {
		return res, cmcCnt, total, err
	}

	if err := dbConn.Select("DATE_FORMAT(FROM_UNIXTIME(create_time), '%Y-%m-%d') as day_time, count(id) as cnt").
		Where("create_time between ? and ?", start, end).Group("day_time").Find(&cmcCnt).Error; err != nil {
		return res, cmcCnt, total, err
	}
	return res, cmcCnt, total, nil

}
