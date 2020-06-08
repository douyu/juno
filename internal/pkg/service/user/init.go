package user

import "github.com/douyu/jupiter/pkg/store/gorm"

var (
	User    *user
	Session *userSession
)

func Init(db *gorm.DB) {
	initGob()
	User = InitUser(db)
	Session = InitUserSession()
	return
}
