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
	"fmt"
	"os"
)

var (
	// AppIP agent ip
	appIP = GetIP()
	// HostName machine hostname
	hostName = GetHostName("")
)

// GetHostName ...
func GetHostName(hostName string) string {
	if host := os.Getenv(hostName); host != "" {
		return host
	}
	name, err := os.Hostname()
	if err != nil {
		return fmt.Sprintf("error:%s", err.Error())
	}
	return name
}

// GetIP ...
func GetIP() string {
	ip, err := IP()
	if err != nil {
		return fmt.Sprintf("ip.error:%s", err.Error())
	}
	return ip
}

func ReturnHostName() string {
	return hostName
}
