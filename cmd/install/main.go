package main

import (
	"fmt"

	"github.com/douyu/juno/cmd/install/mock"
	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/service"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter"
	"github.com/douyu/jupiter/pkg/flag"
	"github.com/douyu/jupiter/pkg/xlog"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
)

// Admin indicates the user is a system administrator.
type Admin struct {
	jupiter.Application
}

var (
	mockFlag    bool
	clearFlag   bool
	installFlag bool
	// todo config
	dbName = "juno"
)

func main() {
	flag.Register(&flag.BoolFlag{
		Name:    "mock",
		Usage:   "--mock",
		EnvVar:  "Juno_Mock",
		Default: false,
		Action:  func(name string, fs *flag.FlagSet) {},
	})

	flag.Register(&flag.BoolFlag{
		Name:    "clear",
		Usage:   "--clear",
		EnvVar:  "Juno_Clear",
		Default: false,
		Action:  func(name string, fs *flag.FlagSet) {},
	})

	eng := &Admin{}
	_ = eng.Startup(
		eng.initConfig,
		eng.initInvoker,
		eng.migrateDB,
	)
	//if err != nil {
	//	xlog.Error("start up error", zap.Error(err))
	//}

}

func (eng *Admin) initConfig() (err error) {
	cfg.InitCfg()
	xlog.DefaultLogger = xlog.StdConfig("default").Build()
	return
}

func (eng *Admin) initInvoker() error {
	invoker.Init()
	service.Init()
	return nil
}

// func migrateDB(cli *cli.Context) error {
func (*Admin) migrateDB() error {
	mockFlag = flag.Bool("mock")
	clearFlag = flag.Bool("clear")

	gormdb, err := gorm.Open(
		"mysql",
		cfg.Cfg.Database.DSN,
	)
	if err != nil {
		return err
	}

	defer func() {
		_ = gormdb.Close()
	}()

	if !mockFlag && !clearFlag {
		installFlag = true
	}
	cmdClear(gormdb)
	cmdInstall(gormdb)
	cmdMock()
	return nil
}

func cmdClear(gormdb *gorm.DB) {
	if clearFlag {
		var result []struct {
			Sqlstr string
		}
		gormdb.Raw("SELECT concat('DROP TABLE IF EXISTS `', table_name, '`;') as sqlstr FROM information_schema.tables WHERE table_schema = '" + dbName + "'").Scan(&result)
		for _, v := range result {
			fmt.Println(`sql drop:`, v.Sqlstr)
			gormdb.Exec(v.Sqlstr)
		}

	}
}

func cmdInstall(gormdb *gorm.DB) {
	if installFlag {
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
			&db.CmcApp{},
			&db.CmcAppLog{},
			&db.CmcHistory{},
			&db.CmcHistoryItem{},
			&db.CmcConfig{},
			&db.CmcConfigLog{},
			&db.CmcResource{},
			&db.CmcPublishLog{},
			&db.CmcUseStatus{},
			&db.CmcTpl{},
			&db.Zone{},
			&db.IdcSrv{},
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
		}
		gormdb.SingularTable(true)
		gormdb.Set("gorm:table_options", "ENGINE=InnoDB").AutoMigrate(models...)
		mock.MustMockData()
		fmt.Println("create table ok")
	}
}

func cmdMock() {
	if mockFlag {
		mock.MockData()
	}
}
