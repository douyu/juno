package k8s

import (
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/douyu/juno/pkg/model/db"

	"github.com/douyu/juno/pkg/model/view"

	"github.com/douyu/juno/pkg/util"
	"github.com/jinzhu/gorm"

	"github.com/douyu/jupiter/pkg/xlog"

	"github.com/douyu/jupiter/pkg/util/xgo"

	v1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/apimachinery/pkg/util/runtime"
	"k8s.io/client-go/informers"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/cache"
)

func newSyncPod(zoneCode string, config *rest.Config, db *gorm.DB) *syncPod {
	s := &syncPod{
		ZoneCode: zoneCode,
		config:   config,
		db:       db,
	}
	xgo.Go(func() {
		s.watch()
	})
	xgo.Go(func() {
		for {
			s.clean()
			time.Sleep(cleanInterval)
		}
	})
	return s
}

type syncPod struct {
	ZoneCode string
	config   *rest.Config
	db       *gorm.DB
}

func (i *syncPod) watch() {
	clientSet, err := kubernetes.NewForConfig(i.config)
	if err != nil {
		xlog.Error("watchItem", xlog.Any("err", err))
		return
	}
	stopCh := make(chan struct{})
	defer close(stopCh)

	factory := informers.NewSharedInformerFactory(clientSet, 0)
	ObjInformer := factory.Core().V1().Pods()
	informer := ObjInformer.Informer()
	defer runtime.HandleCrash()

	go factory.Start(stopCh)

	if !cache.WaitForCacheSync(stopCh, informer.HasSynced) {
		runtime.HandleError(fmt.Errorf("sync timeout"))
		return
	}

	informer.AddEventHandler(cache.ResourceEventHandlerFuncs{
		AddFunc:    i.add,
		UpdateFunc: i.update,
		DeleteFunc: i.delete,
	})

	lister := ObjInformer.Lister()
	_, err = lister.List(labels.Nothing())
	if err != nil {
		xlog.Error("sync",
			xlog.String("typ", "pod"),
			xlog.String("act", "ZoneCode"),
			xlog.String("zoneCode", i.ZoneCode),
			xlog.Any("err", err.Error()))
	}
	<-stopCh
}

func (i *syncPod) add(obj interface{}) {
	err := i.mysqlCreateOrUpdate(i.ZoneCode, obj.(*v1.Pod))
	if err != nil {
		xlog.Error("sync",
			xlog.String("typ", "pod"),
			xlog.String("act", "add"),
			xlog.String("ZoneCode", i.ZoneCode),
			xlog.Any("err", err))
		return
	}

	in := obj.(*v1.Pod)
	var appName string
	var ok bool
	if appName, ok = in.Labels["appName"]; !ok || appName == "" {
		err = errors.New("appName is empty")
		xlog.Warn("cloudApp",
			xlog.String("appName", appName),
			xlog.String("podName", in.Name),
			xlog.String("reason", "appName is empty"))
		return
	}
}

func (i *syncPod) update(old interface{}, new interface{}) {
	err := i.mysqlCreateOrUpdate(i.ZoneCode, new.(*v1.Pod))
	if err != nil {
		xlog.Error("sync",
			xlog.String("typ", "pod"),
			xlog.String("act", "add"),
			xlog.String("ZoneCode", i.ZoneCode),
			xlog.Any("err", err))
		return
	}

	in := new.(*v1.Pod)
	var appName string
	var ok bool
	if appName, ok = in.Labels["appName"]; !ok || appName == "" {
		err = errors.New("appName is empty")
		xlog.Warn("cloudApp", xlog.String("appName", appName), xlog.String("podName", in.Name), xlog.String("reason", "appName is empty"))
		return
	}
}

func (i *syncPod) delete(obj interface{}) {
	pod := obj.(*v1.Pod)
	id, _ := strconv.Atoi(pod.ObjectMeta.Labels["appId"])
	name := pod.ObjectMeta.Name
	err := i.mysqlDelete(int32(id), name)
	if err != nil {
		xlog.Error("sync",
			xlog.String("typ", "pod"),
			xlog.String("act", "delete"),
			xlog.String("ZoneCode", i.ZoneCode),
			xlog.Any("err", err),
			xlog.Any("id", id),
			xlog.String("name", name))
		return
	}
}

func (i *syncPod) clean() {
	// 数据库中存在对应记录进行delete操作
	t := time.Now().Add(-dataRetentionTime)
	err := i.db.Table("k8s_pod").Where("is_del=? and update_time<?", 1, t).Delete(&db.K8sPod{}).Error
	if err != nil {
		xlog.Error("sync",
			xlog.String("typ", "pod"),
			xlog.String("act", "clean"),
			xlog.String("ZoneCode", i.ZoneCode),
			xlog.String("err", err.Error()))
		return
	}
	return
}

// list 获取全量pod列表
func (i *syncPod) list(zoneCode string) (res []*v1.Pod) {
	res = make([]*v1.Pod, 0)
	var list view.PodList
	err := IK8s.get(zoneCode, podListAllNamespaces, nil, &list)
	if err != nil {
		xlog.Error("PodName", xlog.Any("list", err))
		return
	}
	res = list.Items
	return
}

// Log 获取全量pod列表
func (i *syncPod) Log(zoneCode, namespace, podName string) (res []byte, err error) {
	res, err = IK8s.getStream(zoneCode, fmt.Sprintf(podLog, namespace, podName), nil)
	if err != nil {
		xlog.Error("PodName", xlog.Any("list", err))
		return
	}
	return
}

func (i *syncPod) mysqlCreateOrUpdate(zoneCode string, in *v1.Pod) (err error) {
	var m db.K8sPod
	m.Formatting(zoneCode, in)

	var row db.K8sPod
	// 判断数据库中是否已存在
	err = i.db.Select("id, md5").Where("aid=? and pod_name=? and is_del=?", m.Aid, m.PodName, 0).Find(&row).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		xlog.Error("mysqlCreate", xlog.String("err", err.Error()))
		return
	}

	// 数据库中已存在
	if row.PodName != "" {
		// 进行更新操作
		md5BodyByte, _ := json.Marshal(in)
		newMD5 := util.Md5(string(md5BodyByte))
		if row.MD5 == newMD5 {
			// 如果md5没有变化
			return
		}
		err = i.db.Table("k8s_pod").Where("aid=? and pod_name=? and is_del=?", m.Aid, m.PodName, 0).Update(map[string]interface{}{
			"env":                 m.Env,
			"zone_code":           m.ZoneCode,
			"aid":                 m.Aid,
			"pod_name":            m.PodName,
			"app_name":            m.AppName,
			"namespace":           m.Namespace,
			"host_ip":             m.HostIp,
			"pod_ip":              m.PodIp,
			"node_name":           m.NodeName,
			"start_time":          m.StartTime,
			"update_time":         m.UpdateTime,
			"image":               m.Image,
			"status":              m.Status,
			"instance_group_id":   m.InstanceGroupID,
			"instance_group_name": m.InstanceGroupName,
			"md5":                 m.MD5,
			"is_del":              m.IsDel,
		}).Error
		if err != nil {
			xlog.Error("pod update", xlog.Any("err", err))
			return
		}
		return
	}
	// 数据库中不存在对应记录进行insert操作，或者历史配置被删除了，目前只有日志记录存档
	err = i.db.Save(&m).Error
	if err != nil {
		xlog.Error("mysqlCreate", xlog.Any("err", err))
		return
	}
	return
}

func (i *syncPod) mysqlDelete(podAid int32, podName string) (err error) {
	// 数据库中存在对应记录进行delete操作
	err = i.db.Table("k8s_pod").Where("aid=? and pod_name=?", podAid, podName).Update(map[string]interface{}{
		"is_del": 1,
	}).Error
	if err != nil {
		xlog.Error("mysqlDelete", xlog.Any("err", err))
		return
	}
	return
}

// mysqlList 获取数据库列表
func (i *syncPod) mysqlList(zoneCode string) (list []db.K8sPod, err error) {
	err = i.db.Select("*").Where("idc_code=? and is_del=?", zoneCode, 0).Find(&list).Error
	if err != nil {
		xlog.Error("mysqlDelete", xlog.Any("err", err))
		return
	}
	return
}

// Item 获取全量Ingress列表
func (i *syncPod) Item(zoneCode, namespace, podName string) (res v1.Pod, err error) {
	err = IK8s.get(zoneCode, fmt.Sprintf(podItem, namespace, podName), nil, &res)
	if err != nil {
		xlog.Error("Item", xlog.Any("err", err))
		return
	}
	return
}
