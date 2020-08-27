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

package invoker

import (
	"time"

	"github.com/coreos/etcd/clientv3"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/jupiter/pkg/store/gorm"
	"github.com/douyu/jupiter/pkg/util/xtime"
	"github.com/go-resty/resty/v2"
)

var (
	// JunoMysql mysql instance
	JunoMysql *gorm.DB
	// ConfgoEtcd for configuration
	ConfgoEtcd *clientv3.Client
	// Resty ..
	Resty *resty.Client
)

// Init invoker
func Init() {
	if cfg.Cfg.Database.Enable {
		gormConfig := gorm.DefaultConfig()
		gormConfig.DSN = cfg.Cfg.Database.DSN
		JunoMysql = gormConfig.Build()
		JunoMysql.LogMode(cfg.Cfg.Database.Debug)
	}

	var err error
	if cfg.Cfg.ServerProxy.ConfigEtcd.Enable {
		ConfgoEtcd, err = clientv3.New(clientv3.Config{
			Endpoints:   cfg.Cfg.ServerProxy.ConfigEtcd.Endpoints,
			DialTimeout: 2 * time.Second,
			Username:    cfg.Cfg.ServerProxy.ConfigEtcd.UserName,
			Password:    cfg.Cfg.ServerProxy.ConfigEtcd.Password,
		})
		if err != nil {
			panic(err.Error())
		}
	}
	Resty = resty.New().SetDebug(true).SetHeader("Content-Type", "application/json").SetTimeout(xtime.Duration("20s"))
}
