package auth

import (
	"fmt"

	"github.com/douyu/juno/internal/pkg/packages/gitlab"

	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/model/db"
)

func GitlabAuth(uid int, appName string) (ok bool, err error) {
	DB := invoker.JunoMysql
	user := db.User{}
	DB.Table("user").Where("uid = ?", uid).First(&user)
	if user.Uid == 0 {
		ok = false
		err = fmt.Errorf("user not exist")
		return
	}
	if user.Access == "admin" {
		return true, nil
	}
	appData := db.AppInfo{}
	DB.Table("app").Where("app_name = ?", appName).First(&appData)
	if appData.AppName == "" {
		ok = false
		err = fmt.Errorf("app not exist")
		return
	}
	if gitErr := gitlab.IGitlab.GetBranchAccessList(&user, fmt.Sprintf("%d", appData.Gid)); gitErr != nil {
		ok = false
		err = fmt.Errorf("app no auth")
		return
	}
	ok = true
	return
}

func GitlabMasterAuth(uid int, appName string) (ok bool, err error) {
	DB := invoker.JunoMysql
	user := db.User{}
	DB.Table("user").Where("uid = ?", uid).First(&user)
	if user.Uid == 0 {
		ok = false
		err = fmt.Errorf("user not exist")
		return
	}
	if user.Access == "admin" {
		return true, nil
	}
	appData := db.AppInfo{}
	DB.Table("app").Where("app_name = ?", appName).First(&appData)
	if appData.AppName == "" {
		ok = false
		err = fmt.Errorf("app not exist")
		return
	}

	level, gitErr := gitlab.IGitlab.GetProjectAccessList(&user, fmt.Sprintf("%d", appData.Gid))
	if gitErr != nil {
		ok = false
		err = fmt.Errorf("app no auth")
		return
	}
	// level >= 40 的时候表示有读写权限，可理解为master
	fmt.Println("level", level)
	if level >= 40 {
		ok = true
		return
	}
	ok = false
	return
}
