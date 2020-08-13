package appDep

import (
	"fmt"
	"testing"
	"time"

	"github.com/douyu/juno/internal/pkg/invoker"
	sresource "github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/go-resty/resty/v2"
)

func init() {
	cfg.InitCfg()
	invoker.Init()
	sresource.InitResource(invoker.JunoMysql)
}

func TestAppDep(t *testing.T) {
	// var depApp DepApp
	appDepHandle := appDep{
		DB:     invoker.JunoMysql,
		Client: resty.New().SetHostURL("https://git.dz11.com").SetDebug(false).SetTimeout(time.Second * 3).SetAuthToken("RgZev8zy6dtP2y8EA4sB"),
	}
	err := appDepHandle.SyncAppVersion()
	if err != nil {
		fmt.Println("##### SyncAppVersion err", err)
	}
}
