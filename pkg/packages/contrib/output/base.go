package output

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

// JSON 渲染
func JSON(c echo.Context, Code int, message string, data ...interface{}) error {
	result := new(JSONResult)
	result.Code = Code
	result.Message = message

	if len(data) > 0 {
		result.Data = data[0]
	} else {
		result.Data = ""
	}
	return c.JSON(http.StatusOK, result)
}

func WithData(data interface{}) JSONResult {
	return JSONResult{
		Code:    0,
		Message: "Ok",
		Data:    data,
	}
}
