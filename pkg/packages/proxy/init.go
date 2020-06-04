package proxy

import "github.com/douyu/juno/pkg/packages/proxy/invoker"

var Confgo *confgo

func Init() {
	invoker.Init()

	Confgo = &confgo{}
}
