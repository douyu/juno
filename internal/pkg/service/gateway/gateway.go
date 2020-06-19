package gateway

import (
	"github.com/labstack/echo"
	"time"
)

type (
	ProxyItem struct {
		Domain  string
		Host    string
		Scheme  string
		Headers map[string]string
		Timeout time.Duration
	}
)

func getProxyItems() (items []ProxyItem) {
	// 假数据
	items = []ProxyItem{
		{
			Domain: "example.com",
			Host:   "127.0.0.1:3000",
			Scheme: "http",
			Headers: map[string]string{
				"X-WEBAUTH-USER": "admin",
			},
			Timeout: time.Second * 3,
		},
	}

	return
}

//IsDomainToProxy 判断该域名是否在被代理的名单上
func IsDomainToProxy(domain string) bool {
	for _, item := range getProxyItems() {
		if item.Domain == domain {
			return true
		}
	}

	return false
}

//Proxy 走代理
func Proxy(c echo.Context) (err error) {

	return
}
