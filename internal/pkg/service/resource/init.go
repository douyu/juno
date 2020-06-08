package resource

import "github.com/douyu/jupiter/pkg/store/gorm"

var (
	Resource *resource
)

type resource struct {
	*gorm.DB
}

func InitResource(db *gorm.DB) {
	Resource = &resource{
		db,
	}
	return
}
