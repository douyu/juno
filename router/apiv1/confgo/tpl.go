package confgo

import (
	"time"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/packages/contrib/output"
	"github.com/douyu/juno/pkg/service/confgo"
	"github.com/labstack/echo/v4"
)

func TplInfo(c echo.Context) error {
	var (
		err  error
		info db.CmcTpl
	)
	type ReqInfo struct {
		Id int `json:"id"`
	}

	reqModel := ReqInfo{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	info, err = confgo.ConfuSrv.GetTpl(reqModel.Id)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", info)
}

// 创建一个配置模板
func TplCreate(c echo.Context) error {
	var err error
	type ReqCreate struct {
		TplType string `json:"tpl_type"`
		Content string `json:"content"`
	}

	req := ReqCreate{}
	err = c.Bind(&req)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	// 创建模板信息
	param := &db.CmcTpl{
		TplType:    req.TplType,
		Content:    req.Content,
		CreateTime: time.Now().Unix(),
		UpdateTime: time.Now().Unix(),
	}

	err = confgo.ConfuSrv.TplCreate(param)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "创建成功", param)
}

// 更新数据
func TplUpdate(c echo.Context) error {
	var (
		err error
	)
	type ReqInfo struct {
		db.CmcTpl
	}
	reqModel := ReqInfo{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	err = confgo.ConfuSrv.UpdateTpl(reqModel.CmcTpl, &db.User{})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

// 删除数据
func TplDelete(c echo.Context) error {
	var (
		err error
	)

	type ReqInfo struct {
		Id int `json:"id"`
	}

	reqModel := ReqInfo{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	err = confgo.ConfuSrv.DeleteTpl(reqModel.Id, &db.User{})
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	return output.JSON(c, output.MsgOk, "success")
}

// 应用列表
func TplList(c echo.Context) error {
	var err error
	reqModel := ReqTplList{}
	err = c.Bind(&reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	list, page, err := confgo.ConfuSrv.GetTplList(reqModel.CmcTpl, reqModel.CurrentPage, reqModel.PageSize, reqModel.KeywordsType, reqModel.Keywords, "update_time desc")
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", map[string]interface{}{
		"pagination": page,
		"list":       list,
	})
}
