package db

// UserRelation for relation between user and other cases
type UserRelation struct {
	ID         int   `gorm:"not null;comment:'注释'"json:"id"`
	Uid        int   `gorm:"not null;comment:'注释'"json:"uid"`
	Bid        int   `gorm:"not null;comment:'注释'"json:"bid"`
	Type       int   `gorm:"not null;comment:'注释'"json:"type"`
	CreateTime int64 `gorm:"not null;comment:'注释'"json:"createTime"`
	UpdateTime int64 `gorm:"not null;comment:'注释'"json:"updateTime"`
	DeleteTime int64 `gorm:"not null;comment:'注释'"json:"deleteTime"`
}

// TableName ...
func (UserRelation) TableName() string {
	return "user_relation"
}
