package util

import (
	"errors"
	"net"
)

func ExternalIPString() string {
	ip, err := ExternalIP()
	if err != nil {
		return "127.0.0.1"
	}

	return ip.String()
}

func ExternalIP() (net.IP, error) {
	interfaces, err := net.Interfaces()
	if err != nil {
		return nil, err
	}

	for _, iface := range interfaces {
		if iface.Flags&net.FlagUp == 0 {
			continue
		}
		if iface.Flags&net.FlagLoopback != 0 {
			continue
		}
		address, err := iface.Addrs()
		if err != nil {
			return nil, err
		}
		for _, addr := range address {
			ip := getIpFromAddr(addr)
			if ip == nil {
				continue
			}
			return ip, nil
		}
	}

	return nil, errors.New("connected to the network error")
}

func getIpFromAddr(addr net.Addr) net.IP {
	var ip net.IP
	switch v := addr.(type) {
	case *net.IPNet:
		ip = v.IP
	case *net.IPAddr:
		ip = v.IP
	}
	if ip == nil || ip.IsLoopback() {
		return nil
	}
	ip = ip.To4()
	if ip == nil {
		return nil
	}
	return ip
}
