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

package adminengine

import (
	"fmt"
	"os"

	"github.com/douyu/juno/internal/pkg/install"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view/logstore"
	"github.com/douyu/juno/pkg/model/view/vproxyintegrat"
	"github.com/douyu/juno/pkg/util"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

func (eng *Admin) migrateDB() error {
	gormdb, err := gorm.Open(
		mysql.Open(cfg.Cfg.Database.DSN),
		&gorm.Config{
			NamingStrategy: schema.NamingStrategy{
				SingularTable: true,
			},
		},
	)
	if err != nil {
		return err
	}

	eng.cmdClear(gormdb)
	eng.cmdInstall(gormdb)
	return nil
}

func (eng *Admin) cmdClear(gormdb *gorm.DB) {
	if eng.clearFlag {
		dsn, err := util.ParseDSN(cfg.Cfg.Database.DSN)
		if err != nil {
			panic("dsn parse error: " + err.Error())
		}
		var result []struct {
			Sqlstr string
		}
		gormdb.Raw("SELECT concat('DROP TABLE IF EXISTS `', table_name, '`;') as sqlstr FROM information_schema.tables WHERE table_schema = '" + dsn.DBName + "'").Scan(&result)
		for _, v := range result {
			fmt.Println(`sql drop:`, v.Sqlstr)
			gormdb.Exec(v.Sqlstr)
		}

	}
}

func (eng *Admin) cmdInstall(gormdb *gorm.DB) {
	if eng.installFlag {
		models := []interface{}{
			&db.AppInfo{},
			&db.AppChangeMap{},
			&db.AppTopology{},
			&db.AppEvent{},
			&db.AppLog{},
			&db.AppNode{},
			&db.Node{},
			&db.AppNodeMap{},
			&db.AppPackage{},
			&db.AppStatics{},
			&db.AppUserRelation{},
			&db.AppViewHistory{},
			&db.Board{},
			&db.BoardAuth{},
			&db.CmcTpl{},
			&db.Zone{},
			&db.OpsSupervisorConfig{},
			&db.PProf{},
			&db.ToolInfo{},
			&db.User{},
			&db.UserRelation{},
			&db.Option{},
			&db.SystemConfig{},
			&db.Configuration{},
			&db.ConfigurationPublish{},
			&db.ConfigurationHistory{},
			&db.ConfigurationStatus{},
			&db.ConfigurationResourceRelation{},
			&db.ConfigResource{},
			&db.ConfigResourceTag{},
			&db.ConfigResourceValue{},
			&db.CasbinPolicyAuth{},
			&db.CasbinPolicyGroup{},
			&db.AccessToken{},
			&db.GrpcTestCase{},
			&db.GrpcTestLog{},
			&db.GrpcProto{},
			&db.GrpcProtoService{},
			&db.GrpcServiceMethod{},
			&db.HttpTestLog{},
			&db.HttpTestCase{},
			&db.HttpTestCollection{},
			&db.TestPipeline{},
			&db.TestPipelineTask{},
			&db.TestPipelineStepStatus{},
			&db.WorkerNode{},
			&db.CronJob{},
			&db.CronTask{},
			&db.CronJobTimer{},
			&db.K8sPod{},
			&db.ConfigurationClusterStatus{},
			&db.UserConfig{},
			&db.UserVisit{},
			&vproxyintegrat.ProxyMenu{},
			&vproxyintegrat.ProxyManage{},
			&logstore.LogStore{},
		}
		gormdb = gormdb.Debug()
		gormdb.Set("gorm:table_options", "ENGINE=InnoDB").AutoMigrate(models...)
		// gormdb.Model(&db.AccessToken{}).AddUniqueIndex("idx_unique_name", "name")
		fmt.Println("create table ok")
	}
}

func (eng *Admin) cmdMock() error {
	if eng.mockFlag {
		install.MockData()
	}

	if !eng.runFlag {
		os.Exit(0)
	}
	return nil
}
