package service

import (
	"time"

	"github.com/douyu/juno/internal/pkg/service/loggerplatform"

	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/service/analysis"
	"github.com/douyu/juno/internal/pkg/service/appDep"
	"github.com/douyu/juno/internal/pkg/service/appevent"
	"github.com/douyu/juno/internal/pkg/service/applog"
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
	"github.com/douyu/juno/internal/pkg/service/taskplatform"
	"github.com/douyu/juno/internal/pkg/service/testplatform"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/auth/social"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/jupiter/pkg/conf"
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

	permission.Init(permission.Option{
		DB:                 invoker.JunoMysql,
		GitlabOAuthApiUrl:  conf.GetString("auth.gitlab.apiUrl"),
		GitlabOAuthEnabled: conf.GetBool("auth.gitlab.enable"),
		ProductionEnvs:     cfg.Cfg.App.ProductionEnvs,
	})

	openauth.Init(invoker.JunoMysql)

	applog.Init()
	grpctest.Init(grpctest.Option{
		DB:       invoker.JunoMysql,
		Enabled:  cfg.Cfg.GrpcTest.Enable,
		ProtoDir: cfg.Cfg.GrpcTest.ProtoDir,
	})

	httptest.Init(httptest.Option{
		DB: invoker.JunoMysql,
	})

	appDep.Init()

	testplatform.Init(testplatform.Option{
		Enable:         cfg.Cfg.TestPlatform.Enable,
		DB:             invoker.JunoMysql,
		GitAccessToken: cfg.Cfg.CodePlatform.Token,
		Worker: struct {
			HeartbeatTimeout time.Duration
			LocalQueueDir    string
		}{
			HeartbeatTimeout: cfg.Cfg.TestPlatform.Worker.HeartbeatTimeout,
			LocalQueueDir:    cfg.Cfg.TestPlatform.Worker.LocalQueueDir,
		},
	})

	taskplatform.Init(taskplatform.Option{
		DB: invoker.JunoMysql,
	})

	loggerplatform.Init()

	return
}
