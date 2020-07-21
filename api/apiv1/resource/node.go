package resource

import (
	"time"

	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/juno/pkg/util"
	"github.com/labstack/echo/v4"
)

func NodeInfo(c echo.Context) error {
	var (
		err      error
		info     db.Node
		identify interface{}
	)
	reqModel := ReqNodeInfo{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	if reqModel.Id > 0 {
		identify = reqModel.Id
	} else {
		identify = reqModel.HostName
	}
	tx := invoker.JunoMysql
	info, err = resource.Resource.GetNode(tx, identify)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", info)
}

func NodeList(c echo.Context) error {
	var err error
	reqModel := ReqNodeList{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	list, pagination, err := resource.Resource.GetNodeList(reqModel.Node, reqModel.CurrentPage, reqModel.PageSize, reqModel.KeywordsType, reqModel.Keywords, "update_time desc,id desc")
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", map[string]interface{}{
		"pagination": pagination,
		"list":       list,
	})
}

func NodePut(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqNodePut{}
	if err = c.Bind(&reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	tx := invoker.JunoMysql
	for _, value := range reqModel.List {
		err = resource.Resource.PutNode(tx, value)
		if err != nil {
			return output.JSON(c, output.MsgErr, err.Error())
		}
	}
	return output.JSON(c, output.MsgOk, "success")
}

// 只有可用区的创建功能
func NodeCreate(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqNodeCreate{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	err = resource.Resource.CreateNode(invoker.JunoMysql, reqModel.Node, &db.User{})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success")
}

func NodeUpdate(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqNodeUpdate{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	err = resource.Resource.UpdateNode(reqModel.Node, &db.User{})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success")
}

// 只有可用区的删除功能
func NodeDelete(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqNodeUpdate{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	err = resource.Resource.DeleteNode(reqModel.Node, &db.User{})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success")
}

// 只有可用区的创建功能
func NodeHeartBeat(c echo.Context) error {
	var (
		err error
	)
	reqModel := view.ReqNodeHeartBeat{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	err = resource.Resource.NodeHeartBeat(reqModel, &db.User{})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success")
}

func NodeTransferList(c echo.Context) error {
	var err error
	reqModel := ReqNodeTransferList{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	list1, total1, err1 := resource.Resource.NodeTransferSource()
	if err1 != nil {
		return output.JSON(c, output.MsgErr, err1.Error())
	}

	target, total2, err2 := resource.Resource.NodeTransferTarget(reqModel.ZoneCode, reqModel.Env)
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

func NodeTransferPut(c echo.Context) error {
	var err error
	reqModel := ReqNodeTransferPut{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	// get zone info
	zoneInfo, err := resource.Resource.GetZoneInfo(db.Zone{Id: reqModel.ZoneId})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	oldTarget, _, err := resource.Resource.NodeTransferTarget(zoneInfo.ZoneCode, zoneInfo.Env)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	oldTargetMap := make(map[string]interface{}, 0)
	for _, item := range oldTarget {
		oldTargetMap[item.HostName] = item.Id
	}

	newTargetMap := make(map[string]interface{}, 0)
	for _, item := range reqModel.Target {
		newTargetMap[item.HostName] = item.Id
	}

	add := util.Diff(newTargetMap, oldTargetMap)
	del := util.Diff(oldTargetMap, newTargetMap)

	err = resource.Resource.NodeTransferPut(add, del, zoneInfo)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success", "")
}

// NodeStatics
func NodeStatics(c echo.Context) error {
	end := time.Now().Unix()
	start := end - 86400*30
	dayCnts, err := resource.Resource.NodeDayCnt(start, end)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	list, err := resource.Resource.GetAllNode()
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	item1 := NodeStaticsInfo{
		Name: "未部署",
	}
	item2 := NodeStaticsInfo{
		Name: "心跳正常",
	}
	item3 := NodeStaticsInfo{
		Name: "心跳超时",
	}

	// 0 ,1 ,2-5, 5-10, >10
	app0 := NodeStaticsInfo{
		Name: "未关联应用",
	}
	app1 := NodeStaticsInfo{
		Name: "1个应用",
	}
	app2 := NodeStaticsInfo{
		Name: "2~5个应用",
	}
	app5 := NodeStaticsInfo{
		Name: "5~10个应用",
	}
	app10 := NodeStaticsInfo{
		Name: "大于10个应用",
	}
	now := time.Now().Unix()
	envMap := make(map[string]map[string]int)
	for _, v := range list {
		zoneMap, ok := envMap[v.Env]
		if !ok {
			zoneMapNew := make(map[string]int)
			zoneMapNew[v.ZoneCode] = 1
			envMap[v.Env] = zoneMapNew
		} else {
			val1, ok1 := zoneMap[v.ZoneCode]
			if ok1 {
				zoneMap[v.ZoneCode] = val1 + 1
			} else {
				zoneMap[v.ZoneCode] = 1
			}
			envMap[v.Env] = zoneMap
		}

		cnt, _ := resource.Resource.CountAppNode(db.AppNode{
			HostName: v.HostName,
			IP:       v.Ip,
		})
		if cnt == 0 {
			app0.Value++
		}
		if cnt == 1 {
			app1.Value++
		}
		if cnt > 1 && cnt <= 5 {
			app2.Value++
		}
		if cnt > 5 && cnt <= 10 {
			app5.Value++
		}
		if cnt > 10 {
			app10.Value++
		}
		if v.AgentType == 0 { // 未部署
			item1.Value++
			continue
		}
		if now-v.AgentHeartbeatTime > 120 {
			item3.Value++
		} else {
			item2.Value++
		}
	}
	resp := RespNodeStatics{
		NodeStatus: make([]NodeStaticsInfo, 0),
		NodeApp:    make([]NodeStaticsInfo, 0),
		DayCnt:     make([]NodeStaticsInfo, 0),
		EnvZone:    make([]NodeStaticsInfo, 0),
	}
	for k, v := range envMap {
		item := NodeStaticsInfo{
			Value: len(v),
			Name:  k,
		}
		resp.EnvZone = append(resp.EnvZone, item)
	}

	for _, v := range dayCnts {
		item := NodeStaticsInfo{
			Value: v.Cnt,
			Name:  v.DayTime,
		}
		resp.DayCnt = append(resp.DayCnt, item)
	}
	resp.NodeStatus = append(resp.NodeStatus, item1, item2, item3)
	resp.NodeApp = append(resp.NodeApp, app0, app1, app2, app5, app10)

	return output.JSON(c, output.MsgOk, "success", resp)
}

// 根据Node数据表聚合数据获取Zone和Env关联列表
func NodeEnvZone(c echo.Context) (err error) {

	return
}
