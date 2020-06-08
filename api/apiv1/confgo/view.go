package confgo

import "github.com/douyu/juno/internal/pkg/model/db"

type ReqTplList struct {
	db.CmcTpl
	KeywordsType string `query:"keywords_type"`
	Keywords     string `query:"keywords"`
	CurrentPage  int    `query:"currentPage"`
	PageSize     int    `query:"pageSize"`
}

type ConfigStaticsInfo struct {
	Value int    `json:"value"`
	Name  string `json:"name"`
}

type RespStatics struct {
	EnvCnt []ConfigStaticsInfo `json:"env_cnt"`
	CmcCnt []ConfigStaticsInfo `json:"cmc_cnt"`
	Total  int                 `json:"total"`
}
