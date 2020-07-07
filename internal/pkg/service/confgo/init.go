package confgo

import "github.com/douyu/juno/internal/pkg/invoker"

var (
	// Cmc ...
	Cmc *cmc
	// ConfuSrv ...
	ConfuSrv *confu
)

// Init ...
func Init() {
	Cmc = &cmc{}
	ConfuSrv = &confu{
		DB: invoker.JunoMysql,
	}
}
