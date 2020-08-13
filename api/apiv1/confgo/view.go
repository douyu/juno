package confgo

import "github.com/douyu/juno/pkg/model/db"

// ReqTplList ..
type ReqTplList struct {
	db.CmcTpl
	KeywordsType string `query:"keywords_type"`
	Keywords     string `query:"keywords"`
	CurrentPage  int    `query:"currentPage"`
	PageSize     int    `query:"pageSize"`
}
