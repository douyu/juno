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
