package k8s

import (
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/douyu/jupiter/pkg/util/xgo"

	"github.com/douyu/juno/internal/pkg/invoker"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/labels"

	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/util"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/jinzhu/gorm"
	v1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/util/runtime"
	"k8s.io/client-go/informers"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/cache"
)

type keyLock struct {
	lmap sync.Map
}

func formatLockKey(aid uint32, env string) string {
	return fmt.Sprintf("%d-%s", aid, env)
}
func (a *keyLock) Lock(aid uint32, domain string) {
	key := formatLockKey(aid, domain)
	l, ok := a.lmap.Load(key)
	if ok {
		lock, ok := l.(*sync.RWMutex)
		if !ok {
			xlog.Error("aidlock error", xlog.String("key", key))
		}
		lock.Lock()
	} else {
		l := sync.RWMutex{}
		l.Lock()
		a.lmap.Store(key, &l)
	}
}
func (a *keyLock) UnLock(aid uint32, domain string) {

	key := formatLockKey(aid, domain)
	l, ok := a.lmap.Load(key)
	if ok {
		lock, ok := l.(*sync.RWMutex)
		if !ok {
			xlog.Error("aidlock error", xlog.String("aid", key))
		}
		lock.Unlock()
	} else {
		xlog.Error("aidlock error", xlog.String("aid", key), xlog.String("event", "l is not exist"))
	}
}

type syncPod struct {
	wlock         *keyLock
	zoneCode      string
	domain        string
	prefix        string
	excludeSuffix []string
	config        *rest.Config
	db            *gorm.DB
	stopCh        chan struct{}
}

func newSyncPod(zoneCode, prefix string, excludeSuffix []string, config *rest.Config, db *gorm.DB) *syncPod {
	// 解析zonecode
	tmp := strings.Split(zoneCode, "|")
	if len(tmp) < 1 {
		zoneCode = zoneCode + "|default"
	}
	s := &syncPod{
		wlock:         &keyLock{lmap: sync.Map{}},
		zoneCode:      strings.TrimSpace(strings.Split(zoneCode, "|")[0]),
		domain:        strings.TrimSpace(strings.Split(zoneCode, "|")[1]),
		config:        config,
		db:            db,
		prefix:        prefix,
		excludeSuffix: excludeSuffix,
		stopCh:        make(chan struct{}),
	}
	xlog.Info("k8sWork", xlog.String("step", "startWatch"), xlog.String("zoneCode", zoneCode))

	// 同步全量拉取一次
	err := s.sync("wsd", 0)
	if err != nil {
		xlog.Error("k8sWork",
			xlog.String("step", "start-sync"),
			xlog.String("err", err.Error()),
			xlog.String("zoneCode", zoneCode))
		return s
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
func (i *syncPod) getDomain() string {
	return i.domain
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
		appid   string
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
	if appid, ok = in.Labels[cfg.Cfg.K8s.LabelAid]; !ok || appid == "" {
		return errors.New("appid is empty")
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

	err = i.mysqlCreateOrUpdate(i.zoneCode, i.domain, obj.(*v1.Pod))
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
	err = i.mysqlCreateOrUpdate(i.zoneCode, i.domain, new.(*v1.Pod))
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
			xlog.String("domain", i.domain),
			xlog.String("podName", in.Name),
			xlog.String("reason", err.Error()))
		return
	}
	id, _ := strconv.ParseUint(in.ObjectMeta.Labels[cfg.Cfg.K8s.LabelAid], 10, 32)
	name := in.ObjectMeta.Name
	xlog.Info("k8sWork",
		xlog.String("step", "delete-print"),
		xlog.String("domain", i.domain),
		xlog.String("podName", name),
		xlog.String("id", in.ObjectMeta.Labels[cfg.Cfg.K8s.LabelAid]))
	err = i.mysqlDelete(uint32(id), i.domain, name)
	if err != nil {
		xlog.Error("k8sWork",
			xlog.String("step", "delete-mysql"),
			xlog.String("domain", i.domain),
			xlog.Any("err", err),
			xlog.Any("id", id),
			xlog.String("name", name))
		return
	}
}

func (i *syncPod) clean() {
	// 数据库中存在对应记录进行delete操作
	t := time.Now().Add(-dataRetentionTime)
	err := i.db.Table("k8s_pod").Where("is_del=? and update_time<? and domain=?", 1, t, i.domain).Delete(&db.K8sPod{}).Error
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

func (i *syncPod) sync(namespace string, aid uint32) error {
	// 同步全量拉取一次
	list, err := i.List(namespace, aid)
	xlog.Info("k8sWork",
		xlog.String("step", "syncPod.sync"),
		xlog.String("namespace", namespace),
		xlog.Int("len", len(list)),
		xlog.Int("aid", int(aid)),
		xlog.String("zoneCode", i.zoneCode),
	)
	if err != nil {
		return err
	}
	for aid, config := range i.structMap(list) {
		err := i.mysqlBatchUpdate(aid, i.domain, config)
		if err != nil {
			xlog.Error("k8sWork",
				xlog.String("step", "sync-mysql"),
				xlog.String("namespace", "namespace"),
				xlog.String("err", err.Error()),
				xlog.Int("len", len(list)),
				xlog.Int("aid", int(aid)),
				xlog.String("domain", i.domain),
			)
		}
		time.Sleep(time.Millisecond * 20)
	}
	return nil
}

func (s *syncPod) structMap(data []v1.Pod) map[uint32][]v1.Pod {
	structMap := map[uint32][]v1.Pod{}
	for _, item := range data {
		if s.commonCheck(&item) != nil {
			continue
		}
		appid, _ := strconv.ParseUint(item.Labels[cfg.Cfg.K8s.LabelAid], 10, 32)
		if appid == 0 {
			continue
		}

		if _, ok := structMap[uint32(appid)]; !ok {
			structMap[uint32(appid)] = []v1.Pod{}
		}

		structMap[uint32(appid)] = append(structMap[uint32(appid)], item)
	}
	return structMap
}

// List 获取全量pod列表
func (i *syncPod) List(namespace string, aid uint32) (res []v1.Pod, err error) {
	res = make([]v1.Pod, 0)

	clientSet, err := kubernetes.NewForConfig(i.config)
	if err != nil {
		xlog.Error("k8sWork",
			xlog.String("step", "list-NewForConfig"),
			xlog.String("domain", i.domain),
			xlog.Int64("aid", int64(aid)),
			xlog.Any("err", err))
		return
	}
	Continue := ""
	step := 100
	labelSelector := ""
	first := true
	var data *v1.PodList
	if aid > 0 {
		labelSelector = fmt.Sprintf(cfg.Cfg.K8s.LabelAid+"=%d", aid)
	}
	for Continue != "" || first {
		data, err = clientSet.CoreV1().Pods(namespace).List(metav1.ListOptions{
			LabelSelector: labelSelector,
			Limit:         int64(step),
			Continue:      Continue,
		})
		if err != nil {
			xlog.Error("k8sWork",
				xlog.String("step", "list-List"),
				xlog.Int64("aid", int64(aid)),
				xlog.String("domain", i.domain),
				xlog.Any("err", err))
			return
		}
		if first == true {
			first = false
		}
		res = append(res, data.Items...)
		Continue = data.Continue
		time.Sleep(time.Millisecond * 200)
	}

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
func (i *syncPod) mysqlBatchUpdate(aid uint32, domain string, items []v1.Pod) (err error) {

	i.wlock.Lock(aid, domain)
	defer func() {
		i.wlock.UnLock(aid, domain)
	}()
	tx := i.db.Begin()
	//删除该集群下所有的aid、env的配置
	err = tx.Table("k8s_pod").Where("domain=? && aid=? ", i.domain, aid).Delete(&db.K8sPod{}).Error
	if err != nil {
		tx.Rollback()
		return err
	}
	sql := "insert into k8s_pod (aid,env,zone_code,domain,pod_name,app_name,namespace,host_ip,pod_ip,node_name,start_time,update_time,image,status,instance_group_id,instance_group_name,md5,is_del) values"
	var values []string
	for _, item := range items {
		var m db.K8sPod
		m.Formatting(i.zoneCode, i.domain, &item)

		values = append(values, fmt.Sprintf("(%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%d)",
			m.Aid, m.Env, m.ZoneCode, m.Domain, m.PodName, m.AppName,
			m.Namespace, m.HostIp, m.PodIp, m.NodeName, m.StartTime,
			m.UpdateTime, m.Image, m.Status, m.InstanceGroupName,
			m.InstanceGroupName, m.MD5, m.IsDel))

	}
	sql += strings.Join(values, ",")
	err = tx.Exec(sql).Error
	if err != nil {
		tx.Rollback()
		return err
	}
	tx.Commit()
	return
}
func (i *syncPod) mysqlCreateOrUpdate(zoneCode, domain string, in *v1.Pod) (err error) {

	var m db.K8sPod
	m.Formatting(zoneCode, domain, in)
	i.wlock.Lock(uint32(m.Aid), domain)
	defer func() {
		i.wlock.UnLock(uint32(m.Aid), domain)
	}()
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
			"domain":              m.Domain,
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

func (i *syncPod) mysqlDelete(podAid uint32, domain, podName string) (err error) {
	i.wlock.Lock(podAid, domain)
	defer i.wlock.UnLock(podAid, domain)
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
		xlog.Error("mysqlList", xlog.Any("err", err))
		return
	}
	return
}

// mysqlList 获取数据库列表
func mysqlNamespaceList(namespace string, aid uint32) (domainList []string, err error) {
	list := []db.K8sPod{}
	sql := invoker.JunoMysql.Select("domain").Where("namespace=? and is_del=? ", namespace, 0)
	if aid > 0 {
		sql = sql.Where("aid=?", aid)
	}
	err = sql.Group("domain").Find(&list).Error
	if err != nil {
		xlog.Error("mysqlNamespaceList", xlog.Any("err", err))
		return
	}
	domainList = []string{}
	for _, item := range list {
		domainList = append(domainList, item.Domain)
	}

	return
}

// mysqlList 获取数据库列表
func cleanByDomain(namespace string, aid uint32, domain string) (domainList []string, err error) {
	list := []db.K8sPod{}
	// 删除没有监听的domain下的配置，不监听的domain不会有数据更新 这里不加锁了
	sql := invoker.JunoMysql.Where("namespace=? and is_del=? and domain=?", namespace, 0, domain)
	if aid > 0 {
		sql = sql.Where("aid=?", aid)
	}
	err = sql.Delete(&db.K8sPod{}).Error
	if err != nil {
		xlog.Error("mysqlNamespaceList", xlog.Any("err", err))
		return
	}
	domainList = []string{}
	for _, item := range list {
		domainList = append(domainList, item.Domain)
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
