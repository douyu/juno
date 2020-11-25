package db

import (
	"time"

	"github.com/jinzhu/gorm"
)

type (
	WorkerNode struct {
		gorm.Model

		HostName      string    `json:"host_name"`
		RegionCode    string    `json:"region_code"`
		RegionName    string    `json:"region_name"`
		ZoneCode      string    `json:"zone_code"`
		ZoneName      string    `json:"zone_name"`
		IP            string    `json:"ip"`
		Port          int       `json:"port"`
		Env           string    `json:"env"`
		LastHeartbeat time.Time `json:"last_heartbeat"`
	}
)

func (WorkerNode) TableName() string {
	return "worker_node"
}
