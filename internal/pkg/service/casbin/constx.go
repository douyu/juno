package casbin

import (
	"fmt"
)

const (
	GroupTypeUser = "user"
	GroupTypeApp  = "app"
	GroupTypeURL  = "url"
)

func CasbinGroupKey(gType string, name string) (key string) {
	return fmt.Sprintf("group_%s:%s", gType, name)
}

func CasbinAppObjKey(appName, appEnv string) string {
	return fmt.Sprintf("%s:%s", appName, appEnv)
}
