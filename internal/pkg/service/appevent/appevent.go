package appevent

import (
	"context"
	"encoding/json"
	"time"

	"github.com/douyu/juno/pkg/cfg"

	"github.com/apache/rocketmq-client-go/primitive"

	rocketmq2 "github.com/apache/rocketmq-client-go"

	"github.com/douyu/juno/pkg/model/view"

	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/pkg/model/db"
)

var (
	AppEvent *appEvent
)

type appEvent struct {
	eventChan     chan db.AppEvent
	eventProducer rocketmq2.Producer
	topic         string
}

func InitAppEvent(eventProducer rocketmq2.Producer, topic string) *appEvent {
	obj := &appEvent{
		eventChan:     make(chan db.AppEvent, 10000),
		eventProducer: eventProducer,
		topic:         topic,
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
	tx := invoker.JunoMysql.Begin()
	if err := tx.Create(&event).Error; err != nil {
		tx.Rollback()
		return err
	}

	if cfg.Cfg.JunoEvent.Rocketmq.Enable {
		event.HandleOperationName()
		event.HandleSourceName()
		eventMsg, _ := json.Marshal(&event)
		ctx, cancelFn := context.WithTimeout(context.Background(), time.Second)
		_, err := a.eventProducer.SendSync(ctx, primitive.NewMessage(a.topic, eventMsg))
		cancelFn()
		if err != nil {
			tx.Rollback()
			return err
		}
	}

	err := tx.Commit().Error
	if err != nil {
		return err
	}

	//invoker.AppStatic.WithLabelValues(event.App, event.Source, event.Operation).Inc()
	return nil
}

func (a *appEvent) List(param view.ReqEventList) (res []db.AppEvent, page *view.Pagination, err error) {
	currentPage, pageSize := param.Page, param.PageSize
	page = view.NewPagination(currentPage, pageSize)

	query := invoker.JunoMysql.Table("app_event")
	if param.Env != "" {
		query = query.Where("env = ?", param.Env)
	}
	if param.Zone != "" {
		query = query.Where("zone = ?", param.Zone)
	}
	if param.AppName != "" {
		query = query.Where("app_name = ?", param.AppName)
	}

	res = make([]db.AppEvent, 0)
	err = query.Count(&page.Total).
		Order("create_time desc").
		Offset((currentPage - 1) * pageSize).
		Limit(pageSize).
		Find(&res).Error

	for index, item := range res {
		item.HandleOperationName()
		item.HandleSourceName()
		res[index] = item
	}

	return
}
