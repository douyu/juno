package appDep

import (
	"time"

	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/jupiter/pkg/conf"
	"github.com/go-resty/resty/v2"
)

var AppDep *appDep

//Init ..
func Init() {
	AppDep = &appDep{
		DB:     invoker.JunoMysql,
		Client: resty.New().SetHostURL(conf.GetString("godep.gitlab.host")).SetDebug(false).SetTimeout(time.Second * 3).SetAuthToken(conf.GetString("godep.gitlab.token")),
	}
}
