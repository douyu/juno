package db

type Model struct {
	Id         int   `gorm:"not null;"json:"id"`
	CreateTime int64 `gorm:"not null;"json:"create_time"`
	UpdateTime int64 `gorm:"not null;"json:"update_time"`
	DeleteTime int64 `gorm:"not null;"json:"delete_time"`
}
