package install

import (
	"fmt"
	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/pkg/model/db"

	"github.com/labstack/echo/v4"
)

func mockGrafanaSetting(url string, e *echo.Echo) {
	body := `{
		"name":"grafana",
		"content":"{\"host\":\"http://127.0.0.1:3000\",\"header_name\":\"X-WEBAUTH-USER\",\"api_dashboard_addr\":\"/grafana/d/api\",\"instance_dashboard_addr\":\"/grafana/d/instance\",\"overview_dashboard_addr\":\"/grafana/d/overview\"}"
	}`
	fmt.Println(string(PostForm(url, body, e)))
}

func mockAdminUser() {
	var user db.User
	invoker.JunoMysql.Where("uid = ?", 1).Find(&user)
	if user.Uid == 0 {
		return
	}
	if user.Access != "admin" {
		invoker.JunoMysql.Model(db.User{}).Where("uid = ?", 1).Updates(map[string]interface{}{
			"access": "admin",
		})

		err := invoker.JunoMysql.Save(&db.CasbinPolicyGroup{
			GroupName: "admin",
			Uid:       user.Uid,
			Type:      db.CasbinGroupTypeUser,
		}).Error
		if err != nil {
			return
		}

	}

}
