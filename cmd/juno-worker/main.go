package main

import (
	"log"

	"github.com/douyu/juno/internal/app/worker"
)

func main() {
	app := worker.New()
	err := app.Run()
	if err != nil {
		log.Fatal(err.Error())
	}
}
