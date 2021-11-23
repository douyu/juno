package testplatform

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/douyu/juno/internal/pkg/service/k8s"

	"github.com/douyu/juno/internal/pkg/service/system"
	"github.com/douyu/juno/internal/pkg/service/testplatform/localworker"
	"github.com/douyu/juno/internal/pkg/service/testplatform/workerpool"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/jinzhu/gorm"
)

type (
	Option struct {
		Enable         bool
		DB             *gorm.DB
		GitAccessToken string
		Worker         struct {
			HeartbeatTimeout time.Duration
			LocalQueueDir    string
		}
	}
)

var (
	option Option
)

func Init(o Option) {
	option = o

	system.System.Setting.Subscribe(view.TestPlatformSettingName, onSettingChange, true)
	system.System.Setting.Subscribe(view.K8SClusterSettingName, onK8sSettingChange, false)

	workerpool.Instance().Init(workerpool.Option{
		DB:               o.DB,
		HeartbeatTimeout: o.Worker.HeartbeatTimeout,
	})

	localworker.Instance().Init(localworker.Option{
		WorkerQueueDir: o.Worker.LocalQueueDir,
	})

	startClearTimeoutTask()
}

func onSettingChange(content string) {
	data := view.SettingTestPlatform{}
	err := json.Unmarshal([]byte(content), &data)
	if err != nil {
		xlog.Error("Unmarshal testPlatform setting failed", xlog.String("err", err.Error()))

		option.Enable = false
		return
	}

	option.Enable = data.Enable
}

func onK8sSettingChange(content string) {
	fmt.Println("haaaaaaaaaaaaaaaaaaaaaaa===>")
	k8s.Reload()
}
