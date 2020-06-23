package model

import (
	"fmt"

	"github.com/alibaba/sentinel-golang/core/config"
)

func InitDefault() error {
	return initConfgoAdmin("")
}

func Init(configPath string) error {
	return initConfgoAdmin("")
}

func initConfgoAdmin(configPath string) (err error) {
	defer func() {
		if r := recover(); r != nil {
			var ok bool

			if err, ok = r.(error); !ok {
				err = fmt.Errorf("%v", r)
			}
		}
	}()

	if err = config.InitConfig(configPath); err != nil {
		return err
	}

	return initCoreComponents()
}

func initCoreComponents() (err error) {
	return err
}
