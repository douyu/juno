module github.com/douyu/juno

go 1.14

require (
	github.com/BurntSushi/toml v0.3.1
	github.com/achun/testing-want v0.0.0-20140905044750-a28b0fa31c65 // indirect
	github.com/achun/tom-toml v0.2.0
	github.com/alibaba/sentinel-golang v0.2.0
	github.com/cncd/queue v0.0.0-20170406022548-63b1974bbcc9
	github.com/cockroachdb/cmux v0.0.0-20170110192607-30d10be49292
	github.com/coreos/etcd v3.3.20+incompatible
	github.com/davecgh/go-spew v1.1.1
	github.com/douyu/jupiter v0.0.0-20200529124528-a97a02954bdf
	github.com/go-resty/resty/v2 v2.2.0
	github.com/go-sql-driver/mysql v1.4.1
	github.com/gomodule/redigo v2.0.0+incompatible
	github.com/google/go-cmp v0.4.0
	github.com/gorilla/securecookie v1.1.1
	github.com/gorilla/sessions v1.2.0
	github.com/grpc-ecosystem/go-grpc-prometheus v1.2.0
	github.com/jinzhu/gorm v1.9.12
	github.com/kataras/go-errors v0.0.3
	github.com/labstack/echo-contrib v0.9.0
	github.com/labstack/echo/v4 v4.1.16
	github.com/labstack/gommon v0.3.0
	github.com/onsi/ginkgo v1.12.0
	github.com/onsi/gomega v1.10.0
	github.com/pkg/errors v0.9.1
	github.com/sirupsen/logrus v1.5.0
	github.com/spf13/viper v1.6.3
	github.com/stretchr/testify v1.5.1
	github.com/syndtr/goleveldb v1.0.0
	github.com/unknwon/com v1.0.1
	github.com/urfave/cli/v2 v2.2.0
	github.com/urfave/negroni v1.0.0
	go.etcd.io/etcd v3.3.13+incompatible
	golang.org/x/crypto v0.0.0-20200221231518-2aa609cf4a9d
	golang.org/x/net v0.0.0-20200425230154-ff2c4b7c35a0
	golang.org/x/sync v0.0.0-20190911185100-cd5d95a43a6e
	google.golang.org/grpc v1.29.1
	gopkg.in/mgo.v2 v2.0.0-20190816093944-a6b53ec6cb22
)

replace google.golang.org/grpc => google.golang.org/grpc v1.26.0
