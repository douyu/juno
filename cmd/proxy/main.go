package main

import (
	"fmt"
	"log"

	"github.com/douyu/juno/internal/app/proxyengine"
	"github.com/douyu/jupiter/pkg/conf"
)

func main() {
	app := proxyengine.New()
	app.SetGovernor(fmt.Sprintf("0.0.0.0:%d", conf.GetInt("jupiter.server.govern.port")))
	if err := app.Run(); err != nil {
		log.Fatal(err)
	}
}
