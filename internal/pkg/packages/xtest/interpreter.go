package xtest

import (
	"context"
	"time"
)

type (
	Interpreter interface {
		// 设置
		Execute(context context.Context, script TestScript, handler APICallFunc) (result TestResult)

		// 注册脚本函数
		RegisterFunc(name string, f interface{}) error
	}

	// 接口调用函数回调，用于调用API并设置返回值等，在 Pre-Script 执行完之后调用
	// 如果接口调用失败，返回Error
	// data 必须是一个可以被 JSON marshall 的数据，比如 struct 、map 等
	APICallFunc func() (data Response, err error)

	// 测试脚本
	TestScript struct {
		Source string
	}

	// 接口响应值
	Response interface{}

	TestResult struct {
		Logs        map[string]string
		TimeCost    time.Duration
		Error       error
		Success     bool
		RawResponse interface{}
	}
)
