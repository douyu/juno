package view

type RespConfig struct {
	AppName string          `json:"app_name"`
	Aid     int             `json:"aid"`
	Config  []RespOneConfig `json:"config"`
}

type RespOneConfig struct {
	Caid     int    `json:"caid"`
	Env      string `json:"env"`
	ZoneCode string `json:"zone_code"`
	Content  string `json:"content"`
	AppName  string `json:"app_name"`
	Aid      int    `json:"aid"`
	Format   string `json:"format"`
	FileName string `json:"file_name"`
}
