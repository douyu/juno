package confgo

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/url"
	"strings"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/juno/pkg/util"
	"github.com/douyu/jupiter/pkg/store/gorm"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/spf13/viper"
	"go.uber.org/zap"
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

type CmcParse interface {
	ParseConfig() (output []*CmcInfo, err error)
}

type CmcToml struct {
	db    *gorm.DB
	Viper *viper.Viper
	view.RespOneConfig
}

type CmcInfo struct {
	Key      string `json:"key"`
	Ip       string `json:"ip"`
	Port     string `json:"port"`
	UserName string `json:"user_name"`
	Password string `json:"password"`
	Scheme   string `json:"scheme"`
	DbName   string `json:"db_name"`
	Type     string `gorm:"not null;" json:"type"`
	view.RespOneConfig
}

func InitCmcToml(db *gorm.DB, value view.RespOneConfig) *CmcToml {
	obj := &CmcToml{
		db:            db,
		Viper:         viper.GetViper(),
		RespOneConfig: value,
	}
	return obj
}

func GetAllTpl(dbConn *gorm.DB) (resp []db.CmcTpl, err error) {
	resp = make([]db.CmcTpl, 0)
	err = dbConn.Find(&resp).Error
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

func (c *CmcToml) ParseConfig() (output []*CmcInfo, err error) {

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
	allTpl, err := GetAllTpl(c.db)
	if err != nil {
		xlog.Error("ParseConfig", zap.Error(err), zap.String("msg", "GetAllTpl"), zap.String("value", c.RespOneConfig.Content))
	}

	// 将所有的模板根据配置的模板key组装成map
	allTplMap, err := ParseTpl(allTpl)
	if err != nil {
		xlog.Error("ParseConfig", zap.Error(err), zap.String("msg", "ParseTpl"), zap.String("value", c.RespOneConfig.Content))
	}

	var (
		needParseKeyMap = make(map[string]string, 0) // 需要解析的内容
		allKey          = make(map[string]int)       // 所有的key
	)

	// 处理配置中所有的item
	for _, item := range c.Viper.AllKeys() {
		allKey[item] = 1

		// 只有一层的item不考虑
		if !strings.Contains(item, SEP_POINT) {
			continue
		}

		// 匹配模板与当前item flag:匹配成功   depKey:当前的key eg jupiter.mysql.juno  tplKey:jupiter.mysql.{{}}
		depKey, tplKey, flag := matchTpl(item, allTplMap)
		if !flag {
			continue
		}

		// 已经找到
		if _, ok := needParseKeyMap[depKey]; ok {
			continue
		}

		needParseKeyMap[depKey] = tplKey

	}

	for depKey, tplKey := range needParseKeyMap {

		tplValue := allTplMap[tplKey]
		cmcInfo := CmcInfo{
			Type: tplValue.TplType,
			RespOneConfig: view.RespOneConfig{
				Env:      c.Env,
				ZoneCode: c.ZoneCode,
				Content:  c.Content,
				AppName:  c.AppName,
				Aid:      c.Aid,
				Format:   c.Format,
				FileName: c.FileName,
			},
		}
		// 解析模板中的每一个字段
		for cmcTpl, field := range tplValue.TplMap {
			item := fmt.Sprintf("%s%s%s", depKey, SEP_POINT, field)
			// 没有则不需要解析
			if _, ok := allKey[item]; !ok {
				continue
			}

			// 考虑为数组的情况
			var (
				valArray = c.Viper.GetStringSlice(item)
				val      = c.Viper.GetString(item)
			)

			if val == "" {
				if len(valArray) == 0 {
					continue
				}
				// 只有直接获取不到值且数组长度大于0才为真正的数组
				for _, addr := range valArray {
					cmcInfoTmp := CmcInfo{}
					err := util.DeepCopy(&cmcInfoTmp, &cmcInfo)
					if err != nil {
						xlog.Info("ParseConfig", zap.String("msg", "DeepCopy"), zap.String("tplKey", tplKey), zap.String("item", item))
						continue
					}
					// 处理各种配置模板的解析
					err = handleParse(&cmcInfoTmp, tplValue.TplType, depKey, cmcTpl, addr)
					if err != nil {
						xlog.Info("ParseConfig", zap.String("msg", "handleParse array"), zap.String("tplKey", tplKey), zap.String("item", item))
						continue
					}
					output = append(output, &cmcInfoTmp)
				}
				continue
			}

			// 处理各种配置模板的解析
			err := handleParse(&cmcInfo, tplValue.TplType, depKey, cmcTpl, val)
			if err != nil {
				xlog.Info("ParseConfig", zap.String("msg", "handleParse"), zap.String("tplKey", tplKey), zap.String("item", item))
				continue
			}
		}
		// 只添加有内容的
		if cmcInfo.Key != "" {
			output = append(output, &cmcInfo)
		}
	}

	return
}

// item与模板匹配
func matchTpl(item string, allTplMap map[string]tplData) (depKey, tplKey string, flag bool) {
	// 只有一层的item不考虑
	if !strings.Contains(item, SEP_POINT) {
		return
	}

	var (
		itemArray = strings.Split(item, SEP_POINT)
		lenArr    = len(itemArray) - 1 // lenArr必然大于等于1
	)

	depKey = strings.Join(itemArray[0:lenArr], SEP_POINT)

	// 考虑特殊情况
	if lenArr == 1 {
		depKey = itemArray[0]
	}

	// 优先考虑绝对路径匹配成功的
	for k := range allTplMap {
		// 绝对路径匹配成功
		if k == depKey {
			flag = true
			tplKey = k
			return
		}
	}

	// 匹配
	for key := range allTplMap {
		tplKeyArray := strings.Split(key, SEP_POINT)

		// 长度不一致，不考虑
		if len(tplKeyArray) != lenArr {
			continue
		}

		// 拆分后逐个匹配
		flag = true
		for index := range tplKeyArray {
			// 当模板字段不为{{}}，且二者不相同，说明匹配失败
			if tplKeyArray[index] != TPL_SYMBOL && tplKeyArray[index] != itemArray[index] {
				flag = false
				break
			}
		}

		// 匹配成功
		if flag {
			tplKey = key
			return
		}
	}

	// 没有找到匹配的
	return
}

func handleParse(cmcInfo *CmcInfo, tplType, key, parseTpl string, value string) (err error) {
	cmcInfo.Key = key

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
