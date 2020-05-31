package main

import (
	"fmt"
	"github.com/douyu/jupiter/pkg/conf"
	"log"

	clientProxy "github.com/douyu/juno/pkg/service/proxy"
	"github.com/douyu/juno/router"
	"github.com/douyu/jupiter/pkg/flag"
)

func main() {
	if flag.String("mode") == "proxy" {
		app := clientProxy.New()
		app.SetGovernor(fmt.Sprintf("0.0.0.0:%d", conf.GetInt("jupiter.server.govern.port")))
		if err := app.Run(); err != nil {
			log.Fatal(err)
		}
	} else {
		app := router.New()
		app.SetGovernor(fmt.Sprintf("0.0.0.0:%d", conf.GetInt("jupiter.server.govern.port")))
		if err := app.Run(); err != nil {
			log.Fatal(err)
		}
	}
}
