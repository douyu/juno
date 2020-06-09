package db

import (
	"github.com/douyu/juno/internal/pkg/model"
)

// CmcAppView ..
type CmcAppView struct {
	ID         int                  `json:"id" gorm:"column:id"`
	Aid        int                  `json:"aid" gorm:"column:aid"`
	FileName   string               `json:"file_name" gorm:"column:file_name"`
	ZoneCode   string               `json:"zone_code"`
	Env        string               `json:"env"`
	Format     model.ConfigFormat   `json:"format" gorm:"column:format"`
	Language   model.ConfigLanguage `json:"language" gorm:"column:language"`
	AppName    string               `json:"app_name"`
	Name       string               `json:"name"`
	WebURL     string               `json:"web_url"`
	UpdateTime int64                `json:"update_time"`
	Lang       string               `json:"lang"`
	Create     bool                 `json:"create"`
	Envs       []string             `json:"envs"`
	CreateTime int64                `json:"create_time"`
}

// CmcAppLog ...
type CmcAppLog struct {
	ID         int    `json:"id"`
	Caid       int    `json:"caid"`
	Aid        int    `json:"aid"`
	AppName    string `json:"app_name"`
	FileName   string `json:"file_name"`
	ZoneCode   string `json:"idc_code"`
	Toml       string `json:"toml" gorm:"type:longtext"`
	OriginToml string `json:"origin_toml" gorm:"type:longtext"`
	OpType     int    `json:"op_type"`
	OpTime     int64  `json:"op_time"`
	OpName     string `json:"op_name"`
	Env        string `json:"env"`
}

// CmcApp ..
type CmcApp struct {
	ID         int                  `json:"id" gorm:"column:id"`
	Aid        int                  `json:"aid" gorm:"column:aid"`
	AppName    string               `json:"app_name" gorm:"column:app_name"`
	FileName   string               `json:"file_name" gorm:"column:file_name"`
	ZoneCode   string               `json:"idc_code"`
	Env        string               `json:"env"`
	Format     model.ConfigFormat   `json:"format" gorm:"column:format"`
	Language   model.ConfigLanguage `json:"language" gorm:"column:language"`
	NativeText string               `json:"native_text"`
	NativeTime int64                `json:"native_time"`
	UpdateTime int64                `json:"update_time" gorm:"column:update_time"`
	CreateTime int64                `json:"create_time" gorm:"column:create_time"`
}

// TableName ..
func (t *CmcApp) TableName() string {
	return "cmc_app"
}

// CmcConfig ...
type CmcConfig struct {
	ID         uint64           `gorm:"column:id" json:"id" form:"id"`
	Caid       int              `gorm:"column:caid" json:"caid" form:"caid"`
	Prefix     string           `gorm:"column:prefix" json:"prefix"`
	Key        string           `gorm:"column:key" json:"key"`
	Value      string           `gorm:"type:longtext" json:"value"`
	ResourceID int              `gorm:"column:resource_id" json:"resource_id"`
	IsResource int              `gorm:"column:is_resource" json:"is_resource"`
	IsPublic   int              `gorm:"column:is_public" json:"is_public"` // Is it a public resource
	IsWatch    int              `gorm:"column:is_watch" json:"is_watch"`
	Status     model.ItemStatus `json:"status"`
	UpdateTime int64            `json:"update_time"`
	OpName     string           `json:"op_name"`
	DiffKey    string           `json:"diff_key" gorm:"column:diff_key"`
}

// TableName ..
func (c CmcConfig) TableName() string {
	return "cmc_config"
}

type ConfigVal struct {
	ID         int              `json:"id"`
	Value      string           `json:"value"`
	IsResource bool             `json:"is_resource"`
	ResourceID int              `json:"resource_id"`
	Prefix     string           `json:"prefix"`
	Type       string           `json:"type"`
	Status     model.ItemStatus `json:"status"`
	Comment    string           `json:"comment"`
	SourceTyp  int              `json:"source_typ"`
}

type ConfigData struct {
	Key string `json:"key"`
	ConfigVal
}

// CmcResource表cmc_resource的结构
type CmcResourceItem struct {
	CmcResource
	DepNum int `json:"dep_num"`
}

// CmcResource表cmc_resource的结构
type CmcResource struct {
	Id         uint64 `gorm:"column:id" json:"id"`
	Name       string `gorm:"column:name" json:"name"`
	ZoneCode   string `gorm:"column:idc_code" json:"idc_code"`
	Env        string `gorm:"column:env" json:"env"`
	Type       string `gorm:"column:type" json:"type"`
	Value      string `gorm:"column:value" json:"value"`
	ValueType  string `gorm:"column:value_type" json:"value_type"`
	Desc       string `json:"desc"`
	UpdateTime int64  `gorm:"column:update_time" json:"update_time"`
	CreateTime int64  `json:"create_time"`
	OpName     string `json:"op_name"`
	IsShow     int64  `json:"is_show"`   // '是否展示：1展示 2不展示',
	IsCommon   int64  `json:"is_common"` // '是否是公共资源：1是 2不是'
}

// TableName ..
func (r *CmcResource) TableName() string {
	return "cmc_resource"
}

type ConfigDiffData struct {
	Key    string `json:"key"`
	OldVal string `json:"old_val"`
	NewVal string `json:"new_val"`
	OpType string `json:"op_type"`
}

type DiffText struct {
	PreContent    string `json:"pre_content"`
	Content       string `json:"content"`
	CommonContent string `json:"common_content"`
}

// CmcPublishLog表cmc_publish_log的结构
type CmcPublishLog struct {
	Id         int    `json:"id" gorm:"column:id"`                 // id类型?
	HistoryId  int    `json:"history_id" gorm:"column:history_id"` // id类型?
	Type       int    `json:"type" gorm:"column:type"`
	CreateTime int64  `json:"create_time" gorm:"column:create_time"`
	DiffText   string `json:"diff_text" gorm:"type:longtext"`
}

// TableName ..
func (t *CmcPublishLog) TableName() string {
	return "cmc_publish_log"
}

// App ..
type App struct {
	AppName  string   `json:"appName"`
	Aid      int      `json:"aid"`
	FileList []string `json:"fileList"`
}

// CmcHistoryItem ...
type CmcHistoryItem struct {
	ID           int    `gorm:"column:id" json:"id"`
	Caid         int    `json:"caid"`
	KeyId        int    `gorm:"column:key_id" json:"key_id"`
	CmcHistoryId int    `gorm:"column:cmc_history_id" json:"cmc_history_id"`
	Aid          int    `gorm:"column:aid" json:"aid"`
	AppName      string `json:"app_name" gorm:"column:app_name"`
	ZoneCode     string `gorm:"column:idc_code" json:"idc_code"`
	Env          string `gorm:"column:env" json:"env"`
	Key          string `gorm:"column:key" json:"key"`
	Value        string `gorm:"type:longtext" json:"toml"`
	CreateTime   int64  `gorm:"column:create_time" json:"create_time"`
	OpName       string `json:"op_name"`
}

// TableName ..
func (c CmcHistoryItem) TableName() string {
	return "cmc_history_item"
}

// CmcHistory ...
type CmcHistory struct {
	ID            int    `gorm:"column:id" json:"id"`
	Caid          int    `json:"caid"`
	Aid           int    `gorm:"column:aid" json:"aid"`
	AppName       string `json:"app_name" gorm:"column:app_name"`
	ZoneCode      string `gorm:"column:zone_code" json:"zone_code"`
	Env           string `gorm:"column:env" json:"env"`
	FileName      string `gorm:"column:file_name" json:"file_name"`
	Md5           string `gorm:"column:md5" json:"md5"`
	EffectMd5     string `gorm:"column:effect_md5" json:"effect_md5"`
	Text          string `gorm:"type:longtext" json:"toml"`
	Message       string `json:"message"`
	CreateTime    int64  `gorm:"column:create_time" json:"create_time"`
	OpName        string `json:"op_name"`
	OriginText    string `gorm:"type:longtext" json:"origin_toml"`
	ApplyInstance string `json:"apply_instance"`
	FilePath      string `json:"file_path"`
}

// TableName ..
func (c CmcHistory) TableName() string {
	return "cmc_history"
}

// CmcConfigLog ..
type CmcConfigLog struct {
	ID         int                 `json:"id" gorm:"column:id"`
	Caid       int                 `gorm:"column:caid" json:"caid" form:"caid"`
	Key        string              `json:"key" gorm:"column:key"`
	OldValue   string              `json:"old_value" gorm:"type:longtext"`
	NewValue   string              `json:"new_value" gorm:"type:longtext"`
	OpType     model.ItemLogStatus `json:"op_type" gorm:"column:op_type"`
	UpdateTime int64               `json:"update_time" gorm:"column:update_time"`
	OpName     string              `json:"op_name" gorm:"column:op_name"`
}

// TableName ..
func (t *CmcConfigLog) TableName() string {
	return "cmc_config_log"
}

// DeployInstance ..
type DeployInstance struct {
	HostName         string `json:"hostname"`
	MD5              string `json:"md5"`
	Timestamp        int64  `json:"timestamp"`
	PubID            int    `json:"pub_id"`
	Message          string `json:"message"`
	IsLatest         bool   `json:"is_latest"`
	IsUse            bool   `json:"is_use"`
	IsEffect         bool   `json:"is_effect"`
	Params           string `json:"params"`
	ZoneCode         string `json:"idc_code"`
	ProcessStartTime int64  `json:"process_start_time"`
}

// EtcdInstance ..
type EtcdInstance struct {
	Host      string `json:"host"`
	MD5       string `json:"md5"`
	EffectMD5 string `json:"effect_md5"`
	Timestamp int64  `json:"timestamp"`
	Params    string `json:"params"`
	ZoneCode  string `json:"idc_code"`
}

// IdcSrv ..
type IdcSrv struct {
	ID         int    `json:"id" gorm:"column:id"`             // id类型?
	ZoneCode   string `json:"idc_code" gorm:"column:idc_code"` // id类型?
	SrvType    int    `json:"srv_type" gorm:"column:srv_type"`
	SrvConfig  string `json:"srv_config" gorm:"column:srv_config"`
	CreateTime int64  `json:"create_time" gorm:"column:create_time"` // 时间类型?
	UpdateTime int64  `json:"update_time" gorm:"column:update_time"` // 时间类型?
	CreatedBy  int    `json:"created_by" gorm:"column:created_by"`
	UpdatedBy  int    `json:"updated_by" gorm:"column:updated_by"`
}

// TableName ..
func (t *IdcSrv) TableName() string {
	return "idc_srv"
}

// ConfigStatus ..
type ConfigStatus struct {
	FileName   string `json:"file_name"`
	Md5        string `json:"md5"`
	Hostname   string `json:"hostname"`
	ZoneCode   string `json:"idc_code"`
	Timestamp  int64  `json:"timestamp"`
	EffectMD5  string `json:"effect_md5"`
	Env        string `json:"env"`
	IP         string `json:"ip"`
	HealthPort string `json:"health_port"`
}

// CmcUseStatus ..
type CmcUseStatus struct {
	ID       int    `json:"id" gorm:"column:id"`
	Aid      int32  `json:"aid" gorm:"column:aid"` // aid
	Caid     int    `json:"caid" gorm:"column:caid"`
	AppName  string `json:"app_name" gorm:"column:app_name"`
	Hostname string `json:"hostname" gorm:"column:hostname"`
	Env      string `json:"env" gorm:"column:env"`
	ZoneCode string `json:"zone_code" gorm:"column:zone_code"`
	Content  string `json:"content" gorm:"column:content"`
	Extra    string `json:"extra" gorm:"column:extra"`
	IsUse    int    `json:"is_use" gorm:"column:is_use"`
	UseTyp   string `json:"use_typ" gorm:"column:use_typ"`
}

// TableName ..
func (t *CmcUseStatus) TableName() string {
	return "cmc_use_status"
}

// AppNodeInfo ..
type AppNodeInfo struct {
	HostName   string `json:"host_name"`
	CreateTime int64  `json:"create_time"`
	UpdateTime int64  `json:"update_time"`
}

// AppCmcStat ..
type AppCmcStat struct {
	Env string `json:"env"`
	Cnt int    `json:"cnt"`
}

// CmcCnt ..
type CmcCnt struct {
	DayTime string `json:"day_time" gorm:"day_time"`
	Cnt     int    `gorm:"cnt" json:"cnt"`
}
