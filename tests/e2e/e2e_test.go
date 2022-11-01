package e2e

import (
	"testing"
	"time"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

func TestE2ESuites(t *testing.T) {

	// // load config
	// conf.LoadFromDataSource(file.NewDataSource("../../config/install.toml", false), toml.Unmarshal)

	// adminengine.New(adminengine.WithE2ETest())

	// conf.Reset()

	// // load config
	// conf.LoadFromDataSource(file.NewDataSource("../../config/single-region-admin.toml", false), toml.Unmarshal)

	// eng := adminengine.New()
	// go eng.Run()

	// wait for server start
	time.Sleep(time.Second)

	RegisterFailHandler(Fail)
	RunSpecs(t, "e2e test cases")
}
