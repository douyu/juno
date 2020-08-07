package analysis

import (
	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/analysis"
	"github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/juno/pkg/util"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
	"strings"
)

// 统计信息
func Index(c *core.Context) error {
	return c.OutputJSON(output.MsgOk, "success",
		c.WithData(map[string]interface{}{
			"app_cnt":    resource.Resource.GetAppCnt(),
			"region_cnt": resource.Resource.GetRegionCnt(),
			"zone_cnt":   resource.Resource.GetZoneCnt(),
			"env_cnt":    resource.Resource.GetEnvCnt(),
			"node_cnt":   resource.Resource.GetNodeCnt(),
		}),
	)
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

type ReqList struct {
	PkgQs   string `query:"pkgQs"`
	AppName string `query:"app_name" json:"app_name"`
	Operate string `query:"operate"`
	Ver     string `query:"ver"`
}

// 版本列表
func DependenceList(c echo.Context) error {
	var (
		result = make([]view.RespAppPkgAllList, 0)
		err    error
	)
	verRg := []string{"", "<", "<=", "=", ">", ">="}

	req := ReqList{}
	if err = c.Bind(&req); err != nil {
		return output.JSON(c, output.MsgErr, "参数错误:"+err.Error(), result)
	}

	req.PkgQs = strings.TrimSpace(req.PkgQs)
	req.Ver = strings.TrimSpace(req.Ver)

	rgIsOk := util.StringInArray(req.Operate, verRg)

	// 去掉v字段
	ver := strings.Replace(req.Ver, "v", "", -1)

	if req.AppName == "" && req.PkgQs == "" {
		// return output.JSON(c, output.MsgErr, "参数错误:必须传app_name或者PkgQs至少一个", result)
	}
	if rgIsOk == false {
		return output.JSON(c, output.MsgErr, "范围参数错误", result)
	}

	if result, err = resource.Resource.AllPkgList(req.AppName, req.PkgQs, req.Operate, ver); err != nil {
		xlog.Error("DependenceList.List", zap.Error(err), zap.Any("req", req))
		return output.JSON(c, output.MsgErr, err.Error(), result)
	}
	//return output.JSON(c, output.MsgOk, "success", result)
	return output.JSON(c, output.MsgOk, "success", map[string]interface{}{
		"list": result,
	})
}
