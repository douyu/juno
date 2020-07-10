package install

import (
	"fmt"

	"github.com/labstack/echo/v4"
)

func mockGrafanaSetting(url string, e *echo.Echo) {
	body := `{
		"name":"grafana",
		"content":"{\"host\":\"http://127.0.0.1:3000\",\"header_name\":\"X-WEBAUTH-USER\",\"api_dashboard_addr\":\"/grafana/d/api\",\"instance_dashboard_addr\":\"/grafana/d/instance\",\"overview_dashboard_addr\":\"/grafana/d/overview\"}"
	}`
	fmt.Println(string(PostForm(url, body, e)))
}
