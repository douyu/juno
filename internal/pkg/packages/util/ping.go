package util

import (
	"net"
	"net/url"
)

// Ping returns if address is invalid
func Ping(addr string) error {
	u, err := url.Parse(addr)
	if err != nil {
		return err
	}

	if u.Port() == "" {
		u.Host = u.Host + ":80"
	}

	_, err = net.Dial("tcp4", u.Host)
	return err
}
