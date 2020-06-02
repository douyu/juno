package util

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/douyu/jupiter/pkg/conf"
)

func PPP(key string, in interface{}) {
	if strings.HasPrefix(conf.GetString("app.mode"), "prod") {
		return
	}
	d, _ := json.Marshal(in)
	fmt.Println(key, ": ", string(d))
}
