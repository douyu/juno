package db

// AppViewHistory 应用浏览历史记录
type AppViewHistory struct {
	ModelT
	UID     uint   `json:"uid"`
	Aid     uint   `json:"aid"`
	AppName string `json:"appName"`
}

// TableName ..
func (AppViewHistory) TableName() string {
	return "app_view_history"
}
