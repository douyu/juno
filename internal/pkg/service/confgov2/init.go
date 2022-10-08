package confgov2

import "github.com/douyu/jupiter/pkg/store/gorm"

var (
	mysql *gorm.DB
)

// Init ..
func Init(d *gorm.DB) {
	mysql = d

	go clearLockPeriodically()
}
