package proxy

import (
	"errors"
	"net"
	"net/http"
	"net/http/httputil"
	"time"

	"github.com/douyu/jupiter/pkg/conf"

	"github.com/douyu/juno/internal/pkg/packages/roundtrip"
	"github.com/labstack/gommon/log"
	"github.com/urfave/negroni"
)

type proxy struct {
	defaultBackend string
	bufferPool     httputil.BufferPool
}

func NewHttpProxy() http.Handler {
	p := &proxy{
		bufferPool:     NewBufferPool(),
		defaultBackend: conf.GetString("proxy.http.backend"),
	}

	roundTripperFactory := &roundtrip.FactoryImpl{
		Template: &http.Transport{
			Dial:                (&net.Dialer{Timeout: conf.GetDuration("proxy.http.timeout")}).Dial,
			DisableKeepAlives:   conf.GetBool("proxy.http.disableKeepAlives"),
			MaxIdleConns:        conf.GetInt("proxy.http.maxIdleConns"),
			IdleConnTimeout:     90 * time.Second, // setting the value to golang default transport
			MaxIdleConnsPerHost: conf.GetInt("proxy.http.maxIdelPerHost"),
			DisableCompression:  true,
		},
	}

	prt := roundtrip.NewProxyRoundTripper(
		roundTripperFactory,
		http.DefaultTransport,
		conf.GetDuration("proxy.http.timeout"),
	)

	rp := &httputil.ReverseProxy{
		Director:       p.setupProxyRequest,
		Transport:      prt,
		FlushInterval:  50 * time.Millisecond,
		BufferPool:     p.bufferPool,
		ModifyResponse: p.modifyResponse,
	}

	n := negroni.New()
	n.UseHandler(rp)

	return n
}

func (p *proxy) setupProxyRequest(target *http.Request) {
	target.URL.Scheme = "http"
	host := target.Header.Get("X-JUNO-PROXY-HOST")
	if host == "" {
		target.Header.Set("X-JUNO-PROXY-HOST", p.defaultBackend)
	}
}

func (p *proxy) modifyResponse(res *http.Response) error {
	req := res.Request
	if req == nil {
		log.Error("response does not have an attached request")
		return errors.New("response does not have an attached request")
	}

	res.Header.Set("X-JUNO-PROXY", "Powered by juno proxy.")

	return nil
}
