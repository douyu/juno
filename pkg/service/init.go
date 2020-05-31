package service

import (
	"github.com/douyu/juno/pkg/invoker"
	"github.com/douyu/juno/pkg/service/analysis"
	"github.com/douyu/juno/pkg/service/appevent"
	scmc "github.com/douyu/juno/pkg/service/cmc"
	"github.com/douyu/juno/pkg/service/confgo"
	"github.com/douyu/juno/pkg/service/grpcgovern"
	"github.com/douyu/juno/pkg/service/parse"
	"github.com/douyu/juno/pkg/service/pprof"
	sresource "github.com/douyu/juno/pkg/service/resource"
	"github.com/douyu/juno/pkg/service/system"
	"github.com/douyu/juno/pkg/service/user"
)

// Init service初始化。
func Init() {

	// 事件最先初始化，最低层
	appevent.InitAppEvent()

	// 初始化资源
	sresource.InitResource(invoker.JunoMysql)
	// 初始化配置
	scmc.InitCmc(invoker.JunoMysql)

	confgo.Init()

	user.Init(invoker.JunoMysql)

	grpcgovern.Init()

	analysis.InitAnalysis(invoker.JunoMysql)

	system.InitSystem(invoker.JunoMysql)
	pprof.InitPprof(invoker.JunoMysql)

	parse.Init()
}
