package roundtrip

import (
	"net/http"
)

func NewJunoRoundTripper(p ProxyRoundTripper) ProxyRoundTripper {
	return &junoRoundTripper{
		p: p,
		d: http.DefaultTransport,
	}
}

type junoRoundTripper struct {
	p ProxyRoundTripper
	d http.RoundTripper
}

func (d *junoRoundTripper) RoundTrip(r *http.Request) (*http.Response, error) {
	return d.p.RoundTrip(r)
}

func (d *junoRoundTripper) CancelRequest(r *http.Request) {
	d.p.CancelRequest(r)
}

type FactoryImpl struct {
	Template *http.Transport
}

func (t *FactoryImpl) New(expectedServerName string) ProxyRoundTripper {

	newTransport := &http.Transport{
		Dial:                t.Template.Dial,
		DisableKeepAlives:   t.Template.DisableKeepAlives,
		MaxIdleConns:        t.Template.MaxIdleConns,
		IdleConnTimeout:     t.Template.IdleConnTimeout,
		MaxIdleConnsPerHost: t.Template.MaxIdleConnsPerHost,
		DisableCompression:  t.Template.DisableCompression,
	}
	return NewJunoRoundTripper(newTransport)
}
