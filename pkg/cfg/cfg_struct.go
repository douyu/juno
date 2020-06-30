package cfg

import "time"

type Auth struct {
	// Auth
	LoginCookieName                  string
	LoginMaximumInactiveLifetimeDays int
	LoginMaximumLifetimeDays         int
	TokenRotationIntervalMinutes     int
	DisableLoginForm                 bool
	DisableSignoutMenu               bool
	SignoutRedirectUrl               string
	OauthAutoLogin                   bool
	OauthStateCookieMaxAge           int
	ApiKeyMaxSecondsToLive           int
}

type ServerSchema struct {
	Host           string
	Port           int
	Domain         string
	RootUrl        string
	StaticRootPath string
	EnableGzip     bool
}

type App struct {
	SecretKey string
}

// Admin Server
type Server struct {
	Http   ServerSchema
	Govern ServerSchema
}

// Proxy
type Proxy struct {
	Stream       ProxyStream
	HttpServer   ServerSchema
	GrpcServer   ServerSchema
	GovernServer ServerSchema
	HeartBeat    HeartBeat
	Etcd         Etcd
}

type GrafanaProxy struct {
	Enable bool
	Name   string
}

type Gateway struct {
	Enable bool
	Name   string
}

type Etcd struct {
	Enable    bool
	Endpoints []string
}

type ProxyStream struct {
	Enable    bool
	ProxyAddr []string
	Debug     bool
}

type HeartBeat struct {
	Enable     bool          `json:"enable"`
	Debug      bool          `json:"debug"`
	Addr       string        `json:"addr"`
	Internal   time.Duration `json:"internal"`
	HostName   string        `json:"host_name"`
	RegionCode string        `json:"region_code"`
	RegionName string        `json:"region_name"`
	ZoneCode   string        `json:"zone_code"`
	ZoneName   string        `json:"zone_name"`
	Env        string        `json:"env"`
}

type Database struct {
	Enable bool
	// DSN地址: mysql://root:secret@tcp(127.0.0.1:3307)/mysql?timeout=20s&readTimeout=20s
	DSN string `json:"dsn" toml:"dsn"`
	// Debug开关
	Debug bool `json:"debug" toml:"debug"`
	// 最大空闲连接数
	MaxIdleConns int `json:"maxIdleConns" toml:"maxIdleConns"`
	// 最大活动连接数
	MaxOpenConns int `json:"maxOpenConns" toml:"maxOpenConns"`
	// 连接的最大存活时间
	ConnMaxLifetime time.Duration `json:"connMaxLifetime" toml:"connMaxLifetime"`
	// 创建连接的错误级别，=panic时，如果创建失败，立即panic
	OnDialError string `json:"level" toml:"level"`
	// 慢日志阈值
	SlowThreshold time.Duration `json:"slowThreshold" toml:"slowThreshold"`
	// 拨超时时间
	DialTimeout time.Duration `json:"dialTimeout" toml:"dialTimeout"`
	// 关闭指标采集
	DisableMetric bool `json:"disableMetric" toml:"disableMetric"`
	// 关闭链路追踪
	DisableTrace bool `json:"disableTrace" toml:"disableTrace"`
}
