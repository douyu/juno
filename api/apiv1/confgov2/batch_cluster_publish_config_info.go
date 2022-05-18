package confgov2

import (
	"strconv"
	"strings"

	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/confgov2"
	"github.com/labstack/echo/v4"
)

//BatchClusterPublishConfigInfo 配置文件列表
func BatchClusterPublishConfigInfo(c echo.Context) (err error) {
	clusters := c.FormValue("clusters")
	if clusters == "" {
		return output.JSON(c, output.MsgErr, "参数无效 clusters :"+clusters)
	}
	configId, pErr := strconv.ParseUint(strings.TrimSpace(c.FormValue("id")), 10, 64)
	if pErr != nil {
		return output.JSON(c, output.MsgErr, "参数无效:"+pErr.Error())
	}
	//集群配置信息
	configuration, _ := confgov2.BatchClusterPublishConfigInfo(strings.Split(clusters, ","), configId)
	return output.JSON(c, output.MsgOk, "success", configuration)
}
