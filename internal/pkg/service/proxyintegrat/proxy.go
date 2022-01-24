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
	urlRaw := "http://10.1.56.78:4040"
	url, _ := url.Parse(urlRaw)
	proxyPath = strings.TrimPrefix(proxyPath, "/"+app)

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
	app := "proxy/pyroscope"
	proxyPath := c.Request().URL.Path
	proxy := ReverseProxyGnetReq(proxyPath, app)
	if proxy == nil {
		return
	}
	proxy.Transport = comProxyTransport
	proxy.ServeHTTP(c.Response(), c.Request())
}
