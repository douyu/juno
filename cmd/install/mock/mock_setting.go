package mock

import (
	"fmt"

	"github.com/labstack/echo/v4"
)

func mockGrafanaSetting(url string, e *echo.Echo) {
	body := `{
		"name":"grafana",
		"content":"{\"host\":\"http://jupiterconsole.douyu.com\",\"header_name\":\"X-Gw-Username\",\"api_dashboard_addr\":\"/grafana/d/api\",\"instance_dashboard_addr\":\"/grafana/d/instance\",\"overview_dashboard_addr\":\"/grafana/d/overview\"}"
	}`
	fmt.Print(PostForm(url, body, e))
}
