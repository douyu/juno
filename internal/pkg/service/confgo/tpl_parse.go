package confgo

import (
	"bytes"
	"encoding/json"
	"net/url"
	"strings"

	"github.com/douyu/juno/internal/pkg/service/codec"
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

type CmcTpl struct {
	db       *gorm.DB
	tplMap   map[string]tplParse
	Ip       string `json:"ip"`
	Port     string `json:"port"`
	UserName string `json:"user_name"`
	Password string `json:"password"`
	Scheme   string `json:"scheme"`
	DbName   string `json:"db_name"`
	Key      string `json:"key"`
	TplId    int    `json:"tpl_id"`
	TplType  string `json:"tpl_type"`
	view.RespOneConfig
	Metadata map[string]string `json:"metadata"`
}

// 解析结构体
type tplParse struct {
	Field          string
	FieldMatchType int // 0 不匹配， 1 完全匹配，2 前缀匹配，3 中间匹配，4 后缀匹配
}

func InitCmcTpl(db *gorm.DB, value view.RespOneConfig) *CmcTpl {
	obj := &CmcTpl{
		db:            db,
		tplMap:        make(map[string]tplParse),
		Metadata:      make(map[string]string),
		RespOneConfig: value,
	}
	return obj
}

func (c *CmcTpl) ParseTpl(tpl string) (err error) {
	var jsonMap map[string]string
	err = json.Unmarshal([]byte(tpl), &jsonMap)
	for key, field := range jsonMap {
		// 让每一个元素都遍历到
		for _, cmcTplValue := range CmcArr {
			if strings.Contains(field, cmcTplValue) {
				c.tplMap[cmcTplValue] = tplParse{
					key,
					getTplFieldMatchType(field, cmcTplValue),
				}
			}
		}
	}
	c.Metadata = jsonMap
	return
}

func (c *CmcTpl) GetTpl(id int) (tpl string, err error) {
	var tplInfo db.CmcTpl
	err = c.db.Where("id = ?", id).Find(&tplInfo).Error
	if err != nil {
		return
	}
	tpl = tplInfo.Content
	c.TplId = id
	c.TplType = tplInfo.TplType
	return
}

func ParseConfig(tx *gorm.DB, value view.RespOneConfig) (output []*CmcTpl, err error) {
	items, decodeErr := codec.DecodeToml(value.Content, false)
	if decodeErr != nil {
		return
	}
	// 读取配置
	rBytes := bytes.NewReader([]byte(value.Content))
	viper.SetConfigType(value.Format)
	err = viper.ReadConfig(rBytes)
	if err != nil {
		return
	}

	needParseKeyMap := make(map[string]int, 0)
	for _, value := range items {
		// 1 如果后缀解析出junotpl，那么说明该配置需要解析
		if strings.HasSuffix(value.Key, ".junotpl") {
			// 找到父节点，并将模板数据赋值上去
			needParseKeyMap[strings.TrimSuffix(value.Key, ".junotpl")] = viper.GetInt(value.Key)
		}
	}
	output = make([]*CmcTpl, 0)
	for key, tplId := range needParseKeyMap {
		c := InitCmcTpl(tx, value)
		tpl, err := c.GetTpl(tplId)

		if err != nil {
			continue
		}
		err = c.ParseTpl(tpl)

		if err != nil {
			continue
		}
		// todo 优化
		c.setKey(key)
		c.parseIp(key)
		c.parsePort(key)
		c.parseAddr(key)
		c.parseUsername(key)
		c.parsePassword(key)
		c.parseDsn(key)
		c.parseURL(key)
		c.parseAll(key)

		output = append(output, c)
	}
	return
}

func (c *CmcTpl) setKey(key string) {
	c.Key = key
}

func (c *CmcTpl) parseIp(parentKey string) {
	tplModel, flag := c.tplMap[CmcIp]
	if !flag {
		return
	}

	if tplModel.FieldMatchType == 1 {
		c.Ip = viper.GetString(parentKey + "." + tplModel.Field)
	}
}

func (c *CmcTpl) parsePort(parentKey string) {
	tplModel, flag := c.tplMap[CmcIp]
	if !flag {
		return
	}

	if tplModel.FieldMatchType == 1 {
		c.Port = viper.GetString(parentKey + "." + tplModel.Field)
	}
}

func (c *CmcTpl) parseUsername(parentKey string) {
	tplModel, flag := c.tplMap[CmcUserName]
	if !flag {
		return
	}

	if tplModel.FieldMatchType == 1 {
		c.UserName = viper.GetString(parentKey + "." + tplModel.Field)
	}
}

func (c *CmcTpl) parsePassword(parentKey string) {
	tplModel, flag := c.tplMap[CmcPassword]
	if !flag {
		return
	}

	if tplModel.FieldMatchType == 1 {
		c.Password = viper.GetString(parentKey + "." + tplModel.Field)
	}
}

func (c *CmcTpl) parseAddr(parentKey string) {
	tplModel, flag := c.tplMap[CmcAddr]
	if !flag {
		return
	}

	if tplModel.FieldMatchType == 1 {
		addr := viper.GetString(parentKey + "." + tplModel.Field)
		c.Ip, c.Port = util.ParseAddr(addr)
	}
}

func (c *CmcTpl) parseDsn(parentKey string) {
	tplModel, flag := c.tplMap[CmcDsn]
	if !flag {
		return
	}

	if tplModel.FieldMatchType == 1 {
		dsn := viper.GetString(parentKey + "." + tplModel.Field)
		dsnData, err := util.ParseDSN(dsn)
		if err != nil {
			return
		}
		c.Ip, c.Port = util.ParseAddr(dsnData.Addr)
		c.UserName = dsnData.User
		c.Password = dsnData.Passwd
		c.Scheme = dsnData.Net
		c.DbName = dsnData.DBName
	}
}

func (c *CmcTpl) parseURL(parentKey string) {
	tplModel, flag := c.tplMap[CmcUrl]
	if !flag {
		return
	}

	if tplModel.FieldMatchType == 1 {
		urlValue := viper.GetString(parentKey + "." + tplModel.Field)

		urlData, err := url.Parse(urlValue)
		if err != nil {
			return
		}
		c.Ip = urlData.Hostname()
		c.Port = urlData.Port()
		c.Scheme = urlData.Scheme
		c.UserName = urlData.User.Username()
		c.Password, _ = urlData.User.Password()
	}
}

func (c *CmcTpl) parseAll(parentKey string) {
	tplModel, flag := c.tplMap[CmcAll]
	if !flag {
		return
	}

	if tplModel.FieldMatchType == 1 {
		value := viper.GetString(parentKey + "." + tplModel.Field)
		c.Ip = value
		c.Port = ""
	}
}

func getTplFieldMatchType(field, value string) int {
	switch true {
	case strings.EqualFold(field, value):
		return 1
	case strings.HasPrefix(field, value):
		return 2
	case strings.HasSuffix(field, value):
		return 4
	case strings.Contains(field, value):
		return 3

	}
	return 0
}
