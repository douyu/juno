package view

type (
	WorkerHeartbeat struct {
		IP         string `json:"ip"`
		Port       int    `json:"port"`
		HostName   string `json:"host_name"`
		RegionCode string `json:"region_code"`
		RegionName string `json:"region_name"`
		ZoneCode   string `json:"zone_code"`
		ZoneName   string `json:"zone_name"`
		Env        string `json:"env"`
	}
)
