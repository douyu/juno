module github.com/douyu/juno

go 1.14

require (
	github.com/BurntSushi/toml v0.3.1
	github.com/alecthomas/template v0.0.0-20190718012654-fb15b899a751
	github.com/alibaba/sentinel-golang v1.0.4
	github.com/aliyun/alibaba-cloud-sdk-go v1.61.18
	github.com/apache/rocketmq-client-go/v2 v2.1.1-rc2
	github.com/arsmn/fiber-swagger/v2 v2.3.0
	github.com/beeker1121/goque v2.1.0+incompatible
	github.com/bojand/ghz v0.56.0
	github.com/casbin/casbin/v2 v2.7.2
	github.com/cockroachdb/cmux v0.0.0-20170110192607-30d10be49292
	github.com/coreos/bbolt v1.3.2 // indirect
	github.com/coreos/etcd v3.3.22+incompatible
	github.com/coreos/go-systemd v0.0.0-20190321100706-95778dfbb74e // indirect
	github.com/coreos/pkg v0.0.0-20180928190104-399ea9e2e55f // indirect
	github.com/douyu/jupiter v0.0.0-20220901054943-92301affdda0
	github.com/go-git/go-git/v5 v5.1.0
	github.com/go-gomail/gomail v0.0.0-20160411212932-81ebce5c23df
	github.com/go-openapi/spec v0.20.3 // indirect
	github.com/go-playground/validator v9.30.0+incompatible
	github.com/go-playground/validator/v10 v10.10.0
	github.com/go-resty/resty/v2 v2.7.0
	github.com/gofiber/fiber/v2 v2.5.0
	github.com/golang/protobuf v1.5.2
	github.com/gomodule/redigo v2.0.0+incompatible
	github.com/google/go-cmp v0.5.8
	github.com/googleapis/gnostic v0.2.0 // indirect
	github.com/gorilla/sessions v1.2.0
	github.com/gregjones/httpcache v0.0.0-20180305231024-9cad4c3443a7 // indirect
	github.com/grpc-ecosystem/go-grpc-prometheus v1.2.0
	github.com/jhump/protoreflect v1.7.0
	github.com/jmespath/go-jmespath v0.4.0
	github.com/labstack/echo-contrib v0.9.0
	github.com/labstack/echo/v4 v4.6.3
	github.com/labstack/gommon v0.3.1
	github.com/link-duan/toml v0.3.2
	github.com/mailru/easyjson v0.7.7 // indirect
	github.com/onsi/ginkgo v1.16.4
	github.com/peterbourgon/diskv v2.0.1+incompatible // indirect
	github.com/pkg/errors v0.9.1
	github.com/robertkrimen/otto v0.0.0-20191219234010-c382bd3c16ff
	github.com/robfig/cron/v3 v3.0.1
	github.com/sirupsen/logrus v1.8.1
	github.com/smartystreets/assertions v1.0.1 // indirect
	github.com/spf13/cast v1.5.0
	github.com/spf13/viper v1.10.0
	github.com/swaggo/swag v1.7.0
	github.com/syndtr/goleveldb v1.0.0
	github.com/tidwall/gjson v1.13.0
	github.com/tmc/grpc-websocket-proxy v0.0.0-20190109142713-0ad062ec5ee5 // indirect
	github.com/uber-archive/go-torch v0.0.0-20181107071353-86f327cc820e
	github.com/uber/go-torch v0.0.0-20181107071353-86f327cc820e // indirect
	github.com/unknwon/com v1.0.1
	github.com/urfave/negroni v1.0.0
	go.uber.org/zap v1.21.0
	golang.org/x/crypto v0.0.0-20220214200702-86341886e292
	golang.org/x/lint v0.0.0-20210508222113-6edffad5e616
	golang.org/x/net v0.0.0-20220722155237-a158d28d115b
	golang.org/x/oauth2 v0.0.0-20220223155221-ee480838109b
	golang.org/x/sync v0.0.0-20220722155255-886fb9371eb4
	golang.org/x/xerrors v0.0.0-20200804184101-5ec99f83aff1
	google.golang.org/grpc v1.44.0
	gopkg.in/alexcesaro/quotedprintable.v3 v3.0.0-20150716171945-2caba252f4dc // indirect
	gopkg.in/fsnotify.v1 v1.4.7
	gopkg.in/gomail.v2 v2.0.0-20160411212932-81ebce5c23df // indirect
	gopkg.in/inf.v0 v0.9.1 // indirect
	gopkg.in/mgo.v2 v2.0.0-20190816093944-a6b53ec6cb22
	gopkg.in/sourcemap.v1 v1.0.5 // indirect
	gopkg.in/yaml.v2 v2.4.0
	gopkg.in/yaml.v3 v3.0.1
	gorm.io/driver/mysql v1.3.6
	gorm.io/gorm v1.23.8
	k8s.io/api v0.0.0-20190325185214-7544f9db76f6
	k8s.io/apimachinery v0.0.0-20190223001710-c182ff3b9841
	k8s.io/client-go v8.0.0+incompatible
)

replace google.golang.org/grpc => google.golang.org/grpc v1.26.0
