package huaweilog

import (
	"context"
	"sync"

	"github.com/douyu/jupiter/pkg/conf"
	"github.com/huaweicloud/huaweicloud-sdk-go-v3/core/auth/basic"
	iamv3 "github.com/huaweicloud/huaweicloud-sdk-go-v3/services/iam/v3"
	iamv3region "github.com/huaweicloud/huaweicloud-sdk-go-v3/services/iam/v3/region"
	ltsv2 "github.com/huaweicloud/huaweicloud-sdk-go-v3/services/lts/v2"
	ltsv2region "github.com/huaweicloud/huaweicloud-sdk-go-v3/services/lts/v2/region"
)

// Service 服务
type Service struct {
	Clients    map[string]*ltsv2.LtsClient
	StsClients map[string]*iamv3.IamClient
	lock       sync.Mutex
	menus      map[string]*LogNodeMap
	enable     bool
}

var Instance *Service

func New() {
	Instance = Init()
}

// Init 初始化
func Init() *Service {

	clients := make(map[string]*ltsv2.LtsClient)
	stsclients := make(map[string]*iamv3.IamClient) // 阿里云访问密钥AccessKey。更多信息，请参见访问密钥。阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维。

	AccessKeyId := conf.GetString("huawei.accessKeyId")
	AccessKeySecret := conf.GetString("huawei.secret")
	// RAM用户角色的临时安全令牌。此处取值为空，表示不使用临时安全令牌。更多信息，请参见授权用户角色。

	// 创建日志服务Client。
	regions := conf.GetStringMapString("huawei.regions")
	enable := false
	auth := basic.NewCredentialsBuilder().
		WithAk(AccessKeyId).
		WithSk(AccessKeySecret).
		Build()
	if AccessKeyId != "" {
		enable = true
		for area := range regions {
			client := ltsv2.NewLtsClient(
				ltsv2.LtsClientBuilder().
					WithRegion(ltsv2region.ValueOf(regions[area])).
					WithCredential(auth).Build())
			clients[area] = client
			//设置调用者（RAM用户或RAM角色）的AccessKey ID和AccessKey Secret。
			stsclient := iamv3.NewIamClient(iamv3.IamClientBuilder().
				WithRegion(iamv3region.ValueOf(regions[area])).
				WithCredential(auth).Build())

			stsclients[area] = stsclient
		}
	}
	s := &Service{Clients: clients, menus: make(map[string]*LogNodeMap, 0), StsClients: stsclients, enable: enable}
	s.RefreshMenuData()
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
