package httptest

import (
	"github.com/go-resty/resty/v2"
	"github.com/jinzhu/gorm"
)

var (
	option Option
)

type (
	Option struct {
		DB     *gorm.DB
		client *resty.Client
	}
)

func Init(opt Option) {
	option = opt
	option.client = resty.New()
}
