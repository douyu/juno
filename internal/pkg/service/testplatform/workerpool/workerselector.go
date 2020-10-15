package workerpool

import (
	"sort"
	"sync"
	"time"

	"github.com/douyu/jupiter/pkg/xlog"

	"github.com/douyu/juno/pkg/model/db"
)

type (
	workerSelector struct {
		mtx   sync.RWMutex
		index int
		keys  []string
		nodes map[string]db.WorkerNode // hostname -> node
	}
)

func makeSelector() *workerSelector {
	return &workerSelector{
		mtx:   sync.RWMutex{},
		index: 0,
		keys:  []string{},
		nodes: make(map[string]db.WorkerNode),
	}
}

func (s *workerSelector) push(node db.WorkerNode) {
	s.mtx.Lock()
	defer s.mtx.Unlock()

	currentNode, ok := s.nodes[node.HostName]
	if !(ok && currentNode.LastHeartbeat.After(node.LastHeartbeat)) {
		s.nodes[node.HostName] = node
	}

	keys := make([]string, 0)
	for k := range s.nodes {
		keys = append(keys, k)
	}

	sort.Strings(keys)
	s.keys = keys
}

func (s *workerSelector) pick() (node db.WorkerNode, err error) {
	s.mtx.RLock()
	defer s.mtx.RUnlock()

	if len(s.nodes) == 0 {
		err = ErrNodesEmpty
		return
	}

	s.index = (s.index + 1) % len(s.nodes)
	node = s.nodes[s.keys[s.index]]

	return
}

func (s *workerSelector) clearTimeoutNodes(duration time.Duration) {
	s.mtx.Lock()
	defer s.mtx.Unlock()

	timeoutNodes := make([]string, 0)
	validNodes := make([]string, 0)

	for hostName, node := range s.nodes {
		now := time.Now()
		if node.LastHeartbeat.Add(duration).Before(now) {
			// timeout
			timeoutNodes = append(timeoutNodes, hostName)
		} else {
			validNodes = append(validNodes, hostName)
		}
	}

	for _, hostName := range timeoutNodes {
		xlog.Info("worker node removed for heartbeat timeout", xlog.Any("node", s.nodes[hostName]))
		delete(s.nodes, hostName)
	}

	s.keys = validNodes
}
