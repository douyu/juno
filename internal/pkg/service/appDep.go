package service

import (
	"encoding/base64"
	"fmt"
	"strconv"
	"time"

	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/library/util"
	"github.com/douyu/juno/internal/pkg/packages/gitlab"
	"github.com/douyu/juno/internal/pkg/packages/gitlab/client"
	"github.com/douyu/juno/internal/pkg/packages/gitlab/model"
	"github.com/douyu/juno/internal/pkg/service/confgo"
	"github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/conf"
	log "github.com/sirupsen/logrus"
)

type appDep struct{}

// 查询所有包依赖数据
func (a *appDep) AllPkgList(appName string, q, rg, ver string) (list []view.RespAppPkgAllList, err error) {
	search := ""
	if len(q) > 2 {
		search = "%" + q + "%"
	}

	isPkg, depth := util.StringPkg(q)

	sql := invoker.JunoMysql.Table("app_package as a").
		Select("a.name as dep_name, a.branch as dep_branch, a.version as dep_version, a.aid, c.app_name, a.update_time").
		Joins("LEFT JOIN  app as c ON a.aid = c.aid").
		Where("c.app_name <> ''")

	if appName != "" {
		sql = sql.Where("c.app_name=?", appName)
	}

	if search != "" {
		if isPkg == true && depth >= 2 {
			// 输入的是一个完整包则精准匹配
			sql = sql.Where("a.name = ?", q)
		} else {
			sql = sql.Where("a.name like ?", search)
		}
	}
	if rg != "" && ver != "" {
		sql = sql.Where(" a.version "+rg+" ? ", "v"+ver)
	}

	if err = sql.Find(&list).Error; err != nil {
		return list, err
	}

	return list, nil
}

// 查询所有包类型
func (a *appDep) AllVersionPkgGroup(qs string, rg, ver string) (list []view.RespAppPkgAllList, err error) {
	search := ""
	if len(qs) > 2 {
		search = "%" + qs + "%"
	}

	sql := invoker.JunoMysql.Table("app_package as a").
		Select("a.name as dep_name, a.version as dep_version")
	if search != "" {
		sql = sql.Where("a.name like ?", search)
	}
	if rg != "" && ver != "" {
		sql = sql.Where(" a.version "+rg+" ? ", "v"+ver)
	}

	if err = sql.Group("`name`,`version`").Find(&list).Error; err != nil {
		return list, err
	}
	return list, nil
}

// 查询所有的依赖包
func (a *appDep) AllPkgGroup() (list []view.RespAppPkgAllList, err error) {
	sql := invoker.JunoMysql.Table("app_package as a").
		Select("a.name as dep_name")
	if err = sql.Group("`name`").Find(&list).Error; err != nil {
		return list, err
	}
	return list, nil
}

// 查询所有的依赖包相关应用
func (a *appDep) AllPkgAppGroup() (list []view.RespAppPkgAllList, err error) {
	sql := invoker.JunoMysql.Table("app_package as a").
		Select("a.name as dep_name, c.app_name, c.aid").
		Joins("LEFT JOIN  app as c ON a.aid = c.aid").Where("c.app_name <> ''")

	if err = sql.Group("`aid`").Find(&list).Error; err != nil {
		return list, err
	}
	return list, nil
}

// 查询所有包依赖应用=》包关系
func (a *appDep) AllPkgLinkList(limit int) (list []view.RespAppPkgLinkList, err error) {
	if err = invoker.JunoMysql.Table("app_package as a").Select("a.name as dep_name, a.aid").Limit(limit).Find(&list).Error; err != nil {
		return list, err
	}
	return list, nil
}

func (a *appDep) RunData() {
	// 获取所有的golang应用
	apps := resource.Resource.SimpleAppList("go")
	for _, app := range apps {
		// 如果应用负责人为空，需要通知用户补上，在此先跳过
		// if app.Uid <= 0 {
		//	log.Warn("no uid defined, skip", app.AppName)
		//	continue
		// }
		// for debug
		// if app.Aid != 10202 {
		//	continue
		// }
		if err := a.handleOneApp(app); err != nil {
			log.Error("parse pkg", "appName", app.AppName, "err", err.Error())
		}
		// 控制一下速度
		time.Sleep(time.Second * 1)
	}
}

func (p *appDep) handleOneApp(app db.AppInfo) error {
	user := &model.User{
		Token:  conf.GetString("gitlabDown.token"),
		Secret: conf.GetString("gitlabDown.secret"),
	}
	// 先查询是否有 go.mod 文件
	fc, err := gitlab.IGitlab.FileRefParse(user, strconv.Itoa(app.Gid), "master", "go.mod")
	// 如果存在 go.mod 文件，优先以 go.mod 文件解析包依赖
	if err == nil {
		content, err := p.decode(fc)
		if err != nil {
			return err
		}
		return confgo.ParseGoModPkg(content, app.Aid)
	}
	fc, err = gitlab.IGitlab.FileRefParse(user, strconv.Itoa(app.Gid), "master", "Gopkg.lock")
	if err != nil {
		return err
	}
	content, err := p.decode(fc)
	if err != nil {
		return err
	}
	return confgo.ParseGoDepPkg(content, app.Aid)
}

func (p *appDep) decode(fc *client.FileContent) ([]byte, error) {
	if fc.Encoding != "base64" {
		return nil, fmt.Errorf("can't support %s except for base64", fc.Encoding)
	}
	content, err := base64.StdEncoding.DecodeString(fc.Content)
	if err != nil {
		return nil, fmt.Errorf("decode %s content err", fc.FileName)
	}
	return content, nil
}
