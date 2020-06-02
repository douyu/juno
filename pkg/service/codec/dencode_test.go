package codec_test

import (
	"bytes"
	"encoding/json"
	"fmt"

	"github.com/douyu/juno/pkg/service/codec"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

var _ = Describe("Dencode", func() {

	BeforeEach(func() {

		// invoker.JunoMysql = gorm.StdNew("juno")
	})

	It("encode", func() {
		var source = `[{"Key":"app.mode","Val":"dev","Typ":24,"Id":1,"Comment":"","SourceTyp":1},{"Key":"app.registry.etcd.endpoints","Val":["wsd-projecta-etcd-rd.dev.unp.oyw:2379"],"Typ":23,"Comment":"","Id":2,"SourceTyp":6},{"Key":"app.registry.etcd.secure","Val":false,"Typ":1,"Comment":"","Id":3,"SourceTyp":4},{"Key":"app.registry.etcd.timeout","Val":"1s","Typ":24,"Comment":"","Id":4,"SourceTyp":1},{"Key":"jupiter.mysql.dirty_filter.level","Val":"panic","Typ":24,"Comment":"","Id":5,"SourceTyp":1},{"Key":"jupiter.mysql.dirty_filter.maxIdleConns","Val":10,"Typ":6,"Comment":"","Id":6,"SourceTyp":2},{"Key":"jupiter.mysql.dirty_filter.maxOpenConns","Val":30,"Typ":6,"Comment":"","Id":7,"SourceTyp":2},{"Key":"jupiter.mysql.dirty_filter.debug","Val":true,"Typ":1,"Comment":"","Id":8,"SourceTyp":4},{"Key":"jupiter.mysql.dirty_filter.dsn","Val":"web_cm_user:7g1L275Q85sG94ioG5Nz@tcp(wsd-projecta.master.mysql.dev.dba.unp.oyw:13306)/cl_filter?charset=utf8&parseTime=True&loc=Local&readTimeout=1s&timeout=1s&writeTimeout=1s","Typ":24,"Comment":"","Id":9,"SourceTyp":1},{"Key":"server.grpc.port","Val":59138,"Typ":6,"Id":10,"Comment":"","SourceTyp":2},{"Key":"server.grpc.services","Val":[{},{}],"Typ":23,"Id":11,"Comment":"","SourceTyp":13},{"Key":"server.grpc.services.group","Val":"dev","Id":12,"Typ":24,"Comment":"","SourceTyp":0},{"Key":"server.grpc.services.namespace","Val":"com.xxx.tribe.text.filter","Typ":24,"Id":13,"Comment":"","SourceTyp":0},{"Key":"server.grpc.services.name","Val":"DirtyFilterServiceGrpc$IDirtyFilterService","Typ":24,"Id":14,"Comment":"","SourceTyp":0},{"Key":"server.grpc.services.dubbo","Val":"2.0.2","Typ":24,"Id":15,"Comment":"","SourceTyp":0},{"Key":"server.grpc.services.release","Val":"2.22.4-grpc-SNAPSHOT","Id":16,"Typ":24,"Comment":"","SourceTyp":0},{"Key":"server.grpc.services","Val":[{},{}],"Typ":23,"Id":17,"Comment":"","SourceTyp":13},{"Key":"server.grpc.services.namespace","Val":"com.11xxx.tribe.text.filter","Typ":24,"Id":18,"Comment":"","SourceTyp":0},{"Key":"server.grpc.services.name","Val":"111DirtyFilterServiceGrpc$IDirtyFilterService","Typ":24,"Comment":"","Id":19,"SourceTyp":0},{"Key":"server.grpc.services.dubbo","Val":"2.0.2","Typ":24,"Id":20,"Comment":"","SourceTyp":0},{"Key":"server.grpc.services.release","Val":"2.7.4-grpc-SNAPSHOT","Typ":24,"Id":21,"Comment":"","SourceTyp":0},{"Key":"server.grpc.services.group","Val":"dev","Typ":24,"Id":22,"Comment":"","SourceTyp":0},{"Key":"server.http.port","Val":59139,"Typ":6,"Comment":"","Id":23,"SourceTyp":2},{"Key":"server.govern.port","Val":35289,"Typ":6,"Id":24,"Comment":"","SourceTyp":2}]`
		var item []*codec.Item
		_ = json.Unmarshal([]byte(source), &item)
		for _, v := range item {
			fmt.Println(v.Val)
		}
		w := bytes.NewBuffer([]byte{})
		err := codec.Encode(w, item, false)
		// fmt.Println(w.String())
		Expect(err).To(BeNil())
	})

	It("fmt/toml/error", func() {
		var content = "[app]\n  mode = \"dev\"\n\n  [app.registry]\n\n    [app.registry.etcd]\n      endpoints = [\"wsd-projecta-etcd-rd.dev.unp.oyw:2379\"]\n      secure = false\n      timeout = \"1s\"\n\n[jupiter]\n\n  [jupiter.mysql]\n\n    [jupiter.mysql.dirty_filter]\n      debug = true\n      dsn = \"web_cm_user:7g1L275Q85sG94ioG5Nz@tcp(wsd-projecta.master.mysql.dev.dba.unp.oyw:13306)/cl_filter?charset=utf8&parseTime=True&loc=Local&readTimeout=1s&timeout=1s&writeTimeout=1s\"\n      level = \"panic\"\n      maxIdleConns = 10\n      maxOpenConns = 30\n\n[server]\n\n  [server.govern]\n    port = 35289\n\n  [server.grpc]\n    port = 59138\n\n    [[server.grpc.services]]\n\n  [server.http]\n    port = 59139\n"
		items, err := codec.DecodeToml(content, true)
		Expect(err).To(BeNil())
		w := bytes.NewBuffer([]byte{})
		errEncode := codec.Encode(w, items, true)
		// fmt.Println(w.String())
		// Expect(errEncode).To(Equal(errors.New("配置文件格式嵌套错误")))
		Expect(errEncode).To(BeNil())
	})

	It("fmt/toml/success", func() {
		var content = "\n[app]\n  mode = \"local\"\n\n  [app.registry]\n\n    [app.registry.etcd]\n      endpoints = [\"wsd-projecta-etcd-rd.dev.unp.oyw:2379\"]\n      secure = false\n      timeout = \"2s\"\n\n[jupiter]\n\n  [jupiter.mysql]\n\n    [jupiter.mysql.dirty_filter]\n      debug = true\n      dsn = \"web_cm_user:7g1L275Q85sG94ioG5Nz@tcp(wsd-projecta.master.mysql.dev.dba.unp.oyw:13306)/cl_filter?charset=utf8&parseTime=True&loc=Local&readTimeout=1s&timeout=1s&writeTimeout=1s\"\n      level = \"panic\"\n      maxIdleConns = 10\n      maxOpenConns = 30\n\n[server]\n\n  [server.govern]\n    port = 35289\n\n  [server.grpc]\n    port = 59138\n\n    [[server.grpc.services]]\n      dubbo = \"111.0.1\"\n      group = \"11dev\"\n      name = \"11DirtyFilterServiceGrpc$IDirtyFilterService\"\n      namespace = \"11com.xxx.tribe.text.filter\"\n      release = \"112.7.4-grpc-SNAPSHOT\"\n\n    [[server.grpc.services]]\n      dubbo = \"221.0.1\"\n      group = \"22dev\"\n      name = \"22DirtyFilterServiceGrpc$IDirtyFilterService\"\n      namespace = \"22com.xxx.tribe.text.filter\"\n      release = \"222.7.4-grpc-SNAPSHOT\"\n\n  [server.http]\n    port = 59139\n"
		items, err := codec.DecodeToml(content, true)
		Expect(err).To(BeNil())
		w := bytes.NewBuffer([]byte{})
		errEncode := codec.Encode(w, items, true)
		fmt.Println(w.String())
		Expect(errEncode).To(BeNil())
	})

	It("fmt/toml/right", func() {
		var content = "[app]\n  mode = \"local\"\n\n  [app.registry]\n\n    [app.registry.etcd]\n      endpoints = [\"wsd-projecta-etcd-rd.dev.unp.oyw:2379\"]\n      secure = false\n      timeout = \"1s\"\n\n[jupiter]\n\n  [jupiter.mysql]\n\n    [jupiter.mysql.dirty_filter]\n#      connMaxLifetime = \"300s\"\n      debug = true\n      dsn = \"web_cm_user:7g1L275Q85sG94ioG5Nz@tcp(wsd-projecta.master.mysql.dev.dba.unp.oyw:13306)/cl_filter?charset=utf8&parseTime=True&loc=Local&readTimeout=1s&timeout=1s&writeTimeout=1s\"\n      level = \"panic\"\n      maxIdleConns = 10\n      maxOpenConns = 30\n\n[server]\n\n  [server.govern]\n    port = 35289\n\n  [server.grpc]\n    port = 59138\n    [[server.grpc.services]]# 声明服务接口\n        namespace = \"com.xxx.tribe.text.filter\"  # 命名空间 [required]\n        name = \"DirtyFilterServiceGrpc$IDirtyFilterService\" # 服务名称 [required]\n        dubbo = \"2.0.2\" # dubbo传输协议的版本号 [default, optional]\n        release = \"2.7.4-grpc-SNAPSHOT\" # dubbo注册协议的版本号 [default, optional]\n        group=\"local\"\n\n  [server.http]\n    port = 59139"
		items, err := codec.DecodeToml(content, true)
		fmt.Println("content:-----",content)
		for _, v := range items {
			fmt.Println("v -- ", v)
		}
		Expect(err).To(BeNil())
		w := bytes.NewBuffer([]byte{})
		errEncode := codec.Encode(w, items, true)
		// fmt.Println(w.String())
		Expect(errEncode).To(BeNil())
	})
})
