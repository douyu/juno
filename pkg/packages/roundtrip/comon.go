package roundtrip

import "net/http"

type ProxyRoundTripper interface {
	http.RoundTripper
	CancelRequest(*http.Request)
}
