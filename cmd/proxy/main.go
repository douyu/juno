//
// @Date: 2020-06-30 21:16:18
// @LastEditors: 杜旻翔
// @LastEditTime: 2020-07-01 17:54:20
// @FilePath: /juno/cmd/proxy/main.go
//

package main

import (
	"log"
	"strconv"

	"github.com/douyu/juno/internal/app/proxyengine"
	"github.com/douyu/juno/pkg/cfg"
)

func main() {
	app := proxyengine.New()
	app.SetGovernor(cfg.Cfg.ServerProxy.GovernServer.Host + ":" + strconv.Itoa(cfg.Cfg.ServerProxy.GovernServer.Port))
	if err := app.Run(); err != nil {
		log.Fatal(err)
	}
}
