package main

import (
	"github.com/douyu/juno/internal/app/adminengine"
	"log"
)

func main() {
	if err := adminengine.New().Run(); err != nil {
		log.Fatal(err)
	}
}
