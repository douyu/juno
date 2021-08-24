package k8s

import (
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/juno/pkg/util"
	"github.com/douyu/jupiter/pkg/util/xgo"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/jinzhu/gorm"
	v1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/apimachinery/pkg/util/runtime"
	"k8s.io/client-go/informers"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/cache"
)

type syncPod struct {
	zoneCode      string
	prefix        string
	excludeSuffix []string
	config        *rest.Config
	db            *gorm.DB
	stopCh        chan struct{}
}

func newSyncPod(zoneCode, prefix string, excludeSuffix []string, config *rest.Config, db *gorm.DB) *syncPod {
	s := &syncPod{
		zoneCode:      zoneCode,
		config:        config,
		db:            db,
		prefix:        prefix,
		excludeSuffix: excludeSuffix,
		stopCh:        make(chan struct{}),
	}
	xlog.Info("k8sWork", xlog.String("step", "startWatch"), xlog.String("zoneCode", zoneCode))

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

func (i *syncPod) watch() {
	clientSet, err := kubernetes.NewForConfig(i.config)
	if err != nil {
		xlog.Error("k8sWork",
			xlog.String("step", "watchItem"),
			xlog.String("zoneCode", i.zoneCode),
			xlog.Any("err", err))
		return
	}

	//defer close(i.stopCh)

	factory := informers.NewSharedInformerFactory(clientSet, 0)
	ObjInformer := factory.Core().V1().Pods()
	informer := ObjInformer.Informer()
	defer runtime.HandleCrash()

	go factory.Start(i.stopCh)

	if !cache.WaitForCacheSync(i.stopCh, informer.HasSynced) {
		runtime.HandleError(fmt.Errorf("k8sWork timeout"))
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
		xlog.Error("k8sWork",
			xlog.String("step", "lister.List"),
			xlog.String("typ", "pod"),
			xlog.String("zoneCode", i.zoneCode),
			xlog.Any("err", err.Error()))
	}
	<-i.stopCh
}

// TODO 这个部分的close功能存在问题，watch并未停止
func (i *syncPod) close() {
	i.stopCh <- struct{}{}
}
func (i *syncPod) commonCheck(in *v1.Pod) error {
	var (
		appName string
		ok      bool
	)

	// 检查PodPhase
	if in.Status.Phase != v1.PodRunning {
		return errors.New("pod is not running")
	}
	// 检查appName
	if appName, ok = in.Labels["appName"]; !ok || appName == "" {
		return errors.New("appName is empty")
	}
	// 检查环境
	if env, ok := in.Labels["runEnv"]; !ok || env == "" {
		return errors.New("env is empty")
	}
	// 匹配前缀
	if i.prefix != "" && !strings.HasPrefix(in.Name, i.prefix) {
		return errors.New("prefix is not " + i.prefix)
	}
	// 检查后缀
	for _, suffix := range i.excludeSuffix {
		if strings.HasSuffix(appName, suffix) {
			return errors.New("exclude Suffix " + suffix)
		}
	}
	return nil
}
func (i *syncPod) add(obj interface{}) {
	in := obj.(*v1.Pod)

	err := i.commonCheck(in)
	if err != nil {
		xlog.Debug("k8sWork",
			xlog.String("step", "add-check"),
			xlog.String("zoneCode", i.zoneCode),
			xlog.String("podName", in.Name),
			xlog.String("reason", err.Error()))
		return
	}
	xlog.Info("k8sWork",
		xlog.String("step", "add-print"),
		xlog.String("zoneCode", i.zoneCode),
		xlog.String("podName", in.Name),
		xlog.Any("lab", in.Labels))

	err = i.mysqlCreateOrUpdate(i.zoneCode, obj.(*v1.Pod))
	if err != nil {
		xlog.Error("k8sWork",
			xlog.String("step", "add-mysqlCreateOrUpdate"),
			xlog.String("podName", in.Name),
			xlog.String("zoneCode", i.zoneCode),
			xlog.Any("err", err))
		return
	}
}

func (i *syncPod) update(old interface{}, new interface{}) {
	in := new.(*v1.Pod)

	err := i.commonCheck(in)
	if err != nil {
		xlog.Debug("k8sWork",
			xlog.String("step", "update-check"),
			xlog.String("zoneCode", i.zoneCode),
			xlog.String("podName", in.Name),
			xlog.String("reason", err.Error()))
		return
	}
	err = i.mysqlCreateOrUpdate(i.zoneCode, new.(*v1.Pod))
	if err != nil {
		xlog.Error("k8sWork",
			xlog.String("step", "update-mysqlCreateOrUpdate"),
			xlog.String("podName", in.Name),
			xlog.String("zoneCode", i.zoneCode),
			xlog.Any("err", err))
		return
	}

}

func (i *syncPod) delete(obj interface{}) {
	in := obj.(*v1.Pod)
	err := i.commonCheck(in)
	if err != nil {
		xlog.Debug("k8sWork",
			xlog.String("step", "delete-check"),
			xlog.String("zoneCode", i.zoneCode),
			xlog.String("podName", in.Name),
			xlog.String("reason", err.Error()))
		return
	}
	id, _ := strconv.Atoi(in.ObjectMeta.Labels["appId"])
	name := in.ObjectMeta.Name
	xlog.Info("k8sWork",
		xlog.String("step", "delete-print"),
		xlog.String("zoneCode", i.zoneCode),
		xlog.String("podName", name),
		xlog.Int("id", id))
	err = i.mysqlDelete(int32(id), name)
	if err != nil {
		xlog.Error("k8sWork",
			xlog.String("step", "delete-mysql"),
			xlog.String("zoneCode", i.zoneCode),
			xlog.Any("err", err),
			xlog.Any("id", id),
			xlog.String("name", name))
		return
	}
}

func (i *syncPod) clean() {
	// 数据库中存在对应记录进行delete操作
	t := time.Now().Add(-dataRetentionTime)
	err := i.db.Table("k8s_pod").Where("is_del=? and update_time<? and zone_code=?", 1, t, i.zoneCode).Delete(&db.K8sPod{}).Error
	if err != nil {
		xlog.Error("sync",
			xlog.String("typ", "pod"),
			xlog.String("act", "clean"),
			xlog.String("zoneCode", i.zoneCode),
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
	err = i.db.Select("md5").Where("aid=? and pod_name=? and is_del=?", m.Aid, m.PodName, 0).Find(&row).Error
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
	err = i.db.Select("*").Where("zone_code=? and is_del=?", zoneCode, 0).Find(&list).Error
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
