package system

import "github.com/douyu/juno/pkg/model/db"

// 机房信息
type ReqOptionInfo struct {
	Id          int    `query:"id"`
	OptionTitle string `query:"option_title"`
}

type ReqOptionList struct {
	CurrentPage int `query:"currentPage"`
	PageSize    int `query:"pageSize"`
}

type ReqOptionCreate struct {
	db.Option
}

type ReqOptionUpdate struct {
	db.Option
}

type ReqOptionDelete struct {
	db.Option
}
