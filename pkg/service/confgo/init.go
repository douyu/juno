package confgo

import "github.com/douyu/juno/pkg/invoker"

var (
	Cmc         *cmc
	ConfuSrv    *confu
	CmcAppSrv   *configApp
	PublishSrv  *publish
	ResourceSrv *resources
	HistorySrv  *history

	Confgo *confgo
)

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
