//
// @Date: 2020-06-30 21:16:18
// @LastEditors: 杜旻翔
// @LastEditTime: 2020-07-01 17:54:20
// @FilePath: /juno/cmd/proxy/main.go
//

package main

import (
	"github.com/douyu/juno/internal/app/proxyengine"
	"log"
)

func main() {
	if err := proxyengine.New().Run(); err != nil {
		log.Fatal(err)
	}
}
