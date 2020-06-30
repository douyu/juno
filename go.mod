module github.com/douyu/juno

go 1.14

require (
	github.com/BurntSushi/toml v0.3.1
	github.com/achun/testing-want v0.0.0-20140905044750-a28b0fa31c65 // indirect
	github.com/achun/tom-toml v0.2.0
	github.com/alibaba/sentinel-golang v0.4.0
	github.com/cncd/queue v0.0.0-20170406022548-63b1974bbcc9
	github.com/cockroachdb/cmux v0.0.0-20170110192607-30d10be49292
	github.com/coreos/etcd v3.3.22+incompatible
	github.com/davecgh/go-spew v1.1.1
	github.com/douyu/jupiter v0.0.0-20200605021304-25486432a0af
	github.com/go-macaron/session v0.0.0-20200329073812-7d919ce6a8d2 // indirect
	github.com/go-resty/resty/v2 v2.2.0
	github.com/go-sql-driver/mysql v1.4.1
	github.com/golang/protobuf v1.4.2
	github.com/gomodule/redigo v2.0.0+incompatible
	github.com/google/go-cmp v0.4.0
	github.com/gorilla/securecookie v1.1.1
	github.com/gorilla/sessions v1.2.0
	github.com/gosimple/slug v1.9.0 // indirect
	github.com/grafana/grafana v6.1.6+incompatible // indirect
	github.com/grpc-ecosystem/go-grpc-prometheus v1.2.0
	github.com/inconshreveable/log15 v0.0.0-20200109203555-b30bc20e4fd1 // indirect
	github.com/jinzhu/gorm v1.9.12
	github.com/jmespath/go-jmespath v0.0.0-20180206201540-c2b33e8439af
	github.com/labstack/echo-contrib v0.9.0
	github.com/labstack/echo/v4 v4.1.16
	github.com/labstack/gommon v0.3.0
	github.com/onsi/ginkgo v1.12.3
	github.com/onsi/gomega v1.10.1
	github.com/pkg/errors v0.9.1
	github.com/sirupsen/logrus v1.5.0
	github.com/spf13/cast v1.3.1
	github.com/spf13/viper v1.6.3
	github.com/stretchr/testify v1.6.1
	github.com/syndtr/goleveldb v1.0.0
	github.com/teris-io/shortid v0.0.0-20171029131806-771a37caa5cf // indirect
	github.com/unknwon/com v1.0.1
	github.com/urfave/cli/v2 v2.2.0
	github.com/urfave/negroni v1.0.0
	go.etcd.io/etcd v3.3.13+incompatible
	go.uber.org/zap v1.15.0
	golang.org/x/crypto v0.0.0-20200221231518-2aa609cf4a9d
	golang.org/x/net v0.0.0-20200520004742-59133d7f0dd7
	golang.org/x/oauth2 v0.0.0-20180821212333-d2e6202438be
	golang.org/x/sync v0.0.0-20190911185100-cd5d95a43a6e
	golang.org/x/tools v0.0.0-20200601175630-2caf76543d99 // indirect
	golang.org/x/xerrors v0.0.0-20191204190536-9bdfabe68543
	google.golang.org/grpc v1.29.1
	gopkg.in/macaron.v1 v1.3.9 // indirect
	gopkg.in/mgo.v2 v2.0.0-20190816093944-a6b53ec6cb22
	gopkg.in/square/go-jose.v2 v2.5.1 // indirect
	gopkg.in/yaml.v2 v2.3.0
)

replace google.golang.org/grpc => google.golang.org/grpc v1.26.0
