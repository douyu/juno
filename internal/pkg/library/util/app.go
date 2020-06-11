package util

import (
	"strings"
)

func ParseHttpAddr(addr string) string {
	if strings.HasPrefix(addr, "https://") {
		return strings.TrimPrefix(addr, "https://")
	} else if strings.HasPrefix(addr, "http://") {
		return strings.TrimPrefix(addr, "http://")
	}
	return addr
}
