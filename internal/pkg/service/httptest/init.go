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
		Client *resty.Client
	}
)

func Init(opt Option) {
	option = opt
	option.Client = resty.New()
}
