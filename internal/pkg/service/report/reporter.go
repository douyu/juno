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
	"encoding/json"
	"time"

	"github.com/douyu/juno/internal/pkg/service/proxy"
	"github.com/douyu/juno/pb"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/constx"
	"github.com/douyu/jupiter/pkg/xlog"
)

// ReporterResp ...
type ReporterResp struct {
	Err  int
	Msg  string
	Data interface{}
}

// Reporter interface
type Reporter interface {
	Report(interface{}) ReporterResp
}

// Report ...
type Report struct {
	config cfg.HeartBeat
	Reporter
}

// AgentReportRequest agent status
type AgentReportRequest struct {
	Hostname     string `json:"hostname"`
	IP           string `json:"ip"`
	AgentVersion string `json:"agent_version"`
	RegionCode   string `json:"region_code"`
	RegionName   string `json:"region_name"`
	ZoneCode     string `json:"zone_code"`
	ZoneName     string `json:"zone_name"`
	Env          string `json:"env"`
	AgentType    int    `json:"agent_type"`
}

// ReportAgentStatus report agent status
func (r *Report) ReportAgentStatus() error {
	if !r.config.Enable {
		return nil
	}

	req := AgentReportRequest{
		Hostname:     r.config.HostName,
		IP:           appIP,
		AgentVersion: "0.1",
		AgentType:    2,
		RegionCode:   r.config.RegionCode,
		RegionName:   r.config.RegionName,
		ZoneCode:     r.config.ZoneCode,
		ZoneName:     r.config.ZoneName,
		Env:          r.config.Env,
	}

	go func() {
		for {
			if r.config.Addr == "stream" {
				if proxy.StreamStore.IsStreamExist() {
					msgByte, _ := json.Marshal(req)
					_ = proxy.StreamStore.GetStream().Send(&pb.NotifyResp{
						MsgId: constx.MsgNodeHeartBeatResp,
						Msg:   msgByte,
					})
				}
			} else {
				response := r.Reporter.Report(req)
				xlog.Debug("report info", xlog.Any("response", response))
			}
			time.Sleep(time.Duration(r.config.Internal))
		}
	}()
	return nil
}
