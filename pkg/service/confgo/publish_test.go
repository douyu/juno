package confgo_test

import (
	"time"

	"github.com/douyu/juno/pkg/service/confgo"

	"github.com/douyu/juno/pkg/model/db"

	"github.com/douyu/juno/pkg/service/codec"
	"github.com/douyu/juno/pkg/service/codec/util"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	log "github.com/sirupsen/logrus"
)

var _ = Describe("Publish", func() {

	BeforeEach(func() {
	})

	It("ConfigServerAppPublish", func() {
		var caid = int(7)

		cmcApp, err := confgo.ConfuSrv.CmcAppDetail(caid)
		Expect(err).To(BeNil())

		// 获取配置k-v列表
		cfgs, err := confgo.ConfuSrv.GetAppKVs(caid)
		Expect(err).To(BeNil())

		// 获取资源列表
		//rateResourceList, err := resource.Resource.GetRelatedSourceList(caid, false)
		Expect(err).To(BeNil())

		var items = make([]*codec.Item, 0)
		var originItems = make([]*codec.Item, 0)
		for _, val := range cfgs {
			// 根据type字段解析val
			value, typ, err := util.GetVal(val.Value, val.Type)
			Expect(err).To(BeNil())

			items = append(items, &codec.Item{
				Key:       val.Key,
				Val:       value,
				Comment:   val.Comment,
				Typ:       typ,
				SourceTyp: val.SourceTyp,
				Id:        val.Id,
			})
			if val.ResourceID != 0 { // 解析资源
				item := FindResource(rateResourceList, func(item db.CmcResource) bool {
					return item.Id == uint64(val.ResourceID)
				})
				val.Value = item.Value
				val.Type = item.ValueType
			}
			var err2 error
			value, typ, err2 = util.GetVal(val.Value, val.Type)

			Expect(err2).To(BeNil())

			originItems = append(originItems, &codec.Item{
				Key:       val.Key,
				Val:       value,
				Comment:   val.Comment,
				Typ:       typ,
				SourceTyp: val.SourceTyp,
				Id:        val.Id,
			})
		}

		templateToml, _, err := TomlTextByItems(items)

		Expect(err).To(BeNil())

		originToml, originMD5, err := TomlTextByItems(originItems)

		Expect(err).To(BeNil())

		cmcHistory := new(struct {
			db.CmcHistory
			Instances []string `json:"instances"`
			IsPick    bool     `json:"is_pick"`
		})
		cmcHistory.Aid = int(cmcApp.Aid)
		cmcHistory.FileName = cmcApp.FileName
		cmcHistory.ZoneCode = cmcApp.ZoneCode
		cmcHistory.Text = templateToml
		cmcHistory.OriginText = originToml
		cmcHistory.Md5 = originMD5
		cmcHistory.CreateTime = time.Now().Unix()
		cmcHistory.OpName = "mex"

		instanceList := util.HostNameListFilterEnv(cmcApp.AppName, cmcHistory.ZoneCode)
		// 有些应用在发布系统机器上，需要额外关联发布系统机器
		pubNode := db.AppNode{}
		PublishSrv.DB.Table("app_node").Where("app_name = ?", cmcApp.AppName).First(&pubNode)
		if pubNode.Id != 0 {
			instanceList = append(instanceList, pubNode.HostName)
		}

		if len(instanceList) == 0 { // 容器发布没有部署组
			log.Warn("no instance list", "appName", cmcApp.AppName, "file", cmcApp.FileName)
			// return handler.JSON(c, handler.MsgErr, "未选择实例或该机房未部署")
		}

	})
})
