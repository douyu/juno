package appDep

import (
	"github.com/douyu/juno/internal/pkg/invoker"
	sresource "github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/pkg/cfg"
)

func init() {
	cfg.InitCfg()
	invoker.Init()
	sresource.InitResource(invoker.JunoMysql)
}
