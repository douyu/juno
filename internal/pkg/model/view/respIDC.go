package view

import "github.com/douyu/juno/internal/pkg/model/db"

type RespIDCList struct {
	RegionCode string `json:"regionCode" gorm:"column:region_code"`
	RegionName string `json:"regionName" gorm:"column:region_name"`
	ZoneCode   string `json:"zone_code" gorm:"column:zone_code"`
}

type RespIDCStructure struct {
	JunoZone         string            `json:"junoZone"`
	GovernStatusList []GovernIdcStatus `json:"governIdcList"`
	IDCList          []db.Zone         `json:"idcList"`
}

type GovernIdcStatus struct {
	ZoneCode string `json:"zone_code"`
	Status   string `json:"status"`
	Message  string `json:"message"`
}
