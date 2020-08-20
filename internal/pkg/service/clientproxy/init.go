package clientproxy

import (
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/constx"
)

// MultiProxy ..
var ClientProxy clientProxy

// Init ...
func Init() {
	if cfg.Cfg.App.Mode == constx.ModeMultiple {
		ClientProxy = initMultiProxy()
	} else {
		ClientProxy = initSingleProxy()
	}
	return
}
