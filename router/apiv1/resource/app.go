package resource

import (
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/packages/contrib/output"
	"github.com/douyu/juno/pkg/service/resource"
	"github.com/labstack/echo/v4"
)

// 应用信息
func AppInfo(c echo.Context) error {
	var (
		err      error
		info     db.AppInfo
		identify interface{}
	)
	reqModel := ReqAppInfo{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	if reqModel.Aid > 0 {
		identify = reqModel.Aid
	} else {
		identify = reqModel.AppName
	}

	info, err = resource.Resource.GetApp(identify)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", info)
}

// 应用列表
func AppList(c echo.Context) error {
	var err error
	reqModel := ReqAppList{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	list, page, err := resource.Resource.GetAppList(reqModel.AppInfo, reqModel.CurrentPage, reqModel.PageSize, reqModel.KeywordsType, reqModel.Keywords, reqModel.SearchPort, "update_time desc")
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", map[string]interface{}{
		"pagination": page,
		"list":       list,
	})
}

// 创建数据或者修改数据
func AppPut(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqAppPut{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	// todo 根据header头，识别是谁创建的
	for _, value := range reqModel.List {
		err = resource.Resource.PutApp(value, &db.User{})
		if err != nil {
			return output.JSON(c, output.MsgErr, err.Error())
		}
	}
	return output.JSON(c, output.MsgOk, "success")
}

// 创建数据
func AppCreate(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqAppCreate{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	err = resource.Resource.CreateApp(reqModel.AppInfo, &db.User{})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

// 更新数据
func AppUpdate(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqAppUpdate{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	err = resource.Resource.UpdateApp(reqModel.AppInfo, &db.User{})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

// 删除数据
func AppDelete(c echo.Context) error {
	var (
		err error
	)
	reqModel := ReqAppDelete{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	err = resource.Resource.DeleteApp(reqModel.AppInfo, &db.User{})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}
