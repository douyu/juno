package confgo

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/douyu/jupiter/pkg/xlog"
	"go.uber.org/zap"
	"net/url"
	"strings"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/juno/pkg/util"
	"github.com/douyu/jupiter/pkg/store/gorm"
	"github.com/spf13/viper"
)

var (
	CmcIp       = "{{IP}}"
	CmcPort     = "{{PORT}}"
	CmcAddr     = "{{ADDR}}"
	CmcDsn      = "{{DSN}}"
	CmcUrl      = "{{URL}}"
	CmcUserName = "{{USERNAME}}"
	CmcPassword = "{{PASSWORD}}"
	CmcAll      = "{{ALL}}" // 全部解析

	CmcArr = []string{CmcIp, CmcPort, CmcUserName, CmcPassword, CmcAddr, CmcDsn, CmcUrl, CmcAll}
)

const (
	SEP_POINT  = "."
	TPL_SYMBOL = "{{}}"
)

type CmcTpl struct {
	db    *gorm.DB
	Viper *viper.Viper
	view.RespOneConfig
}

type CmcInfo struct {
	view.RespOneConfig
	Key      string `json:"key"`
	Ip       string `json:"ip"`
	Port     string `json:"port"`
	UserName string `json:"user_name"`
	Password string `json:"password"`
	Scheme   string `json:"scheme"`
	DbName   string `json:"db_name"`
}

func InitCmcTpl(db *gorm.DB, value view.RespOneConfig) *CmcTpl {
	obj := &CmcTpl{
		db:            db,
		Viper:         viper.GetViper(),
		RespOneConfig: value,
	}
	return obj
}

func (c *CmcTpl) GetAllTpl() (resp []db.CmcTpl, err error) {
	resp = make([]db.CmcTpl, 0)
	err = c.db.Find(&resp).Error
	if err != nil {
		return
	}
	return
}

type tplData struct {
	Key     string            `json:"key"`
	TplType string            `json:"tplType"`
	TplMap  map[string]string `json:"tplMap"`
}

// 所有模板
func ParseTpl(tplList []db.CmcTpl) (allTplMap map[string]tplData, err error) {
	// 所有模板存储的结果
	allTplMap = make(map[string]tplData)

	for _, v := range tplList {
		// 单条模板内容map  -- 模板字段映射真实的key
		jsonMap := make(map[string]string)
		err = json.Unmarshal([]byte(v.Content), &jsonMap)
		if err != nil {
			xlog.Error("ParseTpl", zap.Error(err))
			continue
		}

		tplKey, ok := jsonMap["key"]
		// 所有模板数据必须要有key字段，否则无效
		if !ok {
			xlog.Error("ParseTpl", zap.String("err", "no key"), zap.Int("id", v.Id))
			continue
		}

		// 已经存在该模板key了
		if _, ok := allTplMap[tplKey]; ok {
			continue
		}

		// 单个模板存储的结构
		tplMap := make(map[string]string)

		for key, field := range jsonMap {
			// key字段忽略，只是为了标识模板key
			if key == "key" {
				continue
			}
			// 让每一个元素都遍历到
			for _, cmcTplValue := range CmcArr {
				// 配置的模板与定义的模板一致
				if strings.TrimSpace(field) == cmcTplValue {
					tplMap[cmcTplValue] = key
				}
			}
		}
		allTplMap[tplKey] = tplData{
			Key:     tplKey,
			TplType: v.TplType,
			TplMap:  tplMap,
		}
	}
	return
}

func (c *CmcTpl) ParseConfig() (output []*CmcInfo, err error) {

	// 其他格式 todo
	if c.RespOneConfig.Format != "toml" {
		err = fmt.Errorf("暂时只支持解析toml文件")
		return
	}

	// 读取配置文件
	c.Viper.SetConfigType("toml")
	err = c.Viper.ReadConfig(bytes.NewReader([]byte(c.RespOneConfig.Content)))

	if err != nil {
		xlog.Error("ParseConfig", zap.Error(err), zap.String("msg", "viper.ReadConfig"), zap.String("value", c.RespOneConfig.Content))
	}

	// 拿到所有的模板
	allTpl, err := c.GetAllTpl()
	if err != nil {
		xlog.Error("ParseConfig", zap.Error(err), zap.String("msg", "GetAllTpl"), zap.String("value", c.RespOneConfig.Content))
	}

	// 将所有的模板根据配置的模板key组装成map
	allTplMap, err := ParseTpl(allTpl)
	if err != nil {
		xlog.Error("ParseConfig", zap.Error(err), zap.String("msg", "ParseTpl"), zap.String("value", c.RespOneConfig.Content))
	}

	// 处理配置中所有的item
	for _, item := range c.Viper.AllKeys() {

		// 只有一层的item不考虑
		if !strings.Contains(item, SEP_POINT) {
			continue
		}

		var (
			itemArray = strings.Split(item, SEP_POINT)
			lenArr    = len(itemArray)                                                                               // lenArr必然大于等于2
			key       = itemArray[lenArr-1]                                                                          // item最后一个字段即为模板里面配置的key
			tplKey    = fmt.Sprintf("%s%s%s", strings.Join(itemArray[0:lenArr-2], SEP_POINT), SEP_POINT, TPL_SYMBOL) // 组装模板key
			parseTpl  = ""                                                                                           //需要解析的模板具体的名称 {{DSN}}
		)

		// 特殊处理一下，只有两层的数据
		if lenArr == 2 {
			tplKey = TPL_SYMBOL
		}

		// 该条item在模板中存在，则需要解析
		tplValue, ok := allTplMap[tplKey]
		if !ok {
			// 还需要考虑key中没有{{}}的情况
			newTplKey := strings.Join(itemArray[0:lenArr-1], SEP_POINT)
			tplValue, ok = allTplMap[newTplKey]
			if !ok {
				xlog.Debug("ParseConfig", zap.String("msg", "allTplMap no key"), zap.String("tplKey", tplKey), zap.String("item", item))
				continue
			}

		}

		for cmcTpl, field := range tplValue.TplMap {
			// 当前key 与模板定义的一致，则需要解析
			if field == key {
				parseTpl = cmcTpl
				break
			}
		}

		if parseTpl == "" {
			continue
		}

		// redis 需要考虑addr为数组的情况
		if tplValue.TplType == "redis" {
			addrList := c.Viper.GetStringSlice(item)
			if len(addrList) > 0 {
				for _, addr := range addrList {
					// 处理各种配置模板的解析
					cmcInfo, err := handleParse(tplValue.TplType, item, parseTpl, addr)
					if err != nil {
						xlog.Info("ParseConfig", zap.String("msg", "handleParse"), zap.String("tplKey", tplKey), zap.String("item", item))
						continue
					}
					output = append(output, &cmcInfo)
				}
				continue
			}
		}

		// 处理各种配置模板的解析
		cmcInfo, err := handleParse(tplValue.TplType, item, parseTpl, c.Viper.GetString(item))
		if err != nil {
			xlog.Info("ParseConfig", zap.String("msg", "handleParse"), zap.String("tplKey", tplKey), zap.String("item", item))
			continue
		}
		output = append(output, &cmcInfo)
	}

	return
}

func handleParse(tplType, key, parseTpl string, value string) (cmcInfo CmcInfo, err error) {
	cmcInfo = CmcInfo{
		Key: key,
	}

	switch parseTpl {
	case CmcIp:
		cmcInfo.Ip = value
	case CmcPort:
		cmcInfo.Port = value
	case CmcAddr:
		cmcInfo.Ip, cmcInfo.Port, cmcInfo.UserName, cmcInfo.Password = util.ParseAddr(tplType, value)
	case CmcUserName:
		cmcInfo.UserName = value
	case CmcPassword:
		cmcInfo.Password = value
	case CmcDsn:
		dsnData, e := util.ParseDSN(value)
		if e != nil {
			err = e
			return
		}
		cmcInfo.Ip, cmcInfo.Port, cmcInfo.UserName, cmcInfo.Password = util.ParseAddr(tplType, dsnData.Addr)
		cmcInfo.UserName = dsnData.User
		cmcInfo.Password = dsnData.Passwd
		cmcInfo.Scheme = dsnData.Net
		cmcInfo.DbName = dsnData.DBName
	case CmcUrl:
		urlData, e := url.Parse(value)
		if e != nil {
			err = e
			return
		}
		cmcInfo.Ip = urlData.Hostname()
		cmcInfo.Port = urlData.Port()
		cmcInfo.Scheme = urlData.Scheme
		cmcInfo.UserName = urlData.User.Username()
		cmcInfo.Password, _ = urlData.User.Password()
	}
	return
}
