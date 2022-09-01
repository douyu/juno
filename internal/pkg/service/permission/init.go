package permission

import "github.com/douyu/jupiter/pkg/store/gorm"

type Option struct {
	DB                 *gorm.DB
	GitlabOAuthApiUrl  string
	GitlabOAuthEnabled bool
	ProductionEnvs     []string
}

func Init(o Option) {
	initUserGroup(o.DB)
	initAppGroup(o.DB)
	initUser(o.DB)
	initPermission(o)
}
