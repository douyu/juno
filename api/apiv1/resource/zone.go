package resource

import (
	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/labstack/echo/v4"
)

// 可用区信息
func ZoneInfo(c echo.Context) error {
	var (
		err  error
		info db.Zone
	)
	reqModel := ReqZoneInfo{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	info, err = resource.Resource.GetZoneInfo(db.Zone{
		Id:       reqModel.Id,
		ZoneCode: reqModel.ZoneCode,
	})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", info)
}

// ZoneList List of available areas
func ZoneList(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqZoneList{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	list, pagination, err := resource.Resource.GetZoneList(db.Zone{
		Env:        reqModel.Env,
		RegionCode: reqModel.RegionCode,
		RegionName: reqModel.RegionName,
	}, reqModel.CurrentPage, reqModel.PageSize, reqModel.KeywordsType, reqModel.Keywords, "update_time desc,id desc")
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", map[string]interface{}{
		"pagination": pagination,
		"list":       list,
	})
}

// ZonePut The available areas are automatically created, if not created, and updated if there are
func ZonePut(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqZonePut{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	tx := invoker.JunoMysql
	for _, idc := range reqModel.List {
		err = resource.Resource.PutZone(tx, idc)
		if err != nil {
			return output.JSON(c, output.MsgErr, err.Error())
		}
	}

	return output.JSON(c, output.MsgOk, "success")
}

// 只有可用区的创建功能
func ZoneCreate(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqZoneCreate{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	err = resource.Resource.CreateZone(reqModel.Zone, &db.User{})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success")
}

// 只有可用区的更新功能
func ZoneUpdate(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqZoneUpdate{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	err = resource.Resource.UpdateZone(reqModel.Zone, &db.User{})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success")
}

// 只有可用区的删除功能
func ZoneDelete(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqZoneUpdate{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	err = resource.Resource.DeleteZone(reqModel.Zone, &db.User{})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success")
}

// 获取可用区、环境的关联列表
func ZoneEnv(c echo.Context) (err error) {
	resp, err := resource.Resource.ZoneEnv()
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "", resp)
}
