// Copyright 2020 Douyu
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package cfg

import (
	"time"

	"go.uber.org/zap"
)

// Auth ...
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

type Register struct {
	Enable         bool
	Endpoints      []string
	ConnectTimeout time.Duration `json:"connectTimeout"`
	Secure         bool          `json:"secure"`
	BasicAuth      bool          `json:"basicAuth" toml:"basicAuth"`
	Password       string        `json:"password" toml:"password"`
	UserName       string        `json:"userName" toml:"userName"`
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
	Mode           string
	SecretKey      string
	ProductionEnvs []string
}

// Server Server
type Server struct {
	Http   ServerSchema
	Govern ServerSchema
}

type ClientProxy struct {
	HttpRouter  HttpRouter
	SingleProxy SingleProxy
	MultiProxy  []MultiProxy
}

type HttpRouter struct {
	GovernConfig string
}

// SingleProxy ..
type SingleProxy struct {
	DefaultEtcd  Etcd
	RegisterEtcd Etcd
}

// MultiProxy ..
type MultiProxy struct {
	Env          string
	ZoneCode     string
	Stream       ProxyStream
	HTTP         HTTPProxy
	DefaultEtcd  Etcd
	RegisterEtcd Etcd
}

// ServerProxy ..
type ServerProxy struct {
	Name         string
	Stream       ProxyStream
	HTTPServer   ServerSchema
	GrpcServer   ServerSchema
	GovernServer ServerSchema
	HeartBeat    HeartBeat
	DefaultEtcd  Etcd
	RegisterEtcd Etcd
	Prometheus   HTTPProxy
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
	Enable     bool          `json:"enable"`
	ListenAddr string        `json:"listenAddr"`
	Endpoints  []string      `json:"endpoints"`
	Namespace  string        `json:"namespace"`
	Timeout    time.Duration `json:"timeout"`
	TLS        TLS           `json:"tls"`
	BasicAuth  bool          `json:"basicAuth"`
	Password   string        `json:"password"`
	UserName   string        `json:"userName"`
}

// TLS ..
type TLS struct {
	Cert   string `json:"cert"`
	Key    string `json:"key"`
	CaCert string `json:"cacert"`
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

type Pprof struct {
	TmpPath     string
	TokenHeader string
	Token       string
	Timeout     time.Duration
	Debug       bool
	StorePath   string
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

// Configure ..
type Configure struct {
	Dirs     []string `json:"dirs"`
	Prefixes []string `json:"prefixes"`
	Agent    struct {
		Port int `json:"port"`
	} `json:"agent"`
}

type Agent struct {
	Port   int    `toml:"port"`
	Secret string `toml:"secret"`
}

// Casbin ..
type Casbin struct {
	Enable           bool
	Debug            bool
	Model            string
	AutoLoad         bool
	AutoLoadInternal int
	ResourceFile     string
}

// HTTPProxy ..
type HTTPProxy struct {
	Enable            bool
	ListenAddr        string
	Scheme            string
	Backend           string
	DisableKeepAlives bool
	MaxIdleConns      int
	MaxIdelPerHost    int
	Timeout           int
}

type Logger struct {
	Biz    LoggerInfo
	System LoggerInfo
}

type LoggerInfo struct {
	// Dir 日志输出目录
	Dir string
	// Name 日志文件名称
	Name string
	// Level 日志初始等级
	Level string
	// 日志初始化字段
	Fields []zap.Field
	// 是否添加调用者信息
	AddCaller  bool
	Interval   time.Duration
	CallerSkip int
	Async      bool
	Debug      bool
}

// Assist ..
type Assist struct {
	Action Action
}

// Action ..
type Action struct {
	Enable bool
	URL    string
}

type GrpcTest struct {
	Enable   bool
	ProtoDir string
}

// AppLog ..
type AppLog struct {
	Enable  bool
	Mode    string
	Aliyun  AppLogAliyun
	Default AppLogDefault
}

// AppLogAliyun ...
type AppLogAliyun struct {
	Key             string
	Secret          string
	RoleArn         string
	RoleSessionName string
	RegionID        string `json:"regionId" toml:"regionId"`
	LoginURL        string `json:"loginUrl" toml:"loginUrl"`
}

// AppLogDefault ..
type AppLogDefault struct {
	DashboardUrl string
	LogStoreUrl  string
	Project      []AppLogDefaultProject
}

// AppLogDefaultProject ..
type AppLogDefaultProject struct {
	Project         string
	Env             []string
	LogStoreConsole string
	LogStoreJupiter string
	LogStoreBiz     string
}

type ProxyAuth struct {
	Token string
}

type CodePlatform struct {
	Token string
}

type Notice struct {
	Email struct {
		ServerHost   string   `json:"serverHost" toml:"serverHost"`
		ServerPort   int      `json:"serverPort" toml:"serverPort"`
		FromEmail    string   `json:"fromEmail" toml:"fromEmail"`
		FromPasswd   string   `json:"fromPasswd" toml:"fromPasswd"`
		Subject      string   `json:"subject" toml:"subject"`
		TemplatePath string   `json:"templatePath" toml:"templatePath"`
		Toers        []string `json:"toers" toml:"toers"`
		CCers        []string `json:"cCers" toml:"cCers"`
	}
	Ding struct {
		WebHook string `json:"webHook" toml:"webHook"`
	} `json:"ding" toml:"ding"`
}

type TestPlatform struct {
	Enable bool
	Worker struct {
		LocalQueueDir    string
		HeartbeatTimeout time.Duration
	}
}
