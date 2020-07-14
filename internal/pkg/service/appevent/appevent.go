package appevent

import (
	"time"

	"github.com/douyu/juno/pkg/model/view"

	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/pkg/model/db"
)

var (
	AppEvent *appEvent
)

type appEvent struct {
	eventChan chan db.AppEvent
}

func InitAppEvent() *appEvent {
	obj := &appEvent{
		eventChan: make(chan db.AppEvent, 10000),
	}
	go obj.ConsumeEvent()
	AppEvent = obj
	return obj
}

func (a *appEvent) PutEvent(event db.AppEvent) {
	select {
	case a.eventChan <- event:
	default:
	}
}

func (a *appEvent) ConsumeEvent() {
	var err error
	for value := range a.eventChan {
		value.CreateTime = time.Now().Unix()
		err = a.insert(value)
		if err != nil {
			continue
		}
	}
}

func (a *appEvent) insert(event db.AppEvent) error {
	if err := invoker.JunoMysql.Create(&event).Error; err != nil {
		return err
	}

	//invoker.AppStatic.WithLabelValues(event.App, event.Source, event.Operation).Inc()
	return nil
}

func (a *appEvent) List(currentPage, pageSize int) (res []db.AppEvent, page *view.Pagination, err error) {
	page = view.NewPagination(currentPage, pageSize)

	res = make([]db.AppEvent, 0)
	err = invoker.JunoMysql.Table("app_event").
		Select("*").
		Order("create_time desc").
		Count(&page.Total).
		Offset((currentPage - 1) * pageSize).
		Limit(pageSize).
		Find(&res).Error
	return
}
