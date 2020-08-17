package permission

import (
	"fmt"

	"github.com/douyu/juno/internal/pkg/service/casbin"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/juno/pkg/util"
	"github.com/jinzhu/gorm"
	"golang.org/x/sync/errgroup"
)

var (
	UserGroup *userGroup

	DefaultUserGroup = "default"

	ErrUserGroupNotFund = fmt.Errorf("用户组不存在")
	ErrInvalidAppPerm   = fmt.Errorf("无效的应用权限Key")
	ErrInvalidAPIPerm   = fmt.Errorf("无效的接口权限")
)

type (
	userGroup struct {
		db *gorm.DB
	}
)

func initUserGroup(db *gorm.DB) {
	UserGroup = &userGroup{
		db: db,
	}
}

func (u *userGroup) List() (resp view.RespListUserGroup, err error) {
	groupList := make([]db.CasbinPolicyGroup, 0)
	err = u.db.Where("type = ?", db.CasbinGroupTypeUser).
		Group("group_name").
		Find(&groupList).Error
	if err != nil {
		return nil, err
	}

	for _, item := range groupList {
		resp = append(resp, view.ListGroupItem{
			Name: item.GroupName,
		})
	}

	return
}

func (u *userGroup) Update(param view.ReqUpdateGroup) (err error) {
	return u.db.Model(&db.CasbinPolicyGroup{}).
		Where("group_name = ?", param.OriginalName).
		Where("type = ?", db.CasbinGroupTypeUser).
		Set("group_name", param.CurrentName).Error
}

func (u *userGroup) Find(groupName string) (group db.CasbinPolicyGroup, err error) {
	err = u.db.Where("group_name = ?", groupName).First(&group).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return db.CasbinPolicyGroup{}, ErrUserGroupNotFund
		}

		return
	}

	return
}

func (u *userGroup) ChangeUserGroup(param view.ReqChangeUserGroup) (err error) {
	var oldGroups []db.CasbinPolicyGroup
	var newGroups []db.CasbinPolicyGroup

	err = u.db.Where("uid = ? and type = ?", param.UID, db.CasbinGroupTypeUser).Find(&oldGroups).Error
	if err != nil {
		return
	}

	for _, groupName := range param.Groups {
		newGroups = append(newGroups, db.CasbinPolicyGroup{
			GroupName: groupName,
			Uid:       int(param.UID),
			Type:      db.CasbinGroupTypeUser,
		})
	}

	cmpFunc := func(a, b interface{}) bool {
		gA, gB := a.(db.CasbinPolicyGroup), b.(db.CasbinPolicyGroup)
		return gA.GroupName == gB.GroupName
	}
	groupsToRemove := util.DiffListToSlice(oldGroups, newGroups, cmpFunc).([]db.CasbinPolicyGroup)
	groupsToCreate := util.DiffListToSlice(newGroups, oldGroups, cmpFunc).([]db.CasbinPolicyGroup)

	for _, group := range groupsToRemove {
		u.db.Delete(&group)
	}

	for _, group := range groupsToCreate {
		u.db.Save(&group)
	}

	_ = casbin.Casbin.LoadPolicy()

	return nil
}

func (u *userGroup) CreateAppPermission(param view.ReqSetGroupAppPerm) (err error) {
	var group db.CasbinPolicyGroup
	var policies []db.CasbinPolicyAuth
	var oldPolicies []db.CasbinPolicyAuth

	group, err = u.Find(param.GroupName)
	if err != nil {
		return
	}

	sub := casbin.CasbinGroupKey(db.CasbinGroupTypeUser, group.GroupName)
	objs := make([]string, 0)
	for _, env := range param.Env {
		objs = append(objs, casbin.CasbinAppObjKey(param.AppName, env))
		for _, act := range param.Action {
			obj := casbin.CasbinAppObjKey(param.AppName, env)
			if !casbin.Casbin.CheckAppPermissionKeyValid(act) {
				return ErrInvalidAppPerm
			}

			policies = append(policies, db.CasbinPolicyAuth{
				Sub:  sub,
				Obj:  obj,
				Act:  act,
				Type: db.CasbinPolicyTypeApp,
			})
		}
	}

	err = u.db.Where("sub = ? and obj in (?)", sub, objs).Find(&oldPolicies).Error
	if err != nil {
		return err
	}

	cmpPolicyFunc := func(a, b interface{}) bool {
		pa, pb := a.(db.CasbinPolicyAuth), b.(db.CasbinPolicyAuth)
		return pa.Sub == pb.Sub && pa.Obj == pb.Obj && pa.Act == pb.Act
	}

	policiesToAdd := util.DiffList(policies, oldPolicies, cmpPolicyFunc)
	policiesToRemove := util.DiffList(oldPolicies, policies, cmpPolicyFunc)

	tx := u.db.Begin()
	{
		for _, item := range policiesToAdd {
			policy := item.(db.CasbinPolicyAuth)
			err = tx.Create(&policy).Error
			if err != nil {
				tx.Rollback()
				return
			}
		}
		for _, item := range policiesToRemove {
			policy := item.(db.CasbinPolicyAuth)
			err = tx.Delete(&policy).Error
			if err != nil {
				tx.Rollback()
				return
			}
		}
	}
	err = tx.Commit().Error
	if err != nil {
		return err
	}

	_ = casbin.Casbin.LoadPolicy()

	return
}

func (u *userGroup) SetAPIPerm(param view.ReqSetGroupAPIPerm) (err error) {
	var group db.CasbinPolicyGroup
	var polices []db.CasbinPolicyAuth

	group, err = u.Find(param.GroupName)
	if err != nil {
		return
	}

	for _, item := range param.APIList {
		if !casbin.Casbin.CheckAPIValid(item.Path, item.Method) {
			return ErrInvalidAPIPerm
		}
	}

	sub := casbin.CasbinGroupKey(db.CasbinGroupTypeUser, group.GroupName)

	// load all perm
	err = u.db.Where("type = ? and sub = ?", db.CasbinPolicyTypeAPI, sub).Find(&polices).Error
	if err != nil {
		return
	}

	targetPolicies := make([]db.CasbinPolicyAuth, 0)
	for _, item := range param.APIList {
		targetPolicies = append(targetPolicies, db.CasbinPolicyAuth{
			Sub:  sub,
			Obj:  item.Path,
			Act:  item.Method,
			Type: db.CasbinPolicyTypeAPI,
		})
	}

	newPolicies := util.DiffListToSlice(targetPolicies, polices, func(a, b interface{}) bool {
		pA, pB := a.(db.CasbinPolicyAuth), b.(db.CasbinPolicyAuth)
		return pA.Act == pB.Act && pA.Obj == pB.Obj && pA.Sub == pA.Sub && pA.Type == pB.Type
	})
	removedPolices := util.DiffListToSlice(polices, targetPolicies, func(a, b interface{}) bool {
		pA, pB := a.(db.CasbinPolicyAuth), b.(db.CasbinPolicyAuth)
		return pA.Act == pB.Act && pA.Obj == pB.Obj && pA.Sub == pA.Sub && pA.Type == pB.Type
	})

	tx := u.db.Begin()
	{
		// create new perm
		err = u.createPerms(tx, newPolicies.([]db.CasbinPolicyAuth))
		if err != nil {
			tx.Rollback()
			return
		}
		// remove old perm
		err = u.deletePerms(tx, removedPolices.([]db.CasbinPolicyAuth))
		if err != nil {
			tx.Rollback()
			return
		}
	}
	err = tx.Commit().Error
	if err != nil {
		tx.Rollback()
		return err
	}

	_ = casbin.Casbin.LoadPolicy()

	return
}

func (u *userGroup) SetMenuPerm(param view.ReqSetGroupMenuPerm) (err error) {
	var group db.CasbinPolicyGroup
	var oldMenuPolices []db.CasbinPolicyAuth

	group, err = u.Find(param.GroupName)
	if err != nil {
		return err
	}

	sub := casbin.CasbinGroupKey(db.CasbinGroupTypeUser, group.GroupName)

	// load all menu perm
	err = u.db.Where("sub = ? and type = ?", sub, db.CasbinPolicyTypeMenu).Find(&oldMenuPolices).Error
	if err != nil {
		return err
	}

	// filter menu
	menuFiltered := make([]db.CasbinPolicyAuth, 0)
	menuToRemove := make([]db.CasbinPolicyAuth, 0)
	for _, item := range param.Menu {
		exists := false
		for _, policy := range oldMenuPolices {
			if policy.Obj == item {
				exists = true
				break
			}
		}

		policyItem := db.CasbinPolicyAuth{
			Sub:  sub,
			Obj:  item,
			Act:  string(casbin.ActionReadMenu),
			Type: db.CasbinPolicyTypeMenu,
		}

		if !exists {
			menuFiltered = append(menuFiltered, policyItem)
		}
	}

	for _, policy := range oldMenuPolices {
		exists := false
		for _, item := range param.Menu {
			if policy.Obj == item {
				exists = true
				break
			}
		}

		if !exists {
			menuToRemove = append(menuToRemove, policy)
		}
	}

	tx := u.db.Begin()
	{
		// create new perm
		err = u.createPerms(tx, menuFiltered)
		if err != nil {
			tx.Rollback()
			return
		}
		// remove old perm
		err = u.deletePerms(tx, menuToRemove)
		if err != nil {
			tx.Rollback()
			return
		}
	}
	err = tx.Commit().Error
	if err != nil {
		tx.Rollback()
		return err
	}

	_ = casbin.Casbin.LoadPolicy()

	return
}

func (u *userGroup) createPerms(mysql *gorm.DB, list []db.CasbinPolicyAuth) (err error) {
	for _, item := range list {
		var policy db.CasbinPolicyAuth

		// check policy
		err = mysql.Where("sub = ? and obj = ? and act = ? and type = ?", item.Sub, item.Obj, item.Act, item.Type).
			First(&policy).Error
		if err != gorm.ErrRecordNotFound {
			continue
		}

		err = mysql.Save(&item).Error
		if err != nil {
			return
		}
	}

	return
}

func (u *userGroup) deletePerms(mysql *gorm.DB, list []db.CasbinPolicyAuth) (err error) {
	for _, item := range list {
		//err = mysql.Where("sub = ? and obj = ? and act = ? and type = ?", item.Sub, item.Obj, item.Act, item.Type).
		//	Delete(&db.CasbinPolicyAuth{}).Error
		err = mysql.Delete(&item).Error
		if err != nil {
			return
		}
	}

	return
}

func (u *userGroup) GetMenuPerm(param view.ReqGetGroupMenuPerm) (resp view.RespGetMenuPerm, err error) {
	menu, err := casbin.Casbin.GetMenu(casbin.CasbinGroupKey(db.CasbinGroupTypeUser, param.GroupName))
	if err != nil {
		return
	}

	menuList := expandMenuTree(menu)

	for _, item := range menuList {
		resp = append(resp, item.Path)
	}

	return
}

func (u *userGroup) GetAPIPerm(param view.ReqGetGroupAPIPerm) (resp view.RespGetGroupAPIPerm, err error) {
	list := casbin.Casbin.APIList(casbin.CasbinGroupKey(db.CasbinGroupTypeUser, param.GroupName))
	for _, item := range list {
		resp = append(resp, view.APIPermItem{
			Method: item.Method,
			Path:   item.Path,
		})
	}

	return
}

//Unused
func (u *userGroup) GetAppPerm(param view.ReqGetAppPerm) (resp view.RespGetAppPerm, err error) {
	var apps []db.AppInfo
	var eg errgroup.Group

	page := param.Page
	pageSize := param.PageSize
	if pageSize > 1000 {
		pageSize = 1000
	}
	offset := page * pageSize

	resp.Pagination.Current = int(page)
	resp.Pagination.PageSize = int(pageSize)

	query := u.db.Model(&db.AppInfo{})
	if param.AppNameSearch != "" {
		query = query.Where("app_name like ?", "%"+param.AppNameSearch+"%")
	}

	eg.Go(func() error {
		return query.Count(resp.Pagination.Total).Error
	})

	eg.Go(func() error {
		return query.Preload("AppNodes", func(db *gorm.DB) *gorm.DB {
			// group by env
			return db.Group("env")
		}).Limit(pageSize).Offset(offset).Find(&apps).Error
	})

	for _, app := range apps {
		appItem := view.AppPermItem{
			Aid:           app.Aid,
			AppName:       app.AppName,
			AvailableEnvs: make([]string, 0),
			AllowEnvs:     make([]string, 0),
		}

		for _, node := range app.AppNodes {
			appItem.AvailableEnvs = append(appItem.AvailableEnvs, node.Env)
		}

		resp.List = append(resp.List, appItem)
	}

	return
}

func (u *userGroup) SetPerm(sub, object, action string, policyType db.CasbinPolicyType) (err error) {
	var policy db.CasbinPolicyAuth

	err = u.db.Where("sub = ?", casbin.CasbinGroupKey(casbin.GroupTypeUser, sub)).
		Where("obj = ?", object).
		Where("act = ?", action).
		Where("type = ?", policyType).
		First(&policy).
		Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return
	}

	policy.Sub = casbin.CasbinGroupKey(casbin.GroupTypeUser, sub)
	policy.Act = action
	policy.Obj = object
	policy.Type = policyType

	err = u.db.Save(&policy).Error
	if err != nil {
		return err
	}

	return nil
}

// expand menu-tree to list
func expandMenuTree(tree view.MenuTree) (list []view.MenuTreeItem) {
	var expandFunctor func(tree view.MenuTree)
	expandFunctor = func(tree view.MenuTree) {
		for _, item := range tree {
			list = append(list, view.MenuTreeItem{
				Name:     item.Name,
				Path:     item.Path,
				Children: nil,
			})

			if len(item.Children) > 0 {
				expandFunctor(item.Children)
			}
		}
	}

	expandFunctor(tree)

	return
}
