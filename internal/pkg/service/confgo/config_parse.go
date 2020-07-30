package confgo

import (
	"encoding/json"
	"fmt"
	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/service/confgov2"
	"github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/internal/pkg/service/system"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	"go.uber.org/zap"
	"strconv"
	"time"
)

type configTime struct {
	Interval string `json:"interval"`
}

// 获取配置依赖解析间隔时间
func (c *confu) GetConfigParseWorkerTime() (interval int, err error) {
	settings, err := system.System.Setting.GetAll()
	if err != nil {
		return interval, err
	}
	configDep, ok := settings["config_dep"]
	if !ok {
		return interval, fmt.Errorf("interval not exist")
	}

	timeStruct := configTime{}
	if err := json.Unmarshal([]byte(configDep), &timeStruct); err != nil {
		return interval, err
	}

	if timeStruct.Interval == "" {
		return interval, fmt.Errorf("interval is nil")
	}

	if timeInt, err := strconv.ParseInt(timeStruct.Interval, 10, 32); err != nil {
		return interval, err
	} else {
		interval = int(timeInt)
	}

	return
}

func (c *confu) ConfigParseWorker() (err error) {
	// 拿到所有配置文件
	list, err := confgov2.GetAllConfigText()
	if err != nil {
		xlog.Error("GetAllConfigText", zap.Error(err))
	}
	for _, config := range list {
		// 拿到app信息
		appInfo, err := resource.Resource.GetApp(config.AID)
		if err != nil {
			xlog.Error("GetApp", zap.Error(err), zap.Int("aid", int(config.AID)))
			continue
		}

		// 配置文件为空
		if config.Content == "" {
			xlog.Error("GetApp", zap.String("msg", "content is nil"), zap.Int("id", int(config.ID)), zap.Int("aid", int(config.AID)))
			continue
		}

		var parseConfig CmcParse

		parseConfig = InitCmcToml(invoker.JunoMysql, view.RespOneConfig{
			Env:      config.Env,
			ZoneCode: config.Zone,
			Content:  config.Content,
			AppName:  appInfo.AppName,
			Aid:      int(config.AID),
			Format:   config.Format,
			FileName: fmt.Sprintf("%s.%s", config.Name, config.Format),
		})

		// 配置解析
		resp, err := parseConfig.ParseConfig()
		if err != nil {
			xlog.Error("parseConfig.ParseConfig", zap.Error(err))
		}

		// 写入mysql
		err = c.ParseToMysql(appInfo.Aid, appInfo.AppName, resp)
		if err != nil {
			xlog.Error("ParseToMysql", zap.Error(err))
			continue
		}
	}
	return
}

func (c *confu) ParseToMysql(aid int, appName string, items []*CmcInfo) (err error) {
	// 删除该服务的全部配置
	tx := c.DB.Begin()
	err = tx.Model(db.AppTopology{}).Where("aid = ?", aid).Delete(&db.AppTopology{}).Error
	if err != nil {
		tx.Rollback()
		return
	}

	for _, value := range items {
		zoneInfo, _ := resource.Resource.GetZoneInfo(db.Zone{
			ZoneCode: value.ZoneCode,
			Env:      value.Env,
		})
		// 为了兼容grpc的逻辑
		var addr string
		if value.Port != "" {
			addr = value.Ip + ":" + value.Port
		} else {
			addr = value.Ip
		}

		info := &db.AppTopology{
			Aid:        aid,
			RegionCode: zoneInfo.RegionCode,
			ZoneCode:   value.ZoneCode,
			Env:        value.Env,
			Addr:       addr,
			IP:         value.Ip,
			Port:       value.Port,
			Name:       value.Key,
			Type:       value.Type,
			Info:       "",
			UpdateTime: time.Now().Unix(),
			UpdatedBy:  0,
			Extra:      "",
			AppName:    appName,
			FileName:   value.FileName,
		}
		if err := tx.Create(info).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	tx.Commit()
	return
}
