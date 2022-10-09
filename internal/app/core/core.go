package core

import (
	"fmt"
	"strconv"

	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/labstack/echo/v4"
)

// JSONResult json
type JSONResult struct {
	Status int `json:"-"`

	Code    int         `json:"code"`
	Message string      `json:"msg"`
	Data    interface{} `json:"data,omitempty"`
}

// Pagination
type Pagination struct {
	Total   int64 `json:"total"`   // total: 全部记录条数 和 antd 参数一致
	Current int   `json:"current"` // current：当前页数，和 antd 翻页参数一致
}

type HandlerFunc func(c *Context) error

type JSONOption func(res *JSONResult)

func Handle(next HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := &Context{
			Context: c,
		}
		return next(ctx)
	}
}

type Context struct {
	echo.Context
}

func (c *Context) Bind(i interface{}) error {
	err := c.Context.Bind(i)
	if err != nil {
		return err
	}

	// refer to https://github.com/go-playground/validator
	err = c.Validate(i)
	if err != nil {
		return err
	}

	return nil
}

//QueryInt get int param from query
func (c *Context) QueryInt(key string) (val int, err error) {
	str := c.QueryParam(key)
	val, err = strconv.Atoi(str)
	return
}

//QueryUint get uint from query. if query[key] < 0, return error.
func (c *Context) QueryUint(key string) (val uint, err error) {
	intVal, err := c.QueryInt(key)
	if err != nil {
		return
	}

	if intVal < 0 {
		err = fmt.Errorf("invalid param %s (must >= 0)", key)
		return
	}

	val = uint(intVal)
	return
}

func (c *Context) GetUser() *db.User {
	return user.GetUser(c)
}

// Output JSON
//
// Example:
// 		c.OutputJSON(0, "success", c.WithStatusCode(http.StatusOK), c.WithData("hello,world"))
func (c *Context) OutputJSON(Code int, message string, options ...JSONOption) error {
	result := new(JSONResult)
	result.Code = Code
	result.Message = message

	for _, opt := range options {
		opt(result)
	}

	return c.JSON(result.Status, result)
}

func (c *Context) Success(options ...JSONOption) error {
	return c.OutputJSON(output.MsgOk, "success", options...)
}

//WithStatusCode set http status code
func (c *Context) WithStatusCode(status int) JSONOption {
	return func(res *JSONResult) {
		res.Status = status
	}
}

//WithData set "data" field
func (c *Context) WithData(data interface{}) JSONOption {
	return func(res *JSONResult) {
		res.Data = data
	}
}
