package db

type Url struct {
	Model
	URL  int    `gorm:"column:method;size:100;default:'';not null;"`
	Name string `gorm:"not null;"json:"name"`
}

func (a Url) TableName() string {
	return "url"
}

type UrlList []Url
