package db

// AppCmcStat ..
type AppCmcStat struct {
	Env string `json:"env"`
	Cnt int    `json:"cnt"`
}

// CmcCnt ..
type CmcCnt struct {
	DayTime string `json:"day_time" gorm:"day_time"`
	Cnt     int    `gorm:"cnt" json:"cnt"`
}
