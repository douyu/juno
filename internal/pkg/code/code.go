package code

import "errors"

// ErrTomlFormatStrict ..
var ErrTomlFormatStrict = errors.New("非application block，需要以 [xxx] 开头进行编辑，不能直接输入 key=value")
