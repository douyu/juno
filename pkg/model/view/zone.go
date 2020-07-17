package view

import "fmt"

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

type UniqZone struct {
	Env  string
	Zone string
}

func (u UniqZone) String() string {
	return fmt.Sprintf("%s.%s", u.Env, u.Zone)
}
