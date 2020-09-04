package confgo

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/internal/pkg/service/confgov2"
	"github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/internal/pkg/service/system"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	"go.uber.org/zap"
)

type configTime struct {
	Interval string `json:"interval"`
}

// GetConfigParseWorkerTime 获取配置依赖解析间隔时间
func (c *confu) GetConfigParseWorkerTime() (interval int) {
	interval = 0 // one day default
	settings, err := system.System.Setting.GetAll()
	if err != nil {
		xlog.Error("GetConfigParseWorkerTime", xlog.String("step", "system.System.Setting.GetAll()"), xlog.Any("error", err))
		return interval
	}
	configDep, ok := settings["config_dep"]
	if !ok {
		xlog.Error("GetConfigParseWorkerTime", xlog.String("step", "settings"), xlog.Any("error", err))
		return interval
	}

	timeStruct := configTime{}
	if err := json.Unmarshal([]byte(configDep), &timeStruct); err != nil {
		xlog.Error("GetConfigParseWorkerTime", xlog.String("step", "Unmarshal"), xlog.Any("error", err))
		return interval
	}

	if timeStruct.Interval == "" {
		xlog.Error("GetConfigParseWorkerTime", xlog.String("step", "timeStruct"), xlog.Any("error", err))
		return interval
	}

	if timeInt, err := strconv.ParseInt(timeStruct.Interval, 10, 32); err != nil {
		xlog.Error("GetConfigParseWorkerTime", xlog.String("step", "ParseInt"), xlog.Any("error", err))
		return interval
	} else {
		interval = int(timeInt)
	}

	return
}

// ConfigParseWorker ...
func (c *confu) ConfigParseWorker() (err error) {
	// 记录更新时间，清理数据库时以该时间为基准
	updateTime := time.Now().Unix()

	xlog.Info("ConfigParseWorker", zap.String("run", "start"), zap.Any("updateTime", updateTime))
	// 拿到所有配置文件
	list, err := confgov2.GetAllConfigText()
	if err != nil {
		xlog.Error("GetAllConfigText", zap.Error(err))
		return err
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
			continue
		}

		// 写入mysql
		err = c.ParseToMysql(appInfo.Aid, appInfo.AppName, resp, updateTime)
		if err != nil {
			xlog.Error("ParseToMysql", zap.Error(err))
			continue
		}
	}
	xlog.Info("ConfigParseWorker", zap.String("run", "end"), zap.Any("updateTime", updateTime))
	return
}

func (c *confu) ParseToMysql(aid int, appName string, items []*CmcInfo, updateTime int64) (err error) {
	// 删除该服务的全部配置
	tx := c.DB.Begin()
	err = tx.Model(db.AppTopology{}).Where("aid = ? AND update_time < ?", aid, updateTime).Delete(&db.AppTopology{}).Error
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
			UpdateTime: updateTime,
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
