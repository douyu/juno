package user

import "github.com/douyu/juno/pkg/model/db"

type ReqUserList struct {
	CurrentPage int `query:"currentPage"`
	PageSize    int `query:"pageSize"`
}

type ReqUserCreate struct {
	db.User
}

type ReqUserUpdate struct {
	db.User
}

type ReqUserDelete struct {
	db.User
}
