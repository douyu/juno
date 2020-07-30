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
	"github.com/douyu/juno/internal/pkg/service/grpctest"
	"github.com/douyu/juno/internal/pkg/service/httptest"
	"github.com/douyu/juno/internal/pkg/service/openauth"
	"github.com/douyu/juno/internal/pkg/service/parse"
	"github.com/douyu/juno/internal/pkg/service/permission"
	"github.com/douyu/juno/internal/pkg/service/pprof"
	sresource "github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/internal/pkg/service/system"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/auth/social"
	"github.com/douyu/juno/pkg/cfg"
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
	err = casbin.InitCasbin(casbinAdapter)
	if err != nil {
		return
	}

	permission.Init(invoker.JunoMysql)

	openauth.Init(invoker.JunoMysql)

	grpctest.Init(grpctest.Option{
		DB:       invoker.JunoMysql,
		Enabled:  cfg.Cfg.GrpcTest.Enable,
		ProtoDir: cfg.Cfg.GrpcTest.ProtoDir,
	})

	httptest.Init(httptest.Option{
		DB: invoker.JunoMysql,
	})

	return
}
