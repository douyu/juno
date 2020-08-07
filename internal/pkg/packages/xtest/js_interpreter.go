package xtest

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/robertkrimen/otto"
)

var (
	ErrTimeout       error = errors.New("js runtime execute timeout")
	ErrInvalidReturn error = errors.New("test.onResponse returns a invalid type")
)

type (
	JSInterpreter struct {
		vm         *otto.Otto
		runtimeLog map[string]string
		store      *GlobalStore
	}
)

func NewJSInterpreter(gs *GlobalStore) *JSInterpreter {
	jsi := &JSInterpreter{
		vm:    otto.New(),
		store: gs,
	}

	jsi.vm.Interrupt = make(chan func(), 1)

	jsi.init()

	return jsi
}

func (j *JSInterpreter) init() {
	testObj, _ := j.vm.Object(`({
		preRequest: function() {},
		onResponse: function() {}
	})`)
	_ = testObj.Set("log", func(tag, val string) {
		j.runtimeLog[tag] = val
	})

	// 设置全局共享数据
	_ = testObj.Set("setData", func(key string, val otto.Value) {
		if j.store != nil {
			j.store.Set(key, val)
		}
	})

	// 获取全局数据
	_ = testObj.Set("getData", func(key string) (val otto.Value) {
		val = otto.NullValue()
		if j.store != nil {
			data := j.store.Get(key)
			if data != nil {
				if jsVal, ok := data.(otto.Value); ok {
					val = jsVal
				}
			}
		}

		return
	})

	_ = j.vm.Set("test", testObj)
}

func (j *JSInterpreter) Execute(ctx context.Context, script TestScript, handler APICallFunc) (result TestResult) {
	var err error = nil
	timeStart := time.Now()
	result.Success = false

	defer func() {
		result.TimeCost = time.Now().Sub(timeStart)
		result.Logs = j.runtimeLog

		if err != nil {
			result.Error = err
			result.Success = false
		}
	}()

	j.runtimeLog = make(map[string]string)

	// 加载脚本
	err = j.runWithContext(ctx, script.Source)
	if err != nil {
		return
	}

	// 执行Pre-Script
	err = j.callPreRequest(ctx)
	if err != nil {
		err = errors.New("Failed when execute test.PreRequest:" + err.Error())
		return
	}

	// 调接口
	responseData, err := handler()
	result.RawResponse = responseData
	if err != nil {
		err = errors.New("Failed when execute invoke API:" + err.Error())
		return
	}

	// 执行onResponse回调
	success, err := j.callOnResponse(ctx, responseData)
	if err != nil {
		err = errors.New("Failed when execute test.OnResponse:" + err.Error())
		return
	}

	result.Success = success

	return
}

func (j *JSInterpreter) RegisterFunc(name string, f interface{}) error {
	testObj, _ := j.vm.Get("test")
	return testObj.Object().Set(name, f)
}

func (j *JSInterpreter) Set(name string, value interface{}) error {
	return j.vm.Set(name, value)
}

func (j *JSInterpreter) runWithContext(ctx context.Context, sourceCode string) (err error) {
	defer func() {
		if e := recover(); e != nil {
			if e == ErrTimeout {
				err = ErrTimeout
				return
			}

			//panic(e)
		}
	}()

	doneChan := make(chan struct{})
	go func() {
		defer func() {
			doneChan <- struct{}{}
		}()

		_, err = j.vm.Run(sourceCode)
	}()

	select {
	case <-ctx.Done():
		err = ErrTimeout
		j.vm.Interrupt <- func() {
			//panic(ErrTimeout)
		}
	case <-doneChan:
		// done
	}

	return
}

func (j *JSInterpreter) callWithContext(ctx context.Context, source string, this interface{}, args ...interface{}) (value otto.Value, err error) {
	defer func() {
		if e := recover(); e != nil {
			if e == ErrTimeout {
				err = ErrTimeout
				return
			}

			panic(e)
		}
	}()

	doneChan := make(chan struct{})
	go func() {
		defer func() {
			doneChan <- struct{}{}
		}()

		value, err = j.vm.Call(source, this, args...)
	}()

	select {
	case <-ctx.Done():
		j.vm.Interrupt <- func() {
			panic(ErrTimeout)
		}
	case <-doneChan:
		// done
	}

	return
}

func (j *JSInterpreter) callPreRequest(ctx context.Context) (err error) {
	_, err = j.callWithContext(ctx, "test.preRequest", nil)
	return
}

func (j *JSInterpreter) callOnResponse(ctx context.Context, data Response) (success bool, err error) {
	var dataJSObj interface{}
	{
		var dataJson []byte

		if data == nil {
			data = struct{}{}
		}

		dataJson, err = json.Marshal(&data)
		if err != nil {
			return
		}

		dataJSObj, err = j.vm.Object("(" + string(dataJson) + ")")
		if err != nil {
			return
		}
	}

	value, err := j.callWithContext(ctx, "test.onResponse", nil, dataJSObj)
	if err != nil {
		return
	}

	// 如果是Undefined，意味着脚本没有返回值，那么测试OK
	if value.IsUndefined() || value.IsNull() {
		success = true
		return
	}

	if !value.IsBoolean() {
		success = false
		err = ErrInvalidReturn
		return
	}

	success, _ = value.ToBoolean()

	return
}
