module github.com/douyu/juno

go 1.14

require (
	github.com/BurntSushi/toml v0.3.1
	github.com/alibaba/sentinel-golang v0.4.0
	github.com/aliyun/alibaba-cloud-sdk-go v0.0.0-20190802083043-4cd0c391755e
	github.com/apache/rocketmq-client-go v0.0.0-20191211114916-85ee94b43cef
	github.com/beeker1121/goque v2.1.0+incompatible
	github.com/bojand/ghz v0.56.0
	github.com/casbin/casbin/v2 v2.7.2
	github.com/cockroachdb/cmux v0.0.0-20170110192607-30d10be49292
	github.com/coreos/etcd v3.3.22+incompatible
	github.com/denisenkom/go-mssqldb v0.0.0-20200428022330-06a60b6afbbc // indirect
	github.com/douyu/jupiter v0.2.4
	github.com/dustin/go-humanize v1.0.0 // indirect
	github.com/go-git/go-git/v5 v5.1.0
	github.com/go-gomail/gomail v0.0.0-20160411212932-81ebce5c23df
	github.com/go-playground/validator v9.30.0+incompatible
	github.com/go-playground/validator/v10 v10.3.0
	github.com/go-resty/resty/v2 v2.2.0
	github.com/golang/protobuf v1.4.2
	github.com/gomodule/redigo v2.0.0+incompatible
	github.com/google/go-cmp v0.4.0
	github.com/gorilla/sessions v1.2.0
	github.com/grpc-ecosystem/go-grpc-prometheus v1.2.0
	github.com/jhump/protoreflect v1.7.0
	github.com/jinzhu/gorm v1.9.12
	github.com/jinzhu/now v1.1.1 // indirect
	github.com/jmespath/go-jmespath v0.0.0-20180206201540-c2b33e8439af
	github.com/labstack/echo-contrib v0.9.0
	github.com/labstack/echo/v4 v4.1.16
	github.com/labstack/gommon v0.3.0
	github.com/lib/pq v1.5.2 // indirect
	github.com/link-duan/toml v0.3.2
	github.com/mattn/go-sqlite3 v2.0.3+incompatible // indirect
	github.com/onsi/ginkgo v1.12.3
	github.com/pelletier/go-toml v1.4.0 // indirect
	github.com/pkg/errors v0.9.1
	github.com/robertkrimen/otto v0.0.0-20191219234010-c382bd3c16ff
	github.com/robfig/cron/v3 v3.0.1
	github.com/sirupsen/logrus v1.6.0
	github.com/smartystreets/assertions v1.0.1 // indirect
	github.com/spf13/cast v1.3.1
	github.com/spf13/viper v1.6.3
	github.com/syndtr/goleveldb v1.0.0
	github.com/uber-archive/go-torch v0.0.0-20181107071353-86f327cc820e
	github.com/uber/go-torch v0.0.0-20181107071353-86f327cc820e // indirect
	github.com/unknwon/com v1.0.1
	github.com/urfave/negroni v1.0.0
	go.uber.org/zap v1.15.0
	golang.org/x/crypto v0.0.0-20200820211705-5c72a883971a
	golang.org/x/lint v0.0.0-20191125180803-fdd1cda4f05f
	golang.org/x/net v0.0.0-20200625001655-4c5254603344
	golang.org/x/oauth2 v0.0.0-20190604053449-0f29369cfe45
	golang.org/x/sync v0.0.0-20200625203802-6e8e738ad208
	golang.org/x/time v0.0.0-20200416051211-89c76fbcd5d1 // indirect
	golang.org/x/xerrors v0.0.0-20191204190536-9bdfabe68543
	google.golang.org/grpc v1.29.1
	gopkg.in/alexcesaro/quotedprintable.v3 v3.0.0-20150716171945-2caba252f4dc // indirect
	gopkg.in/fsnotify.v1 v1.4.7
	gopkg.in/gomail.v2 v2.0.0-20160411212932-81ebce5c23df // indirect
	gopkg.in/mgo.v2 v2.0.0-20190816093944-a6b53ec6cb22
	gopkg.in/sourcemap.v1 v1.0.5 // indirect
	gopkg.in/yaml.v2 v2.3.0
	gopkg.in/yaml.v3 v3.0.0-20200313102051-9f266ea9e77c
	k8s.io/api v0.0.0-20190325185214-7544f9db76f6
	k8s.io/apimachinery v0.0.0-20190223001710-c182ff3b9841
	k8s.io/client-go v8.0.0+incompatible
	sigs.k8s.io/yaml v1.2.0 // indirect
)

replace google.golang.org/grpc => google.golang.org/grpc v1.26.0
