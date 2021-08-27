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
	// Sentinel version need. v0.6.2-->v1.0.2
	//	if err = config.InitConfig(configPath); err != nil {
	if err = config.InitConfigWithYaml(configPath); err != nil {
		return err
	}

	return initCoreComponents()
}

func initCoreComponents() (err error) {
	return err
}
