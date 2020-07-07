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
	"fmt"

	"google.golang.org/grpc/codes"
)

type myErrorConst codes.Code

const (
	// ResultOK ..
	ResultOK myErrorConst = 0 //返回成功
	// CannotFindClientETCD ..
	CannotFindClientETCD myErrorConst = 10001
	// ParamConfigNotExists ..
	ParamConfigNotExists myErrorConst = 10002
	// ParamNoInstances ..
	ParamNoInstances myErrorConst = 10003
	// ParamConfigCallbackKvIsZero ..
	ParamConfigCallbackKvIsZero myErrorConst = 10004
	// JunoAgentQueryOverSize ..
	JunoAgentQueryOverSize myErrorConst = 10005
	// ConfigResourceValueNotExist ..
	ConfigResourceValueNotExist myErrorConst = 10006
	// CannotFindClientHTTP ..
	CannotFindClientHTTP myErrorConst = 10007
)

// errNameMap 错误名称映射map，维护错误码的同时需维护此map
var errNameMap = map[myErrorConst]string{
	ResultOK:                    "返回成功",
	CannotFindClientETCD:        "对应环境的机房中没有部署Juno-Proxy（ETCD）服务",
	CannotFindClientHTTP:        "对应环境的机房中没有部署Juno-Proxy（HTTP）服务",
	ParamConfigNotExists:        "配置不存在",
	ParamNoInstances:            "实例不存在",
	ParamConfigCallbackKvIsZero: "配置发布同步状态回调数据为空",
	JunoAgentQueryOverSize:      "请求的Agent超过400的数量限制",
	ConfigResourceValueNotExist: "配置资源对应值不存在",
}

// Code 返回codes.Code类型
func (m myErrorConst) Code() codes.Code {
	return codes.Code(m)
}

// Name 返回错误名称
func (m myErrorConst) Name() (name string) {
	return errNameMap[m]
}

func (m myErrorConst) Error() error {
	return fmt.Errorf(m.Code().String() + m.Name())
}
