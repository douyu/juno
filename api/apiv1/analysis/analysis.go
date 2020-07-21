package analysis

import (
	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/analysis"
	"github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/labstack/echo/v4"
)

// 统计信息
func Index(c *core.Context) error {
	return c.OutputJSON(output.MsgOk, "success", map[string]interface{}{
		"app_cnt":    resource.Resource.GetAppCnt(),
		"region_cnt": resource.Resource.GetRegionCnt(),
		"zone_cnt":   resource.Resource.GetZoneCnt(),
		"env_cnt":    resource.Resource.GetEnvCnt(),
		"node_cnt":   resource.Resource.GetNodeCnt(),
	})
}

// 看板拓扑
func TopologySelect(c echo.Context) error {
	region_select, zone_select, env_select := resource.Resource.GetSelectData()

	// 依赖类型，如mysql，redis等
	typeArr, _ := analysis.Analysis.ListAllCfgType()
	typeSelect := make([]view.SelectData, 0)
	for _, value := range typeArr {
		typeSelect = append(typeSelect, view.SelectData{
			Title: value,
			Value: value,
		})
	}
	addrArr, _ := analysis.Analysis.ListAddr()
	addrSelect := make([]view.SelectData, 0)
	for _, value := range addrArr {
		addrSelect = append(addrSelect, view.SelectData{
			Title: value,
			Value: value,
		})
	}

	apps, _ := resource.Resource.GetAllApp()
	appSelect := make([]view.SelectData, 0)
	for _, value := range apps {
		appSelect = append(appSelect, view.SelectData{
			Title: value.Name + "(" + value.AppName + ")",
			Value: value.AppName,
		})
	}

	return output.JSON(c, output.MsgOk, "success", map[string]interface{}{
		"region_select": region_select,
		"zone_select":   zone_select,
		"env_select":    env_select,
		"type_select":   typeSelect,
		"app_select":    appSelect,
		"addr_select":   addrSelect,
	})
}

// 应用列表
func TopologyList(c echo.Context) error {
	var err error
	reqModel := ReqTopologyList{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	list, page, err := analysis.Analysis.GetTopologyList(reqModel.AppTopology, reqModel.CurrentPage, reqModel.PageSize, "update_time desc,id desc")
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", map[string]interface{}{
		"pagination": page,
		"list":       list,
	})
}

func TopologyRelationship(c echo.Context) error {
	var (
		err error
		res []RespRelationship
	)
	reqModel := ReqTopologyList{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	list, _, err := analysis.Analysis.GetTopologyList(reqModel.AppTopology, 1, 10000, "update_time desc,id desc")

	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	res = make([]RespRelationship, 0)
	for _, item := range list {
		res = append(res, RespRelationship{
			Aid:        item.Aid,
			Name:       item.Name,
			Type:       item.Type,
			Source:     item.AppName,
			Target:     item.Addr,
			MateData:   "",
			UpdateTime: item.UpdateTime,
		})
	}
	return output.JSON(c, output.MsgOk, "success", res)
}
