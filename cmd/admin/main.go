package main

import (
	"log"
	"strconv"

	"github.com/douyu/juno/internal/app/adminengine"
	"github.com/douyu/juno/pkg/cfg"
)

func main() {
	app := adminengine.New()
	app.SetGovernor(cfg.Cfg.Server.Govern.Host + ":" + strconv.Itoa(cfg.Cfg.Server.Govern.Port))
	if err := app.Run(); err != nil {
		log.Fatal(err)
	}
}
