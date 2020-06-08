package util

import (
	"sync"
	"sync/atomic"
	"unsafe"
)

const mutexLocked = 1 << iota

// Mutex mutext with TryLock
type Mutex struct {
	sync.Mutex
}

// TryLock try lock
func (m *Mutex) TryLock() bool {
	return atomic.CompareAndSwapInt32((*int32)(unsafe.Pointer(&m.Mutex)), 0, mutexLocked)
}
