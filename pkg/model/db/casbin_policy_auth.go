package db

import (
	"database/sql/driver"
	"encoding/json"
	"github.com/jinzhu/gorm"
)

type (
	CasbinPolicyObject struct {
		URL     *string `json:"url,omitempty"`
		AppName *string `json:"app_name,omitempty"`
		Menu    *string `json:"menu,omitempty"`
	}

	CasbinPolicyType string

	CasbinPolicyAuth struct {
		gorm.Model
		Sub  string           `gorm:"not null;"json:"sub"`
		Obj  string           `gorm:"type:varchar(255);not null;"json:"obj"`
		Act  string           `gorm:"type:varchar(255);not null;"json:"act"`
		Type CasbinPolicyType `gorm:"not null;"json:"type"`
	}
)

var (
	CasbinPolicyTypeMenu CasbinPolicyType = "menu"
	CasbinPolicyTypeApp  CasbinPolicyType = "app"
	CasbinPolicyTypeAPI  CasbinPolicyType = "api"

	AppPermAppRead     = "app:read"
	AppPermConfigRead  = "config:read"
	AppPermConfigWrite = "config:write"
	AppPermMonitorRead = "monitor:read"
	AppPermPProfRead   = "pprof:read"
	AppPermPProfRun    = "pprof:run"
)

func (c CasbinPolicyAuth) TableName() string {
	return "casbin_policy_auth"
}

func (c *CasbinPolicyObject) Scan(src interface{}) error {
	return json.Unmarshal(src.([]byte), c)
}

func (c CasbinPolicyObject) Value() (driver.Value, error) {
	val, err := json.Marshal(c)
	return string(val), err
}
