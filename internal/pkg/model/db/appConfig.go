package db

import "encoding/json"

// AppTopology ...
type AppTopology struct {
	ID         int    `gorm:"not null;" json:"id"`
	Aid        int    `gorm:"not null;" json:"aid"`
	AppName    string `gorm:"not null;" json:"app_name" query:"app_name"`
	RegionCode string `gorm:"not null;" json:"region_code" query:"region_code"`
	ZoneCode   string `gorm:"not null;" json:"zone_code" query:"zone_code"`
	Env        string `gorm:"not null;" json:"env" query:"env"`
	FileName   string `gorm:"not null;" json:"file_name"`
	Addr       string `gorm:"not null;" json:"addr" query:"addr"`
	IP         string `gorm:"not null;" json:"ip"`
	Port       string `gorm:"not null;" json:"port"`
	Name       string `gorm:"not null;" json:"name" query:"name"`
	Type       string `gorm:"not null;" json:"type"`
	Info       string `gorm:"not null;" json:"info"`
	UpdateTime int64  `gorm:"not null;" json:"update_time"`
	UpdatedBy  int    `gorm:"not null;" json:"updated_by"`
	Extra      string `gorm:"not null;type:text" json:"extra"`
}

// TableName ...
func (AppTopology) TableName() string {
	return `app_topology`
}

func (t *AppTopology) String() string {
	tmp, err := json.Marshal(t)
	if err != nil {
		return ""
	}
	return string(tmp)
}
