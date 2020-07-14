package main

import (
	"log"

	"github.com/douyu/juno/internal/app/adminengine"
)

func main() {
	if err := adminengine.New().Run(); err != nil {
		log.Fatal(err)
	}
}
