// Copyright 2020 Douyu
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package errorconst

import (
	"google.golang.org/grpc/codes"
)

type myErrorConst codes.Code

const (
	// ResultOK ..
	ResultOK myErrorConst = 0 //返回成功
	// ParamCannotFindClientProxy ..
	ParamCannotFindClientProxy myErrorConst = 10001
	// ErrTomlFormatStrict ..
	ParamTomlFormatStrict myErrorConst = 10002
	// ErrorNoInstances ..
	ParamNoInstances myErrorConst = 10003
)

// errNameMap 错误名称映射map，维护错误码的同时需维护此map
var errNameMap = map[myErrorConst]string{
	ResultOK:                   "返回成功",
	ParamCannotFindClientProxy: "对应环境.机房没有部署Juno-Proxy服务",
	ParamTomlFormatStrict: "非application block，需要以 [xxx] 开头进行编辑，不能直接输入 key=value",
	ParamNoInstances: "当前条件下没有实例可进行操作",
}

// Code 返回codes.Code类型
func (m myErrorConst) Code() codes.Code {
	return codes.Code(m)
}

// Name 返回错误名称
func (m myErrorConst) Name() (name string) {
	return errNameMap[m]
}
