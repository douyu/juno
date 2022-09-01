package wsevent

import (
	"sync"

	"github.com/douyu/jupiter/pkg/xlog"
)

type (
	WSEvent struct {
		option Option

		subscribersMtx sync.Mutex
		subscribers    map[string][]SubscribeHandler
	}

	Option struct {
	}

	SubscribeHandler func(res interface{})
)

var (
	instance *WSEvent
)

func Init(o Option) {
	instance = &WSEvent{
		option:         o,
		subscribersMtx: sync.Mutex{},
		subscribers:    map[string][]SubscribeHandler{},
	}
}

func Instance() *WSEvent {
	if instance == nil {
		xlog.Fatal("wsevent MUST be initialized before call wsevent.Instance()")
	}

	return instance
}

func (w *WSEvent) Pub(event string, data interface{}) {
	w.subscribersMtx.Lock()
	defer w.subscribersMtx.Unlock()

	subs := w.subscribers[event]
	go func() {
		for _, sub := range subs {
			sub(data)
		}
	}()
}

func (w *WSEvent) RemoveEvent(event string) {
	w.subscribersMtx.Lock()
	defer w.subscribersMtx.Unlock()
	w.subscribers[event] = make([]SubscribeHandler, 0)
}

func (w *WSEvent) Sub(event string, handler SubscribeHandler) {
	w.subscribersMtx.Lock()
	defer w.subscribersMtx.Unlock()
	w.subscribers[event] = append(w.subscribers[event], handler)
}
