package service

import (
	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/model/db"
	"github.com/douyu/juno/internal/pkg/model/view"
)

// SrvRelation ...
type SrvRelation struct {
	Aid        int    `json:"aid"`
	Name       string `json:"name"`
	Type       string `json:"type"`
	Source     string `json:"source"`
	Target     string `json:"target"`
	MetaData   string `json:"metaData"`
	UpdateTime int64  `json:"updateTime"`
}

func ListRelationUnique(list []view.RelationApps) []view.RelationApps {
	if len(list) == 0 {
		return list
	}
	res := make([]view.RelationApps, 0)
	for _, u := range list {
		flag := true
		for _, v := range res {
			if u.AppName == v.AppName && u.Type == v.Type && u.Addr == v.Addr && u.Info == v.Info && u.Name == v.Name {
				flag = false
				break
			}
		}
		if flag {
			res = append(res, u)
		}
	}
	return res
}

func GetRelationApps(reqModel view.ReqRelationApps) (view.RespRelationApps, error) {
	resp := view.RespRelationApps{
		Current:  reqModel.Current,
		PageSize: reqModel.PageSize,
		List:     make([]view.RelationApps, 0),
		AddrList: make([]string, 0),
	}
	dbConn := invoker.JunoMysql.Table("app_topology AS a").Joins("JOIN app b ON a.aid = b.aid")
	if reqModel.IsApp == 1 {
		dbConn = dbConn.Where("b.app_name in (?)", reqModel.AppList)
	}
	if reqModel.IsApp == 1 {
		dbConn = dbConn.Where("b.app_name in (?)", reqModel.AppList)
	}
	if err := dbConn.Where("a.env = ? and a.type in (?)", reqModel.Env, reqModel.Types).Group("a.addr").
		Order("type DESC").Pluck("a.addr", &resp.AddrList).Error; err != nil {
		return resp, err
	}
	dbConn = invoker.JunoMysql.Table("app_topology AS a").Select("a.type, a.addr, b.app_name, a.name, a.update_time, a.info")
	dbConn = dbConn.Joins("JOIN app b ON a.aid = b.aid").Where("a.env = ? and a.type in (?)", reqModel.Env, reqModel.Types)
	// .Group("a.addr")
	if reqModel.IsAddr == 1 {
		dbConn = dbConn.Where("a.addr in (?)", reqModel.AddrList)
	}
	if reqModel.IsApp == 1 {
		dbConn = dbConn.Where("b.app_name in (?)", reqModel.AppList)
	}
	if err := dbConn.Count(&resp.Total).Error; err != nil {
		return resp, err
	}
	page := reqModel.Current - 1
	if reqModel.PageSize <= 0 || reqModel.PageSize > 20 {
		reqModel.PageSize = 20
	}
	if err := dbConn.Offset(page * reqModel.PageSize).Limit(reqModel.PageSize).Order("type DESC").Find(&resp.List).Error; err != nil {
		return resp, err
	}
	resp.List = ListRelationUnique(resp.List)
	return resp, nil
}

// 获取服务依赖数据
/*
 * params: env, type
 */
func ListRSByEnvAndType(env, t string) ([]*SrvRelation, error) {
	relations := make([]*SrvRelation, 0)
	if err := invoker.JunoMysql.Table("app_topology AS a").Select("a.aid, b.app_name AS source, a.addr AS target, a.`name`, a.update_time, a.meta_data").
		Joins("LEFT JOIN app b ON a.aid = b.aid").Where("a.env = ? and a.type = ?", env, t).Find(&relations).Error; err != nil {
		return relations, err
	}
	return relations, nil
}

// ListAllCfgEnv 列出表中所有的环境，不重复
func ListAllCfgEnv() ([]string, error) {
	envs := make([]struct {
		Env string `json:"env"`
	}, 0)

	result := make([]string, 0)
	if err := invoker.JunoMysql.Model(db.AppTopology{}).Select("env").Group("env").Find(&envs).Error; err != nil {
		return result, err
	}

	for _, e := range envs {
		result = append(result, e.Env)
	}
	return result, nil
}
