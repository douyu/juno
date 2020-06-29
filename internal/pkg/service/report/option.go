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

package report

import (
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/jupiter/pkg/xlog"
)

// Build new a instance
func Build() *Report {
	report := &Report{
		config:   cfg.Cfg.Proxy.HeartBeat,
		Reporter: NewHTTPReport(cfg.Cfg.Proxy.HeartBeat),
	}
	if cfg.Cfg.Proxy.HeartBeat.Enable {
		xlog.Info("plugin", xlog.String("reportAgentStatus", "start"))
	}
	return report
}
