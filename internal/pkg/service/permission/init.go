package permission

import "github.com/jinzhu/gorm"

func Init(db *gorm.DB) {
	initUserGroup(db)
	initAppGroup(db)
	initUser(db)
}
