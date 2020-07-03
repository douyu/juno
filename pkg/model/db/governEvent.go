package db

import "time"

type RegisterType int8

type ListProviderEventsReq struct {
	Cursor string `json:"cursor"`
	Number int    `json:"num"`
	Type   RegisterType
}

type ProviderRegisterEvent struct {
	ID        uint         `gorm:"primary_key" json:"id"`
	CreatedAt time.Time    `json:"createdAt"`
	UpdatedAt time.Time    `json:"updatedAt"`
	DeletedAt *time.Time   `sql:"index" json:"deletedAt"`
	AppName   string       `json:"appName"`
	Schema    string       `json:"schema"`
	Address   string       `json:"address"`
	Type      RegisterType `json:"type"`
}

type ListProviderEvents struct {
	Events     []ProviderRegisterEvent `json:"events"`
	NextCursor string                  `json:"nextCursor"`
}

type ListProviderEventsResp struct {
	Code int                `json:"code"`
	Msg  string             `json:"msg"`
	Data ListProviderEvents `json:"data"`
}
