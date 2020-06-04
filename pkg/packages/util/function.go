package util

import (
	"reflect"
	"runtime"
	"strings"
)

// FunctionName returns function'name
func FunctionName(i interface{}, seps ...rune) string {
	fn := runtime.FuncForPC(reflect.ValueOf(i).Pointer()).Name()
	fields := strings.FieldsFunc(fn, func(sep rune) bool {
		for _, s := range seps {
			if sep == s {
				return true
			}
		}
		return false
	})
	if size := len(fields); size > 0 {
		return fields[size-1]
	}
	return ""
}
