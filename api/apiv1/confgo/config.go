package confgo

import (
	"encoding/json"
	"strings"
	"time"

	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/appevent"
	"github.com/douyu/juno/internal/pkg/service/codec/util"
	"github.com/douyu/juno/internal/pkg/service/confgo"
	"github.com/douyu/juno/internal/pkg/service/parse"
	"github.com/douyu/juno/internal/pkg/service/resource"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/conf"
	"github.com/jinzhu/gorm"
	"github.com/labstack/echo/v4"
)

// GetAppConfigInfo ..
func GetAppConfigInfo(c echo.Context) error {
	reqModel := new(struct {
		AppName  string `json:"app_name"`
		Aid      int    `json:"aid"`
		Env      string `json:"env"`
		ZoneCode string `json:"zone_code"`
	})
	if err := c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	if reqModel.Env == "" {
		return output.JSON(c, output.MsgErr, "请求参数不完整，必须选择环境再获取配置")
	}

	// 判断用户对该应用是否有代码权限，如果有就提供线上配置查看
	if reqModel.Env == "prod" || reqModel.Env == "gray" {
		if !user.IsAdmin(c) {
			return output.JSON(c, output.MsgErr, "权限错误")
		}
	}

	result, err := confgo.CmcAppSrv.AppConfigList(reqModel.Env, reqModel.ZoneCode, reqModel.AppName, reqModel.Aid)
	if err != nil {
		return output.JSON(c, output.MsgErr, "add config file err "+err.Error())
	}
	return output.JSON(c, output.MsgOk, "", result)
}

// CreateConfigFile Create an app profile
func CreateConfigFile(c echo.Context) error {
	var err error
	reqModel := new(db.CmcAppView)
	if err = c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	reqModel.FileName = strings.TrimSpace(reqModel.FileName)
	app := db.App{}
	if err := confgo.CmcAppSrv.DB.Table("app").Where("aid = ?", reqModel.Aid).First(&app).Error; err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	u := user.GetUser(c)
	// todo language="go" format="toml"
	aid, appName, fileName, env, zoneCode := reqModel.Aid, reqModel.AppName, reqModel.FileName, reqModel.Env, reqModel.ZoneCode
	info, err := confgo.CmcAppSrv.CreateConfigFile(aid, appName, env, zoneCode, fileName, reqModel.Format, reqModel.Create)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	if err := confgo.ConfuSrv.Add(info.ID, "application", "", 0, u.Nickname, env, zoneCode, 0); err != nil {
		return output.JSON(c, output.MsgErr, "add error"+err.Error())
	}

	meta, _ := json.Marshal(reqModel)
	appevent.AppEvent.ConfgoFileCreateEvent(aid, appName, env, zoneCode, string(meta), u)

	return output.JSON(c, output.MsgOk, "配置文件添加成功", info)
}

// DeleteConfig ...
func DeleteConfig(c echo.Context) (err error) {
	reqModel := new(db.CmcAppView)
	if err = c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	caid, aid, zoneCode, appName, fileName := reqModel.ID, reqModel.Aid, reqModel.ZoneCode, reqModel.AppName, reqModel.FileName
	if caid == 0 || aid == 0 || zoneCode == "" || appName == "" || fileName == "" {
		return output.JSON(c, output.MsgErr, "缺少请求参数")
	}

	u := user.GetUser(c)
	// Online environment needs to be checked
	if strings.HasPrefix(reqModel.ZoneCode, "prod") || strings.HasPrefix(reqModel.ZoneCode, "gray") {
		if !user.IsAdmin(c) {
			return output.JSON(c, output.MsgErr, "没有项目权限")
		}
	}

	if err = confgo.CmcAppSrv.DelConfigFile(caid, aid, zoneCode, appName, fileName, u.Nickname); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	meta, _ := json.Marshal(reqModel)
	appevent.AppEvent.ConfgoFileDeleteEvent(aid, appName, zoneCode, string(meta), u)

	return output.JSON(c, output.MsgOk, "删除配置文件成功")
}

// GetAppConfig Get the application's k-v list and configuration file text
func GetAppConfig(c echo.Context) error {
	var err error
	reqModel := new(db.CmcConfig)
	if err = c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	// TODO 权限检查

	configListRes, err := confgo.ConfuSrv.GetAppKVlist(reqModel)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	configTextRes, err := confgo.ConfuSrv.GetAppConfigText(reqModel.Caid)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	// 找最后一次发布的日志，找出公共配置
	history := db.CmcHistory{}
	if err := confgo.HistorySrv.DB.Table("cmc_history").Where("caid = ?", reqModel.Caid).Order("create_time desc").First(&history).Error; err != nil {
	}

	commonText := ""
	filePath := ""
	if history.ID != 0 {
		val, err := confgo.HistorySrv.GetHistoryChange(history.ID)
		if err != nil {
		}
		commonText = val.CommonContent
		filePath = history.FilePath
	}

	return output.JSON(c, output.MsgOk, "查询配置kv成功", map[string]interface{}{
		"configList": configListRes,
		"configText": configTextRes,
		"commonText": commonText,
		"file_path":  filePath,
	})
}

// ItemCreate ...
func ItemCreate(c echo.Context) error {
	var err error
	reqModel := new(db.CmcConfig)
	if err = c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	caid, key, value, resourceID := reqModel.Caid, reqModel.Key, reqModel.Value, reqModel.ResourceID
	if caid == 0 {
		return output.JSON(c, output.MsgErr, "require caid")
	}
	if key == "" {
		return output.JSON(c, output.MsgErr, "require key")
	}
	u := user.GetUser(c)
	typ, env, zoneCode, _ := confgo.ConfuSrv.GetConfigTyp(caid)
	text, err := parse.GetParseManage(typ).Format([]byte(value))
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	if err := confgo.ConfuSrv.Add(caid, key, text, resourceID, u.Nickname, env, zoneCode, reqModel.IsPublic); err != nil {
		return output.JSON(c, output.MsgErr, "add error"+err.Error())
	}
	cmcApp, _ := confgo.ConfuSrv.CmcAppDetail(reqModel.Caid)
	meta, _ := json.Marshal(cmcApp)
	appevent.AppEvent.ConfgoItemCreateEvent(cmcApp.Aid, cmcApp.AppName, cmcApp.Env, cmcApp.ZoneCode, string(meta), u)
	return output.JSON(c, output.MsgOk, "add success")
}

// ItemList Get a common configuration block
func ItemList(c echo.Context) error {
	var err error
	reqModel := new(ReqItemList)
	if err = c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	var cc db.CmcConfig
	list, err := cc.List(reqModel.Env, reqModel.ZoneCode)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "success", list)
}

// ItemCheck ...
func ItemCheck(c echo.Context) error {
	var err error
	reqModel := new(db.CmcConfig)
	if err = c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	id, caid, key, value := reqModel.ID, reqModel.Caid, reqModel.Key, reqModel.Value
	if caid == 0 {
		return output.JSON(c, output.MsgErr, "require caid")
	}
	if key == "" {
		return output.JSON(c, output.MsgErr, "require key")
	}
	// if add public block, check key whether repeat
	if reqModel.IsPublic == 1 {
		var cc db.CmcConfig
		if cc.IsPublicRepeat(id, key) {
			return output.JSON(c, output.MsgErr, "公共配置名称已存在")
		}
	}
	// todo 校验key是否存在
	configItem, err := confgo.ConfuSrv.GetConfigItem(caid, key, id)
	if err != gorm.ErrRecordNotFound && err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	if configItem.ID != 0 {
		return output.JSON(c, output.MsgErr, "键值已存在")
	}
	_, err = confgo.GenConfig(caid, int(id), value, key)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "add success")
}

// UpdateAppConfigItem ...
func UpdateAppConfigItem(c echo.Context) error {
	var err error
	reqModel := new(db.CmcConfig)
	if err = c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	id, caid, key, value, rID := reqModel.ID, reqModel.Caid, reqModel.Key, reqModel.Value, reqModel.ResourceID
	if id == 0 {
		return output.JSON(c, output.MsgErr, "require id")
	}
	if key == "" {
		return output.JSON(c, output.MsgErr, "require key")
	}
	if value == "" {
		return output.JSON(c, output.MsgErr, "require value")
	}
	user := user.GetUser(c)
	if err := confgo.ConfuSrv.Update(id, caid, key, value, rID, user.Nickname); err != nil {
		return output.JSON(c, output.MsgErr, "update item err "+err.Error())
	}

	cmcApp, _ := confgo.ConfuSrv.CmcAppDetail(reqModel.Caid)
	meta, _ := json.Marshal(cmcApp)
	appevent.AppEvent.ConfgoItemUpdateEvent(cmcApp.Aid, cmcApp.AppName, cmcApp.Env, cmcApp.ZoneCode, string(meta), user)

	return output.JSON(c, output.MsgOk, "update success")
}

// DelAppConfigItem ...
func DelAppConfigItem(c echo.Context) error {
	var err error
	reqModel := new(db.CmcConfig)
	if err = c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	id := reqModel.ID
	if id == 0 {
		return output.JSON(c, output.MsgErr, "require id")
	}
	user := user.GetUser(c)
	if err := confgo.ConfuSrv.Del(id, user.Nickname); err != nil {
		return output.JSON(c, output.MsgErr, "del item err "+err.Error())
	}

	cmcApp, _ := confgo.ConfuSrv.CmcAppDetail(reqModel.Caid)
	meta, _ := json.Marshal(cmcApp)
	appevent.AppEvent.ConfgoItemDeleteEvent(cmcApp.Aid, cmcApp.AppName, cmcApp.Env, cmcApp.ZoneCode, string(meta), user)

	return output.JSON(c, output.MsgOk, "del success")
}

// DiffAppConfig ..
func DiffAppConfig(c echo.Context) error {
	reqModel := new(struct {
		OriginCid int `json:"origin_cid"`
		RafeCid   int `json:"rafe_cid"`
	})
	if err := c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	keys, err := confgo.ConfuSrv.GetDiffKeys(reqModel.OriginCid, reqModel.RafeCid)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	return output.JSON(c, output.MsgOk, "", keys)
}

// PublishConfig ...
func PublishConfig(c echo.Context) error {
	var err error
	reqModel := new(struct {
		db.CmcHistory
		Instances []string `json:"instances"`
		IsPick    bool     `json:"is_pick"`
	})
	if err = c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	cmcHistory := reqModel.CmcHistory

	if cmcHistory.Caid == 0 {
		return output.JSON(c, output.MsgErr, "caid不能为空")
	}
	if cmcHistory.Message == "" {
		return output.JSON(c, output.MsgErr, "发布日志不能为空")
	}

	// 获取应用信息
	cmc := db.CmcConfig{
		Caid: cmcHistory.Caid,
	}
	cmcApp, err := confgo.ConfuSrv.CmcAppDetail(cmcHistory.Caid)
	if err != nil {
		return output.JSON(c, output.MsgErr, "找不到应用")
	}
	if cmcApp.ID == 0 || cmcApp.Aid == 0 {
		return output.JSON(c, output.MsgErr, "找不到应用")
	}

	if !user.IsAdmin(c) {
		return output.JSON(c, output.MsgErr, "没有权限")
	}

	// 获取配置k-v列表
	appConfigKv, err := confgo.ConfuSrv.GetAppKVs(cmc.Caid, 0)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	text, md5, err := confgo.FormatByKvs(appConfigKv, string(cmcApp.Format), "")
	if err != nil {
		return output.JSON(c, output.MsgErr, "tomlTextByItems error"+err.Error())
	}

	// Increase the release time and version mark
	signText, signMd5, err := confgo.PublishSign(text, md5, string(cmcApp.Format))
	if err != nil {
		return output.JSON(c, output.MsgErr, "tomlTextByItems error"+err.Error())
	}

	cmcHistory.Aid = cmcApp.Aid
	cmcHistory.FileName = cmcApp.FileName
	cmcHistory.ZoneCode = cmcApp.ZoneCode
	cmcHistory.Env = cmcApp.Env
	cmcHistory.Text = text
	cmcHistory.OriginText = signText
	cmcHistory.Md5 = signMd5
	cmcHistory.EffectMd5 = md5
	cmcHistory.CreateTime = time.Now().Unix()
	cmcHistory.OpName = user.GetUser(c).Nickname

	var instanceList []string

	preNodes, _ := resource.Resource.GetAllAppNodeList(db.AppNode{
		AppName: cmcApp.AppName,
		Env:     cmcApp.Env,
	})

	for _, node := range preNodes {
		instanceList = append(instanceList, node.HostName)
	}

	// 是否是全量发布，否则前端选取的实例，需要和dayu的实例做对比
	if reqModel.IsPick {
		instanceSelect := reqModel.Instances
		instances := make([]string, 0)
		tmp := make(map[string]bool)
		for _, ins := range instanceSelect {
			tmp[ins] = true
		}
		for _, ins := range instanceList {
			if tmp[ins] {
				instances = append(instances, ins)
			}
		}
		if len(instances) != len(instanceSelect) {
			return output.JSON(c, output.MsgErr, "选取的实例在dayu中未完全匹配，请刷新实例列表后重试")
		}
		instanceList = instances
	}

	if len(instanceList) == 0 { // 容器发布没有部署组
		// xlog.Warn("no instance list", "appName", cmcApp.AppName, "file", cmcApp.FileName)
		return output.JSON(c, output.MsgErr, "未选择实例或该机房未部署")
	}

	// 获取应用治理端口
	appInfo, err := resource.Resource.GetApp(cmcApp.Aid)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	// 将配置存到etcd里面
	commonVal, err := confgo.PublishSrv.Publish(cmcApp.Env, cmcApp.ZoneCode, appInfo.GovernPort, cmcApp.AppName, cmcApp.FileName, cmcHistory.OriginText, instanceList, md5)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	// 注入公共配置后需要对比MD5
	if commonVal != "" {
		cmcHistory.Md5 = util.Md5Str(mergeGlobalConfig(commonVal, cmcHistory.OriginText))
	}

	// 添加发布历史
	tmp, err := json.Marshal(instanceList)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	cmcHistory.ApplyInstance = string(tmp)
	cmcHistory.FilePath = strings.Join([]string{conf.GetString("confgo.dir"), cmcApp.AppName, "config", cmcApp.FileName}, "/")
	diffKeys, err := confgo.Confgo.PublishRecordHistory(&cmcHistory, appConfigKv, commonVal)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	meta, _ := json.Marshal(cmcApp)
	appevent.AppEvent.ConfgoFilePublishEvent(cmcApp.Aid, cmcApp.AppName, cmcApp.Env, cmcApp.ZoneCode, string(meta), user.GetUser(c))

	return output.JSON(c, output.MsgOk, "发布成功", diffKeys)
}

// RollbackConfig Rollback for configuration items
func RollbackConfig(c echo.Context) error {
	var err error
	reqModel := new(db.CmcHistory)
	if err = c.Bind(reqModel); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	if reqModel.Caid == 0 {
		return output.JSON(c, output.MsgErr, "caid不能为空")
	}
	u := user.GetUser(c)

	// Find the last historical release version
	nowID, historyID, err := confgo.HistorySrv.GetPreHistory(reqModel.Caid)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	// Reset configuration item data (delete unpublished data first, then diff sync)
	if err = confgo.Confgo.Rollback(reqModel.Caid, nowID, historyID, u); err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}

	cmcApp, _ := confgo.ConfuSrv.CmcAppDetail(reqModel.Caid)
	meta, _ := json.Marshal(cmcApp)
	appevent.AppEvent.ConfgoFileRollbackEvent(cmcApp.Aid, cmcApp.AppName, cmcApp.Env, cmcApp.ZoneCode, string(meta), u)

	return output.JSON(c, output.MsgOk, "success")
}

// ConfigStatics ..
func ConfigStatics(c echo.Context) error {
	end := time.Now().Unix()
	start := end - 86400*30
	envCnt, cmcCnt, total, err := confgo.ConfuSrv.GetCmcStat(start, end)
	if err != nil {
		return output.JSON(c, output.MsgErr, err.Error())
	}
	resp := RespStatics{
		EnvCnt: make([]ConfigStaticsInfo, 0),
		CmcCnt: make([]ConfigStaticsInfo, 0),
		Total:  total,
	}

	for _, v := range envCnt {
		item := ConfigStaticsInfo{
			Name:  v.Env,
			Value: v.Cnt,
		}
		resp.EnvCnt = append(resp.EnvCnt, item)
	}
	for _, v := range cmcCnt {
		item := ConfigStaticsInfo{
			Name:  v.DayTime,
			Value: v.Cnt,
		}
		resp.CmcCnt = append(resp.CmcCnt, item)
	}

	return output.JSON(c, output.MsgOk, "success", resp)
}
