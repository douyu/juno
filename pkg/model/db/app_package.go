package db

// AppPackage ...
type AppPackage struct {
	Id         int    `json:"id" gorm:"not null;column:id"`   // id类型?
	Aid        int    `json:"aid" gorm:"not null;column:aid"` // id类型?
	Name       string `json:"name" gorm:"not null;column:name"`
	Branch     string `json:"branch" gorm:"not null;column:branch"`
	Version    string `json:"version" gorm:"not null;column:version"`
	Revision   string `json:"revision" gorm:"not null;column:revision"`
	Packages   string `json:"packages" gorm:"not null;type:text"`
	UpdateTime int64  `json:"updateTime" gorm:"not null;column:update_time"` // 时间类型?
}

// TableName ...
func (t *AppPackage) TableName() string {
	return "app_package"
}
