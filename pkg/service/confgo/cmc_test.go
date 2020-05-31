package confgo

import (
	"bytes"
	"github.com/davecgh/go-spew/spew"
	"github.com/douyu/juno/pkg/invoker"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/spf13/viper"
	"github.com/stretchr/testify/assert"
	"testing"
)

func init() {
	InitViper()
	invoker.Init()
}

var cfgByte = []byte(`
cookieDomain = "coldlake.cn"
defaultUrl = "http://juno.coldlake.cn"
domain = "http://juno.coldlake.cn"

[app]
  mode = "local"
  name = "confgo-adin"
  token = "123456"

  [app.registry]

    [app.registry.etcd]
      endpoints = ["localhost:2379"]
      timeout = "2s"

[auth]
  administrator = ["肖申","彭友顺","廖瑞杰","徐冰"]

  [auth.proxy]
    token = "123456"

[proxy-host]
  IDC_Code = "http://127.0.0.1:59131"

[jupiter]

  [jupiter.mysql]

    [jupiter.mysql.juno]
      connMaxLifetime = "300s"
      debug = true
      dsn = "root:root@tcp(127.0.0.1:3306)/juno?charset=utf8&parseTime=True&loc=Local&readTimeout=1s&timeout=1s&writeTimeout=3s"
      level = "panic"
      maxIdleConns = 50
      maxOpenConns = 100

[server]

  [server.govern]
    port = 35329

  [server.grpc]
    port = 59218

  [server.http]
    port = 59219
`)

func InitViper() {
	rBytes := bytes.NewReader(cfgByte)
	viper.SetConfigType("toml")
	err := viper.ReadConfig(rBytes)
	if err != nil {
		panic("test")
	}
	viper.Debug()
}

func TestParseTpl1(t *testing.T) {
	parseTpl := `{
		"addr":"{{ADDR}}",
		"user":"{{USERNAME}}",
		"password":"{{PASSWORD}}"
	}`

	obj := InitCmcTpl(invoker.JunoMysql, view.RespOneConfig{})
	err := obj.ParseTpl(parseTpl)
	assert.Nil(t, err)
	spew.Dump(obj)

}

func TestParseConfig(t *testing.T) {
	config := `
		[mysqlconfig]
			addr = "127.0.0.1:3306"
			user = "hello"
			password = "world"
			junotpl = 1
	`

	_, err := ParseConfig(invoker.JunoMysql, view.RespOneConfig{
		Content: config,
		Format:  "toml",
	})
	assert.Nil(t, err)
}
