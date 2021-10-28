package resource

import (
	"strconv"

	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/k8s"
	"github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/util"
	"github.com/labstack/echo/v4"
)

func AppNodeInfo(c echo.Context) error {
	var (
		err  error
		info db.AppNode
	)
	reqModel := ReqAppNodeInfo{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	info, err = resource.Resource.GetAppNodeInfo(reqModel.Id)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", info)
}
func AppNodeListSync(c echo.Context) error {
	aid, _ := strconv.ParseUint(c.QueryParam("aid"), 10, 32)
	if aid == 0 {
		return output.JSON(c, output.MsgErr, "aid is null")
	}
	err := k8s.Sync(uint32(aid))
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success")
}
func AppNodeList(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqAppNodeList{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	list, pagination, err := resource.Resource.GetAppNodeList(db.AppNode{
		AppName:  reqModel.AppName,
		Aid:      reqModel.Aid,
		HostName: reqModel.HostName,
		IP:       reqModel.Ip,
		Env:      reqModel.Env,
		ZoneCode: reqModel.ZoneCode,
	}, reqModel.CurrentPage, reqModel.PageSize)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", map[string]interface{}{
		"pagination": pagination,
		"list":       list,
	})
}

func AppNodePut(c echo.Context) error {
	var (
		err      error
		identify interface{}
	)
	reqModel := ReqAppNodePut{}
	if err = c.Bind(&reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	// todo 根据header头，识别是谁创建的
	if reqModel.Id > 0 {
		identify = reqModel.Id
	} else {
		identify = reqModel.AppName
	}

	err = resource.Resource.PutAppNode(identify, reqModel.List, &db.User{})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

func AppEnvZoneList(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqAppEnvNodeList{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	preNodes, err := resource.Resource.GetAllAppEnvZone(db.AppNode{
		AppName: reqModel.AppName,
	})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	type zone struct {
		ZoneCode string `json:"zone_code"`
		ZoneName string `json:"zone_name"`
	}

	type env struct {
		Env      string `json:"env"`
		ZoneList []zone `json:"zone_list"`
	}

	var record map[string]string
	record = make(map[string]string, 0)

	envZoneMap := make(map[string][]zone)

	for _, appNode := range preNodes {
		if _, ok := record[appNode.Env+"_"+appNode.ZoneCode]; !ok {
			envZoneMap[appNode.Env] = append(envZoneMap[appNode.Env], zone{
				ZoneCode: appNode.ZoneCode,
				ZoneName: appNode.ZoneName,
			})
		}
		record[appNode.Env+"_"+appNode.ZoneCode] = ""
	}

	var tree []env
	tree = make([]env, 0)
	for envKey, zoneList := range envZoneMap {
		tree = append(tree, env{
			Env:      envKey,
			ZoneList: zoneList,
		})
	}

	return output.JSON(c, output.MsgOk, "success", tree)
}

func AppNodeTransferList(c echo.Context) error {
	var err error
	reqModel := ReqAppNodeTransferList{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	list1, total1, err1 := resource.Resource.AppNodeTransferSource()
	if err1 != nil {
		return output.JSON(c, output.MsgErr, err1.Error())
	}

	target, total2, err2 := resource.Resource.AppNodeTransferTarget(reqModel.Aid)
	if err2 != nil {
		return output.JSON(c, output.MsgErr, err2.Error())
	}

	targetList := make([]string, 0)
	for _, item := range target {
		targetList = append(targetList, item.HostName)
	}

	return output.JSON(c, output.MsgOk, "success", map[string]interface{}{
		"source_total": total1,
		"source_list":  list1,
		"target_total": total2,
		"target_list":  targetList,
	})
}

func AppNodeTransferPut(c echo.Context) error {
	var err error
	reqModel := ReqAppNodeTransferPut{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	appInfo, err := resource.Resource.GetApp(reqModel.Aid)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	oldTarget, _, err := resource.Resource.AppNodeTransferTarget(reqModel.Aid)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	oldTargetMap := make(map[string]interface{}, 0)
	for _, item := range oldTarget {
		oldTargetMap[item.HostName] = item.HostName
	}

	newTargetMap := make(map[string]interface{}, 0)
	for _, item := range reqModel.Target {
		newTargetMap[item.HostName] = item.HostName
	}

	add := util.Diff(newTargetMap, oldTargetMap)
	del := util.Diff(oldTargetMap, newTargetMap)

	tx := invoker.JunoMysql.Begin()
	err = resource.Resource.AppNodeTransferPut(tx, add, del, appInfo, nil)
	if err != nil {
		tx.Rollback()
		return output.JSON(c, output.MsgErr, err.Error())
	}
	tx.Commit()
	return output.JSON(c, output.MsgOk, "success", "")
}
