package core

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// JSONResult json
type JSONResult struct {
	Code    int         `json:"code"`
	Message string      `json:"msg"`
	Data    interface{} `json:"data"`
}

// Pagination
type Pagination struct {
	Total       int `json:"total"`
	CurrentPage int `json:"current_page"` // current page
}

type HandlerFunc func(c *Context) error

func Handle(next HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := &Context{
			Context: c,
			status:  http.StatusOK,
		}
		return next(ctx)
	}
}

type Context struct {
	echo.Context
	status int
}

//SetStatusCode 设置HTTP响应状态码
func (c *Context) SetStatusCode(status int) {
	c.status = status
}

// Output JSON
func (c *Context) OutputJSON(Code int, message string, data ...interface{}) error {
	result := new(JSONResult)
	result.Code = Code
	result.Message = message

	if len(data) > 0 {
		result.Data = data[0]
	} else {
		result.Data = ""
	}

	return c.JSON(c.status, result)
}
