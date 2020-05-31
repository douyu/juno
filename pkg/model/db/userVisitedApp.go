package db

type UserVisitedApp struct {
	ID          int
	AppName     string `json:"app_name" gorm:"app_name"`
	UserName    string `json:"user_name" gorm:"user_name"`
	VisitedTime int64  `json:"visited_time" gorm:"column:visited_time"`
}

// TableName ...
func (UserVisitedApp) TableName() string {
	return "user_visited_app"
}
