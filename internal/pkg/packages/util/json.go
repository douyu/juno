package util

import "encoding/json"

func JsonString(obj interface{}) string {
	aa, _ := json.Marshal(obj)
	return string(aa)
}
