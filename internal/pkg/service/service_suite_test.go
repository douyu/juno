package service_test

import (
	"testing"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

func TestSupervisor(t *testing.T) {
	RegisterFailHandler(Fail)
	//
	//if err := viper.LoadFromFile("../../config/config-local.toml", false); err != nil {
	//	fmt.Println(err.Error())
	//}
	//invoker.Init()
	//service.Init()

	RunSpecs(t, "Supervisor Suite")
}
