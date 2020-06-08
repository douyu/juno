package cmc

import (
	"github.com/douyu/jupiter/pkg/store/gorm"
)

var (
	Cmc *cmc
)

type cmc struct {
	*gorm.DB
}

func InitCmc(db *gorm.DB) {
	Cmc = &cmc{
		db,
	}
	return
}
