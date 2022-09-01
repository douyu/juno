package permission

import (
	"fmt"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/store/gorm"
)

var (
	// AppGroup ..
	AppGroup           *appGroup
	ErrAppEnvNotExists = fmt.Errorf("应用环境不存在")
)

type appGroup struct {
	db *gorm.DB
}

func initAppGroup(db *gorm.DB) {
	AppGroup = &appGroup{
		db: db,
	}
}

func (a *appGroup) List() (resp view.RespListAppGroup, err error) {
	list := make([]db.CasbinPolicyGroup, 0)
	err = a.db.Where("type = ?", db.CasbinGroupTypeApp).Group("group_name").Find(&list).Error
	if err != nil {
		return nil, err
	}

	for _, item := range list {
		resp = append(resp, view.ListGroupItem{Name: item.GroupName})
	}

	return
}

func (a *appGroup) checkAppEnv(appName, env string) error {
	appNodeExists := int64(0)
	err := a.db.Where("app_name = ? and env = ?", appName, env).Count(&appNodeExists).Error
	if err != nil {
		return err
	} else if appNodeExists == 0 {
		return ErrAppEnvNotExists
	}
	return nil
}

func (a *appGroup) ChangeAppGroup(param view.ReqChangeAppGroup) (err error) {
	var group db.CasbinPolicyGroup
	err = a.checkAppEnv(param.AppName, param.AppEnv)
	if err != nil {
		return err
	}

	err = a.db.Where("app_name = ? and app_env = ? and type = ?", param.AppName, param.AppEnv, db.CasbinGroupTypeApp).
		First(&group).Error
	if err != nil {
		if err != gorm.ErrRecordNotFound {
			return
		}

		group = db.CasbinPolicyGroup{
			GroupName: param.GroupName,
			AppName:   param.AppName,
			AppEnv:    param.AppEnv,
			Type:      db.CasbinGroupTypeApp,
		}
	} else {
		group.GroupName = param.GroupName
	}

	err = a.db.Save(&group).Error
	if err != nil {
		return err
	}

	return nil
}

func (a *appGroup) Update(param view.ReqUpdateGroup) (err error) {
	return a.db.Model(&db.CasbinPolicyGroup{}).
		Where("group_name = ? and type = ?", param.OriginalName, db.CasbinGroupTypeApp).
		Set("group_name", param.CurrentName).
		Error
}
