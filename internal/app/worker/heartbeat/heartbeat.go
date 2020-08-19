package heartbeat

import (
	"time"

	"github.com/douyu/juno/internal/app/worker/cfg"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/juno/pkg/util"
	"github.com/douyu/jupiter/pkg/server/xecho"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/go-resty/resty/v2"
)

func Start() error {
	config := cfg.Cfg.Heartbeat
	client := resty.New()

	go func() {
		for {
			req := client.R()
			req.SetBody(view.WorkerHeartbeat{
				IP:         util.ExternalIPString(),
				Port:       xecho.StdConfig("http").Port,
				HostName:   config.HostName,
				RegionCode: config.RegionCode,
				RegionName: config.RegionName,
				ZoneCode:   config.ZoneCode,
				ZoneName:   config.ZoneName,
				Env:        config.Env,
			})

			_, err := req.Post(config.Addr)
			if err != nil {
				xlog.Error("send heartbeat failed", xlog.String("err", err.Error()))
			}

			time.Sleep(config.Internal)
		}
	}()
	return nil
}
