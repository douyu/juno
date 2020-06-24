package main

import (
	"fmt"

	"github.com/douyu/juno/cmd/install/mock"
	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/service"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter"
	"github.com/douyu/jupiter/pkg/flag"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	"github.com/spf13/viper"
	"github.com/urfave/cli/v2"
)

// Admin indicates the user is a system administrator.
type Admin struct {
	jupiter.Application
}

func main() {
	flag.Register(&flag.StringFlag{Name: "config"})

	err := flag.Parse()
	if err != nil {
		panic(err)
	}

	viper.SetConfigFile(flag.String("config"))
	err = viper.ReadInConfig()
	if err != nil {
		panic(err)
	}

	eng := &Admin{}
	_ = eng.Startup(
		eng.initInvoker,
	)

	migrateDB()

}

// func migrateDB(cli *cli.Context) error {
func migrateDB() error {
	var dbName = "juno"
	gormdb, err := gorm.Open(
		"mysql",
		viper.GetString("jupiter.mysql.juno.dsn"),
	)
	if err != nil {
		return err
	}

	var result []struct {
		Sqlstr string
	}
	gormdb.Raw("SELECT concat('DROP TABLE IF EXISTS `', table_name, '`;') as sqlstr FROM information_schema.tables WHERE table_schema = '" + dbName + "'").Scan(&result)
	for _, v := range result {
		fmt.Println(`sql drop:`, v.Sqlstr)
		gormdb.Exec(v.Sqlstr)
	}

	defer func() {
		_ = gormdb.Close()
	}()

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
		&db.ConfigurationHistory{},
	}
	gormdb.DropTableIfExists(models...)

	// 删除原来的表
	gormdb.SingularTable(true)
	gormdb.Set("gorm:table_options", "ENGINE=InnoDB").AutoMigrate(models...)
	fmt.Println("create table ok")
	mock.MockData()
	return nil
}

func migrateETCD(cli *cli.Context) error {
	panic("not implement")
}

func (eng *Admin) initInvoker() error {
	invoker.Init()
	service.Init()
	return nil
}
