package model

// ConfigFormat 配置文件类型
type ConfigFormat string

const (
	ConfigFormatToml       ConfigFormat = "toml"
	ConfigFormatYaml                    = "yaml"
	ConfigFormatJson                    = "json"
	ConfigFormatXml                     = "xml"
	ConfigFormatProperties              = "properties"
	ConfigFormatIni                     = "ini"
)

// ConfigLanguage 配置文件语言客户端
type ConfigLanguage string

const (
	ConfigLanguageGo   ConfigLanguage = "go"
	ConfigLanguageJava                = "java"
	ConfigLanguagePHP                 = "php"
	ConfigLanguageLua                 = "lua"
)

// ItemStatus 配置项状态 1 已发布 2 新增 3 更新 4 删除
type ItemStatus int

const (
	ItemStatusPub    ItemStatus = 1
	ItemStatusNew               = 2
	ItemStatusUpdate            = 3
	ItemStatusDel               = 4
)

// ItemLogStatus 配置项状态 1 新增 2 更新 3 删除 4 发布 5 回滚
type ItemLogStatus int

const (
	ItemLogStatusNew      ItemLogStatus = 1
	ItemLogStatusUpdate                 = 2
	ItemLogStatusDel                    = 3
	ItemLogStatusPublish                = 4
	ItemLogStatusRollback               = 5
)
