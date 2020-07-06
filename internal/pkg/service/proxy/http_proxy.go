package proxy

import (
	"errors"
	"net"
	"net/http"
	"net/http/httputil"
	"time"

	"github.com/douyu/juno/internal/pkg/packages/roundtrip"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/labstack/gommon/log"
	"github.com/urfave/negroni"
)

type proxy struct {
	defaultBackend string
	bufferPool     httputil.BufferPool
}

// NewHTTPProxy ..
func NewHTTPProxy() http.Handler {
	p := &proxy{
		bufferPool:     NewBufferPool(),
		defaultBackend: cfg.Cfg.ServerProxy.Prometheus.Backend,
	}

	roundTripperFactory := &roundtrip.FactoryImpl{
		Template: &http.Transport{
			Dial:                (&net.Dialer{Timeout: time.Duration(cfg.Cfg.ServerProxy.Prometheus.Timeout) * time.Second}).Dial,
			DisableKeepAlives:   cfg.Cfg.ServerProxy.Prometheus.DisableKeepAlives,
			MaxIdleConns:        cfg.Cfg.ServerProxy.Prometheus.MaxIdleConns,
			IdleConnTimeout:     90 * time.Second, // setting the value to golang default transport
			MaxIdleConnsPerHost: cfg.Cfg.ServerProxy.Prometheus.MaxIdelPerHost,
			DisableCompression:  true,
		},
	}

	prt := roundtrip.NewProxyRoundTripper(
		roundTripperFactory,
		http.DefaultTransport,
		time.Duration(cfg.Cfg.ServerProxy.Prometheus.Timeout)*time.Second,
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
