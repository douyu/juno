package proxyintegrat

import (
	"net"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
)

const commonProxyPrefix = "/proxy"

func Proxy(c echo.Context) (err error) {
	ProxyGnetRequest(c)
	return
}

var comProxyTransport = &http.Transport{
	Proxy: http.ProxyFromEnvironment,
	Dial: (&net.Dialer{
		Timeout:   10 * time.Second,
		KeepAlive: 60 * time.Second,
		DualStack: true,
	}).Dial,
	TLSHandshakeTimeout: 10 * time.Second,
}

//ReverseProxyGnetReq 代理
func ReverseProxyGnetReq(proxyPath, app string) *httputil.ReverseProxy {
	urlRaw, ok := proxyConfigMap[app]
	if !ok {
		return nil
	}
	url, _ := url.Parse(urlRaw.ProxyAddr)
	if urlRaw.IsRewrite > 0 {
		proxyPath = strings.TrimPrefix(proxyPath, commonProxyPrefix+"/"+app)
	}
	director := func(req *http.Request) {
		req.URL.Scheme = url.Scheme
		req.URL.Host = url.Host
		req.Host = url.Host

		req.URL.Path = proxyPath

		// clear cookie headers
		req.Header.Del("Cookie")
		req.Header.Del("Set-Cookie")
		req.Header.Del("Authorization")
	}

	return &httputil.ReverseProxy{Director: director}
}

//ProxyGnetRequest 代理
func ProxyGnetRequest(c echo.Context) {
	app := ""
	proxyPath := c.Request().URL.Path
	pathSplit := strings.Split(proxyPath, ",")
	if len(pathSplit) >= 2 {
		//获取subpath
		app = pathSplit[1]
	}
	proxy := ReverseProxyGnetReq(proxyPath, app)
	if proxy == nil {
		return
	}
	proxy.Transport = comProxyTransport
	proxy.ServeHTTP(c.Response(), c.Request())
}
