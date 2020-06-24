package confgov2

import "github.com/jinzhu/gorm"

var (
	mysql *gorm.DB
)

func Init(d *gorm.DB) {
	mysql = d
}
