package workerpool

import (
	"errors"
	"sync"
	"time"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/jinzhu/gorm"
)

type (
	WorkerPool struct {
		option   Option
		nodesMtx sync.RWMutex
		nodes    map[string]*workerSelector // zone_code => [node]
	}

	Option struct {
		DB               *gorm.DB
		HeartbeatTimeout time.Duration
	}
)

var (
	instance *WorkerPool
	initOnce sync.Once

	ErrNodesEmpty = errors.New("worker nodes empty in current env")
)

func Instance() *WorkerPool {
	initOnce.Do(func() {
		instance = new(WorkerPool)
		instance.nodesMtx = sync.RWMutex{}
		instance.nodes = make(map[string]*workerSelector)
	})

	return instance
}

func (w *WorkerPool) Init(option Option) {
	w.option = option

	go func() {
		for {
			w.syncFromDB()
			time.Sleep(10 * time.Second)
		}
	}()

	go func() {
		for {
			w.clearTimeoutNodes()
			time.Sleep(1 * time.Second)
		}
	}()
}

func (w *WorkerPool) clearTimeoutNodes() {
	instance.nodesMtx.Lock()
	defer instance.nodesMtx.Unlock()

	for _, selector := range instance.nodes {
		selector.clearTimeoutNodes(w.option.HeartbeatTimeout)
	}
}

func (w *WorkerPool) syncFromDB() {
	w.nodesMtx.Lock()
	defer w.nodesMtx.Unlock()

	var nodes []db.WorkerNode

	timeoutPoint := time.Now().Add(-1 * w.option.HeartbeatTimeout)
	err := w.option.DB.Where("last_heartbeat >= ?", timeoutPoint).Find(&nodes).Error
	if err != nil {
		xlog.Error("syncFromDB", xlog.String("err", err.Error()))
		return
	}

	for _, worker := range nodes {
		selector := w.nodes[worker.ZoneCode]
		if selector == nil {
			selector = makeSelector()
		}

		selector.push(worker)
		w.nodes[worker.ZoneCode] = selector
	}
}

func (w *WorkerPool) Heartbeat(params view.WorkerHeartbeat) {
	var node db.WorkerNode

	w.nodesMtx.Lock()
	defer w.nodesMtx.Unlock()
	tx := w.option.DB.Begin()
	{
		err := tx.Where("host_name = ? and zone_code = ? and env = ? and region_code = ?",
			params.HostName, params.ZoneCode, params.Env, params.RegionCode).First(&node).Error
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				node = db.WorkerNode{
					HostName:   params.HostName,
					RegionCode: params.RegionCode,
					ZoneCode:   params.ZoneCode,
					Env:        params.Env,
				}
			} else {
				xlog.Error("WorkerPool.Heartbeat", xlog.String("err", err.Error()))
				return
			}
		}

		node.LastHeartbeat = time.Now()

		node.RegionName = params.RegionName
		node.ZoneName = params.ZoneName
		node.IP = params.IP
		node.Port = params.Port

		err = tx.Save(&node).Error
		if err != nil {
			xlog.Error("WorkerPool.Heartbeat save node failed", xlog.String("err", err.Error()))
			tx.Rollback()
			return
		}

		w.updateNode(node)
	}
	tx.Commit()
}

//updateNode NOT SAFE, MUST lock w.nodesMtx before call this function
func (w *WorkerPool) updateNode(node db.WorkerNode) {
	selector, ok := w.nodes[node.ZoneCode]
	if !ok {
		selector = makeSelector()
	}

	selector.push(node)
	w.nodes[node.ZoneCode] = selector
}

func (w *WorkerPool) Select(zoneCode string) (node db.WorkerNode, err error) {
	w.nodesMtx.RLock()
	defer w.nodesMtx.RUnlock()

	selector := w.nodes[zoneCode]
	if selector == nil {
		err = ErrNodesEmpty
		return
	}

	node, err = selector.pick()
	if err != nil {
		return
	}

	return
}
