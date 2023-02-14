package permission

import (
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/store/gorm"
)

var (
	User *user
)

type (
	user struct {
		db *gorm.DB
	}
)

func initUser(db *gorm.DB) {
	User = &user{
		db: db,
	}
}

func (u *user) List(param view.ReqListUser) (resp view.RespListUser, err error) {
	var users []db.User

	var limit = param.PageSize
	var offset = param.Page * param.PageSize
	var total int64

	if limit > 100 {
		limit = 100
	}

	query := u.db
	if param.GroupName != "" {
		query = query.Joins("left join casbin_policy_group as g on user.uid = g.uid").
			Where("g.group_name = ?", param.GroupName)
	}

	if param.Search != "" {
		searchText := "%" + param.Search + "%"
		query = query.Where("username like ? or nickname like ?", searchText, searchText)
	}

	err = query.Preload("Groups").
		Limit(limit).Offset(offset).Find(&users).Error
	if err != nil {
		return
	}
	err = query.Table("user").Count(&total).Error
	if err != nil {
		return
	}
	resp.Pagination.PageSize = int(limit)
	resp.Pagination.Current = int(param.Page)
	resp.Pagination.Total = total
	for _, user := range users {
		item := view.ListUserItem{
			UID:      uint(user.Uid),
			UserName: user.Username,
			NickName: user.Nickname,
			Access:   user.Access,
			Groups:   []string{DefaultUserGroup},
		}
		groups := make([]string, 0)
		for _, group := range user.Groups {
			groups = append(groups, group.GroupName)
		}
		if len(groups) != 0 {
			item.Groups = groups
		}

		resp.List = append(resp.List, item)
	}

	return
}
