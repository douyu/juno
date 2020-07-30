package http

import (
	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/httptest"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/model/view"
)

func CreateCollection(c *core.Context) error {
	var param view.CreateHttpTestCollection

	err := c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	collection, err := httptest.CreateCollection(uint(user.GetUser(c).Uid), param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(collection))
}

func CollectionList(c *core.Context) error {
	var param view.ListHttpCollection

	err := c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	collections, err := httptest.ListCollection(uint(user.GetUser(c).Uid), param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success", c.WithData(collections))
}

func DeleteCollection(c *core.Context) error {
	var param view.QueryHttpTestCollection

	err := c.Bind(&param)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	err = httptest.DeleteCollection(uint(user.GetUser(c).Uid), param.CollectionID)
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "success")
}
