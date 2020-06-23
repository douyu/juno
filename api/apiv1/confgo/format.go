package confgo

import (
	"bytes"
	"fmt"

	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/codec"
	"github.com/douyu/juno/internal/pkg/service/confgo"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/labstack/echo/v4"
)

// ListAppConfigChanges Configuration change list
func ListAppConfigChanges(c echo.Context) error {
	reqModel := struct {
		Page  int `json:"page"`
		Limit int `json:"limit"`
		db.CmcConfigLog
	}{}
	if err := c.Bind(&reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	caid, page, limit := reqModel.Caid, reqModel.Page, reqModel.Limit
	if reqModel.Caid == 0 {
		return output.JSON(c, output.MsgErr, "require caid")
	}
	if page == 0 {
		page = 1
	}
	if limit == 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	result, err := confgo.ConfuSrv.ChangeList(caid, page, limit)
	if err != nil {
		return output.JSON(c, output.MsgErr, "query err "+err.Error())
	}
	return output.JSON(c, output.MsgOk, "", result)
}

// TomlFormat ...
func TomlFormat(c echo.Context) error {
	reqModel := new(struct {
		Content string `json:"content" form:"content"`
	})
	if err := c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	if reqModel.Content == "" {
		return output.JSON(c, output.MsgErr, "content参数错误")
	}
	items, err := codec.DecodeToml(reqModel.Content, true)
	if err != nil {
		return output.JSON(c, output.MsgErr, fmt.Sprintf("toml解码失败:"+err.Error()))
	}
	w := bytes.NewBuffer([]byte{})
	if err := codec.Encode(w, items, true); err != nil {
		return output.JSON(c, output.MsgErr, fmt.Sprintf("toml编码失败:"+err.Error()))
	}
	return output.JSON(c, output.MsgOk, "", w.String())
}

func mergeGlobalConfig(gloablVal string, val string) string {
	return fmt.Sprintf("%s\n%s\n", val, gloablVal)
}
