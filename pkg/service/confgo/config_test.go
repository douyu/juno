package confgo_test

import (
	. "github.com/onsi/ginkgo"
)

var _ = Describe("config/service", func() {
	BeforeEach(func() {
	})

	It("ConfigFileUpdateToml", func() {

		/*	var content = "\n[app]\n  mode = \"local\"\n\n  [app.registry]\n\n    [app.registry.etcd]\n      endpoints = [\"wsd-projecta-etcd-rd.dev.unp.oyw:2379\"]\n      secure = false\n      timeout = \"2s\"\n\n[jupiter]\n\n  [jupiter.mysql]\n\n    [jupiter.mysql.dirty_filter]\n      debug = true\n      dsn = \"web_cm_user:7g1L275Q85sG94ioG5Nz@tcp(wsd-projecta.master.mysql.dev.dba.unp.oyw:13306)/cl_filter?charset=utf8&parseTime=True&loc=Local&readTimeout=1s&timeout=1s&writeTimeout=1s\"\n      level = \"panic\"\n      maxIdleConns = 10\n      maxOpenConns = 30\n\n[server]\n\n  [server.govern]\n    port = 35289\n\n  [server.grpc]\n    port = 59138\n\n    [[server.grpc.services]]\n      dubbo = \"111.0.1\"\n      group = \"11dev\"\n      name = \"11DirtyFilterServiceGrpc$IDirtyFilterService\"\n      namespace = \"11com.xxx.tribe.text.filter\"\n      release = \"112.7.4-grpc-SNAPSHOT\"\n    [[server.grpc.services]]\n      dubbo = \"221.0.1\"\n      group = \"22dev\"\n      name = \"22DirtyFilterServiceGrpc$IDirtyFilterService\"\n      namespace = \"22com.xxx.tribe.text.filter\"\n      release = \"222.7.4-grpc-SNAPSHOT\"\n  [server.http]\n    port = 59139\n"

			var caid = int(10)

			err := confgo.ConfuSrv.ConfigFileUpdateToml(caid, content, "mex")

			Expect(err).To(BeNil())*/
	})
})
