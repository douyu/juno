package main

import (
	"github.com/douyu/juno/internal/app/proxyengine"
	"github.com/douyu/juno/pkg/cfg"
	"log"
	"strconv"
)

func main() {
	app := proxyengine.New()
	app.SetGovernor(cfg.Cfg.Proxy.GovernServer.Host + ":" + strconv.Itoa(cfg.Cfg.Proxy.GovernServer.Port))
	if err := app.Run(); err != nil {
		log.Fatal(err)
	}
}
