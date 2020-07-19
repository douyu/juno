package permission

import "github.com/jinzhu/gorm"

var (
	Permission *permission
)

type (
	permission struct {
		db *gorm.DB
	}
)

func initPermission(db *gorm.DB) {
	Permission = &permission{
		db: db,
	}
}

func (p *permission) MenuAPITree() {

}
