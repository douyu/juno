package grpcgovern

import "encoding/json"

//
// CREATE TABLE `register_server` (
// `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
// `idc_id` int(10) NOT NULL,
// `app_name` varchar(200) NOT NULL DEFAULT '',
// `reg_key` text NOT NULL,
// `reg_value` text NOT NULL,
// `schema` varchar(200) NOT NULL DEFAULT '',
// `addr` varchar(200) NOT NULL DEFAULT '',
// `ip` varchar(200) NOT NULL DEFAULT '',
// `port` int(10) NOT NULL,
// `enable` int(10) NOT NULL,
// `weight` int(10) NOT NULL,
// `group` varchar(200) NOT NULL DEFAULT '',
// `methods` text,
// `routers` text NOT NULL,
// `balance` varchar(200) NOT NULL DEFAULT '',
// `process_strart_at` int(10) NOT NULL,
// `created_at` int(10) NOT NULL,
// `updated_at` int(10) NOT NULL,
// PRIMARY KEY (`id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

type ProviderStore struct {
	ID             int32           `gorm:"not null"json:"id"`
	AppName        string          `gorm:"not null"json:"appName"`
	RegKey         string          `gorm:"not null"json:"regKey"`
	RegValue       json.RawMessage `gorm:"not null;type:text"json:"regValue"`
	Region         string          `gorm:"not null"json:"region"`
	Zone           string          `gorm:"not null"json:"zone"`
	Scheme         string          `gorm:"not null"json:"scheme"`
	Address        string          `gorm:"not null"json:"address"`
	IP             string          `gorm:"not null"json:"ip"`
	HostName       string          `gorm:"not null"json:"hostName"`
	Type           string          `gorm:"not null"json:"type"`
	Enable         int8            `gorm:"not null"json:"enable"`
	Group          string          `gorm:"not null"json:"group"`
	Weight         int64           `gorm:"not null"json:"weight"`
	ProcessStartAt int64           `gorm:"not null"json:"processStartAt"`
	VcsInfo        string          `gorm:"not null;"json:"vcsInfo"`
	CreateAt       int64           `gorm:"not null"json:"createAt"`
	UpdateAt       int64           `gorm:"not null"json:"updateAt"`
}

func (p *ProviderStore) TableName() string {
	return "register_server"
}

type ConfigProviderStore struct {
	ID             int32
	AppName        string
	RegKey         string
	RegValue       string `gorm:"type:text"`
	Schema         string
	Address        string
	Enable         int8
	Group          string
	Weight         int64
	ProcessStartAt int64
	CreateAt       int64
	UpdateAt       int64
}

func (c *ConfigProviderStore) TableName() string {
	return "config_server"
}
