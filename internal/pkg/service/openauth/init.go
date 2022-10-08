package openauth

import (
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/store/gorm"
)

var (
	OpenAuthService *openAuthService
)

func Init(dbConn *gorm.DB) {
	OpenAuthService = &openAuthService{
		db:           dbConn,
		accessTokens: make(map[string]db.AccessToken),
	}

	OpenAuthService.init()
}
