package confgov2

import "github.com/jinzhu/gorm"

var (
	mysql *gorm.DB
)

// Init ..
func Init(d *gorm.DB) {
	mysql = d

	go clearLockPeriodically()
}
