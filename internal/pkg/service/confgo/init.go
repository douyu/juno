package confgo

import "github.com/douyu/juno/internal/pkg/invoker"

var (
	// Cmc ...
	Cmc *cmc
	// ConfuSrv ...
	ConfuSrv *confu
	// CmcAppSrv ...
	CmcAppSrv *configApp
	// PublishSrv ...
	PublishSrv *publish
	// ResourceSrv ...
	ResourceSrv *resources
	// HistorySrv ...
	HistorySrv *history
	// Confgo ...
	Confgo *confgo
)

// Init ...
func Init() {
	Cmc = &cmc{}
	CmcAppSrv = &configApp{
		DB: invoker.JunoMysql,
	}
	ConfuSrv = &confu{
		DB: invoker.JunoMysql,
	}
	PublishSrv = &publish{
		DB: invoker.JunoMysql,
	}
	ResourceSrv = &resources{
		DB: invoker.JunoMysql,
	}
	HistorySrv = &history{
		DB: invoker.JunoMysql,
	}
	// The new api should be written here
	Confgo = &confgo{DB: invoker.JunoMysql}
}
