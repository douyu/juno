package proxy

import (
	"github.com/douyu/jupiter"
)

type Proxy struct {
	jupiter.Application
}

func New() *Proxy {
	eng := &Proxy{}
	_ = eng.Schedule(NewProxyGrpcWorker())
	_ = eng.Schedule(NewProxyHttpWorker())
	return eng
}