package main

import (
	"fmt"
	"github.com/douyu/juno/internal/app/adminengine"
	"github.com/douyu/jupiter/pkg/conf"
	"log"
)

func main() {
	app := adminengine.New()
	app.SetGovernor(fmt.Sprintf("0.0.0.0:%d", conf.GetInt("jupiter.server.govern.port")))
	if err := app.Run(); err != nil {
		log.Fatal(err)
	}
}
