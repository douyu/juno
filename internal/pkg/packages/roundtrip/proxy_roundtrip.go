package roundtrip

import (
	"io/ioutil"
	"net/http"
	"time"

	"golang.org/x/net/context"
)

type RoundTripperFactory interface {
	New(expectedServerName string) ProxyRoundTripper
}

func GetRoundTripper(servicdId string, roundTripperFactory RoundTripperFactory) ProxyRoundTripper {
	return roundTripperFactory.New(servicdId)
}

func NewProxyRoundTripper(
	roundTripperFactory RoundTripperFactory,
	routeServicesTransport http.RoundTripper,
	endpointTimeout time.Duration,
) ProxyRoundTripper {
	return &roundTripper{
		roundTripperFactory:    roundTripperFactory,
		routeServicesTransport: routeServicesTransport,
		endpointTimeout:        endpointTimeout,
	}
}

type roundTripper struct {
	roundTripperFactory    RoundTripperFactory
	routeServicesTransport http.RoundTripper
	endpointTimeout        time.Duration
}

func (rt *roundTripper) RoundTrip(request *http.Request) (*http.Response, error) {
	var err error
	var res *http.Response

	if request.Body != nil {
		closer := request.Body
		request.Body = ioutil.NopCloser(request.Body)
		defer func() {
			closer.Close()
		}()
	}

	res, err = rt.backendRoundTrip(request)

	if err != nil {
		return nil, err
	}

	return res, nil
}

func (rt *roundTripper) CancelRequest(request *http.Request) {
	host := request.Header.Get("X-JUNO-PROXY-HOST")
	tr := GetRoundTripper(host, rt.roundTripperFactory)
	tr.CancelRequest(request)
}

func (rt *roundTripper) backendRoundTrip(
	request *http.Request,
) (*http.Response, error) {
	host := request.Header.Get("X-JUNO-PROXY-HOST")
	if host != "" {
		request.URL.Host = host
	}

	request.Header.Set("X-JUNO-ApplicationID", "")
	request.Header.Set("X-JUNO-InstanceIndex", "")
	tr := GetRoundTripper(host, rt.roundTripperFactory)
	res, err := rt.timedRoundTrip(tr, request)

	if err != nil {
		// 记录错误信息
	} else if res != nil {
		// 记录成功信息
	}
	return res, err
}

func (rt *roundTripper) timedRoundTrip(tr http.RoundTripper, request *http.Request) (*http.Response, error) {
	if rt.endpointTimeout <= 0 {
		return tr.RoundTrip(request)
	}

	reqCtx, cancel := context.WithTimeout(request.Context(), rt.endpointTimeout)
	request = request.WithContext(reqCtx)

	go func() {
		select {
		case <-reqCtx.Done():
			cancel()
		}
	}()

	resp, err := tr.RoundTrip(request)
	if err != nil {
		cancel()
		return nil, err
	}

	return resp, err
}
