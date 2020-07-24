package confgov2

import (
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/juno/pkg/util"
)

func StatisticsEnv() (res []view.EnvStatic, total int, err error) {
	dbConn := mysql.Table("configuration")
	res = make([]view.EnvStatic, 0)
	if err := dbConn.Count(&total).Error; err != nil {
		return res, total, err
	}

	if err := dbConn.Select("env,count(id) as cnt").Group("env").Find(&res).Error; err != nil {
		return res, total, err
	}
	return
}

func StatisticsCommit(start, end int64) (cmcCnt []view.CmcCnt, total int, err error) {
	dbConn := mysql.Table("configuration_history")
	cmcCnt = make([]view.CmcCnt, 0)
	if err := dbConn.Count(&total).Error; err != nil {
		return cmcCnt, total, err
	}
	if err := dbConn.Select("DATE_FORMAT(created_at, '%Y-%m-%d') as day_time, count(id) as cnt").
		Where("created_at between ? and ?", util.Timestamp2String(int(start)), util.Timestamp2String(int(end))).Group("day_time").Find(&cmcCnt).Error; err != nil {
		return cmcCnt, total, err
	}
	return
}
