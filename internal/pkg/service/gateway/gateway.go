package gateway

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"net/http/httputil"
	"sync"
	"time"

	"github.com/douyu/juno/internal/pkg/model/view"
	"github.com/douyu/juno/internal/pkg/service/system"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
)

var (
	proxyItems    map[string]view.SettingGatewayItem // domain -> ProxyItem
	proxyItemsMtx sync.RWMutex
)

func Init() {
	proxyItems = make(map[string]view.SettingGatewayItem)

	system.System.Setting.Subscribe(view.GatewaySettingName, func(content string) {
		settings := make(view.SettingGateway, 0)
		err := json.Unmarshal([]byte(content), &settings)
		if err != nil {
			log.Error("invalid gateway setting:" + err.Error())
			return
		}

		proxyItemsMtx.Lock()
		defer proxyItemsMtx.Unlock()
		for _, item := range settings {
			proxyItems[item.Domain] = item
		}
	})
}

//IsDomainToProxy 判断该域名是否在被代理的名单上
func IsDomainToProxy(domain string) bool {
	_, ok := proxyItems[domain]

	return ok
}

func getProxyConfig(domain string) (item view.SettingGatewayItem, ok bool) {
	item, ok = proxyItems[domain]
	return
}

//Proxy 走代理
func Proxy(c echo.Context) (err error) {
	proxyConfig, ok := getProxyConfig(c.Request().Host)
	if !ok {
		return fmt.Errorf("网关配置不存在")
	}

	tp := http.Transport{
		Proxy: http.ProxyFromEnvironment,
		DialContext: (&net.Dialer{
			Timeout:   time.Duration(proxyConfig.Timeout) * time.Second,
			KeepAlive: 60 * time.Second,
		}).DialContext,
		MaxIdleConns:          100,
		IdleConnTimeout:       90 * time.Second,
		TLSHandshakeTimeout:   10 * time.Second,
		ExpectContinueTimeout: 1 * time.Second,
	}

	revereProxy := httputil.ReverseProxy{
		Transport: &tp,
		Director: func(r *http.Request) {
			r.Host = proxyConfig.Host
			r.URL.Host = proxyConfig.Host
			r.URL.Scheme = proxyConfig.Scheme

			for _, h := range proxyConfig.Headers {
				r.Header[h.Name] = []string{h.Value}
			}
		},
		ErrorHandler: func(writer http.ResponseWriter, request *http.Request, e error) {
			err = e
		},
	}
	revereProxy.ServeHTTP(c.Response(), c.Request())

	return
}
