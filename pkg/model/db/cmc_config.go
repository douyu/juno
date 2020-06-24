package db

import (
	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/pkg/model"
	"github.com/douyu/jupiter/pkg/store/gorm"
)

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
	Env        string           `json:"env"`
	ZoneCode   string           `json:"zone_code"`
	DiffKey    string           `json:"diff_key" gorm:"column:diff_key"`
}

// TableName ..
func (c *CmcConfig) TableName() string {
	return "cmc_config"
}

// List ...
func (c *CmcConfig) List(env, zoneCode string) (out []CmcConfig, err error) {
	sql := invoker.JunoMysql
	if env != "" {
		sql = sql.Where("env=?", env)
	}
	if zoneCode != "" {
		sql = sql.Where("zone_code=?", zoneCode)
	}
	err = sql.Where("is_public=? and status <> ?", 1, model.ItemStatusDel).Find(&out).Error
	return
}

// IsPublicRepeat check public repeat status
func (c *CmcConfig) IsPublicRepeat(id uint64, key string) (res bool) {
	var t CmcConfig
	sql := invoker.JunoMysql
	err := sql.Where("is_public = ? and `key`=? and id<>?", 1, key, id).First(&t).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return false
		}
		return true
	}
	if t.ID != 0 {
		return true
	}
	return false
}
