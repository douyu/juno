package aliyunlog

import (
	"context"
	"fmt"
	"sync"

	"github.com/aliyun/alibaba-cloud-sdk-go/services/sts"
	sls "github.com/aliyun/aliyun-log-go-sdk"
	"github.com/douyu/jupiter/pkg/conf"
)

//Service 服务
type Service struct {
	Clients    map[string]sls.ClientInterface
	StsClients map[string]*sts.Client
	lock       sync.Mutex
	menus      []*LogNode
	enable     bool
}

var Instance *Service

func New() {
	Instance = Init()
	return
}

//Init 初始化
func Init() *Service {

	clients := make(map[string]sls.ClientInterface)
	stsclients := make(map[string]*sts.Client) // 阿里云访问密钥AccessKey。更多信息，请参见访问密钥。阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维。

	AccessKeyId := conf.GetString("aliyun.accessKeyId")
	AccessKeySecret := conf.GetString("aliyun.secret")
	// RAM用户角色的临时安全令牌。此处取值为空，表示不使用临时安全令牌。更多信息，请参见授权用户角色。
	SecurityToken := ""
	// 创建日志服务Client。
	regions := conf.GetStringMapString("aliyun.regions")
	enable := false
	if AccessKeyId != "" {
		enable = true
		for area, addr := range regions {
			client := sls.CreateNormalInterface(fmt.Sprintf("%s.log.aliyuncs.com", addr), AccessKeyId, AccessKeySecret, SecurityToken)
			clients[area] = client
			//设置调用者（RAM用户或RAM角色）的AccessKey ID和AccessKey Secret。
			stsclient, err := sts.NewClientWithAccessKey("cn-beijing", AccessKeyId, AccessKeySecret)
			if err != nil {
				panic(err)
			}
			stsclients[area] = stsclient
		}
	}
	s := &Service{Clients: clients, menus: make([]*LogNode, 0), StsClients: stsclients, enable: enable}
	return s
}

// RefreshMenuData
func (s *Service) RefreshMenuData() (err error) {
	if !s.enable {
		return
	}
	ret, err := s.logStoreMenu(context.TODO())
	if err != nil {
		return
	}
	s.lock.Lock()
	defer s.lock.Unlock()
	s.menus = ret
	return
}
