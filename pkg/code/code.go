package code

import (
	"errors"
	"fmt"
)

var (
	// ErrTomlFormatStrict ..
	ErrTomlFormatStrict = errors.New("非application block，需要以 [xxx] 开头进行编辑，不能直接输入 key=value")
	// ErrorNoInstances ..
	ErrorNoInstances error = fmt.Errorf("当前条件下没有实例可进行操作")
)
