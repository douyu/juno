package main

import (
	"github.com/BurntSushi/toml"
	"github.com/douyu/jupiter/pkg/conf"
	"github.com/douyu/jupiter/pkg/conf/datasource/file"
	"gorm.io/driver/mysql"
	"gorm.io/gen"
	"gorm.io/gorm"
)

// generate code
func main() {

	conf.LoadFromDataSource(file.NewDataSource("./configs/local.toml", false), toml.Unmarshal)
	// specify the output directory (default: "./query")
	// ### if you want to query without context constrain, set mode gen.WithoutContext ###
	g := gen.NewGenerator(gen.Config{
		OutPath: "internal/pkg/mysql/juno/query",
		/* Mode: gen.WithoutContext|gen.WithDefaultQuery*/
		// if you want the nullable field generation property to be pointer type, set FieldNullable true
		/* FieldNullable: true,*/
		// if you want to assign field which has default value in `Create` API, set FieldCoverable true, reference: https://gorm.io/docs/create.html#Default-Values
		/* FieldCoverable: true,*/
		// if you want generate field with unsigned integer type, set FieldSignable true
		FieldSignable: true,
		// if you want to generate index tags from database, set FieldWithIndexTag true
		/* FieldWithIndexTag: true,*/
		// if you want to generate type tags from database, set FieldWithTypeTag true
		/* FieldWithTypeTag: true,*/
		// if you need unit tests for query code, set WithUnitTest true
		/* WithUnitTest: true, */
	})

	// reuse the database connection in Project or create a connection here
	// if you want to use GenerateModel/GenerateModelAs, UseDB is necessary or it will panic
	db, _ := gorm.Open(mysql.Open(conf.GetString("database.dsn")))
	g.UseDB(db)

	// apply basic crud api on structs or table models which is specified by table name with function
	// GenerateModel/GenerateModelAs. And generator will generate table models' code when calling Excute.
	g.ApplyBasic(
		g.GenerateModel(""),
	)

	// execute the action of code generation
	g.Execute()
}
