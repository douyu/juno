package httptest

import (
	"github.com/douyu/jupiter/pkg/store/gorm"
	"github.com/go-resty/resty/v2"
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
