package confgo

import (
	"github.com/douyu/jupiter/pkg/store/gorm"
)

type cmc struct{}

type confu struct {
	DB *gorm.DB
}
