package db

// ZoneCode ...
type Zone struct {
	Id         int    `gorm:"not null;comment:'注释'"json:"id"`
	Env        string `json:"env"gorm:"not null"`
	RegionCode string `json:"region_code"gorm:"not null"`
	RegionName string `json:"region_name"gorm:"not null"`
	ZoneCode   string `json:"zone_code"gorm:"not null"`
	ZoneName   string `json:"zone_name"gorm:"not null"`
	CreateTime int64  `gorm:"not null;comment:'注释'"json:"create_time"`
	UpdateTime int64  `gorm:"not null;comment:'注释'"json:"update_time"`
	CreatedBy  int    `gorm:"not null;comment:'注释'"json:"created_by"`
	UpdatedBy  int    `gorm:"not null;comment:'注释'"json:"updated_by"`
}

// TableName 表名
func (Zone) TableName() string {
	return "zone"
}
