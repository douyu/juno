package view

type SelectData struct {
	Title string `json:"name"`
	Value string `json:"value"`
}

type (
	RespEnvZone map[string][]RespEnvZoneItem // env => zones

	RespEnvZoneItem struct {
		ZoneCode string `json:"zone_code"`
		ZoneName string `json:"zone_name"`
	}
)
