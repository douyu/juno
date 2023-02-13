package install

import (
	"fmt"
	"log"

	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/service/permission"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/labstack/echo/v4"
)

func mockGrafanaSetting(url string, e *echo.Echo) {
	body := `{
		"name":"grafana",
		"content":"{\"host\":\"http://127.0.0.1:3000\",\"header_name\":\"X-WEBAUTH-USER\",\"scheme\":\"http\"}"
	}`
	fmt.Println(string(PostForm(url, body, e)))
}

func mockAdminUser() {
	var user db.User
	invoker.JunoMysql.Where("uid = ?", 1).First(&user)
	if user.Uid == 0 {
		return
	}

	err := permission.UserGroup.ChangeUserGroup(view.ReqChangeUserGroup{
		UID:    uint(user.Uid),
		Groups: []string{"admin", "grafana"},
	})
	if err != nil {
		return
	}
}

func mockPermission() {
	err := permission.UserGroup.SetPerm("grafana",
		string(db.CasbinPolicyTypeMonitor), db.MonitorPermWrite, db.CasbinPolicyTypeMonitor)
	if err != nil {
		log.Printf("mock permission failed: %s", err.Error())
		return
	}
}
