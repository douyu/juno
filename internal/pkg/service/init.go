package service

import (
	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/service/analysis"
	"github.com/douyu/juno/internal/pkg/service/appevent"
	"github.com/douyu/juno/internal/pkg/service/casbin"
	"github.com/douyu/juno/internal/pkg/service/confgo"
	"github.com/douyu/juno/internal/pkg/service/confgov2"
	"github.com/douyu/juno/internal/pkg/service/configresource"
	"github.com/douyu/juno/internal/pkg/service/gateway"
	"github.com/douyu/juno/internal/pkg/service/grpcgovern"
	"github.com/douyu/juno/internal/pkg/service/parse"
	"github.com/douyu/juno/internal/pkg/service/pprof"
	sresource "github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/internal/pkg/service/system"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/auth/social"
)

// Init service初始化。
func Init() (err error) {

	// 事件最先初始化，最低层
	appevent.InitAppEvent()

	// 初始化资源
	sresource.InitResource(invoker.JunoMysql)

	social.NewOAuthService()

	confgo.Init()

	confgov2.Init(invoker.JunoMysql)

	user.Init(invoker.JunoMysql)

	grpcgovern.Init()

	analysis.InitAnalysis(invoker.JunoMysql)

	system.InitSystem(invoker.JunoMysql)
	pprof.InitPprof(invoker.JunoMysql)

	parse.Init()

	gateway.Init()

	configresource.Init(invoker.JunoMysql)

	casbinAdapter := &casbin.CasbinAdapter{}
	_, _, err = casbin.InitCasbin(casbinAdapter)
	if err != nil {
		return
	}
	return

}
