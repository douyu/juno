package core

import (
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
	Total       int `json:"total"`
	CurrentPage int `json:"current_page"` // current page
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
