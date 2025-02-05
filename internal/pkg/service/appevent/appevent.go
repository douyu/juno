package appevent

import (
	"context"
	"encoding/json"
	"github.com/douyu/jupiter/pkg/store/gorm"
	"github.com/douyu/jupiter/pkg/xlog"
	"go.uber.org/zap"
	"strings"
	"time"

	"github.com/douyu/juno/pkg/cfg"

	"github.com/apache/rocketmq-client-go/v2/primitive"
	"github.com/douyu/jupiter/pkg/client/rocketmq"

	"github.com/douyu/juno/pkg/model/view"

	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/pkg/model/db"
)

var (
	AppEvent *appEvent
)

type appEvent struct {
	eventChan     chan db.AppEvent
	eventProducer *rocketmq.Producer
	topic         string
}

func InitAppEvent(eventProducer *rocketmq.Producer, topic string) {
	obj := &appEvent{
		eventChan:     make(chan db.AppEvent, 10000),
		eventProducer: eventProducer,
		topic:         topic,
	}
	go obj.ConsumeEvent()
	AppEvent = obj
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
	err := invoker.JunoMysql.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&event).Error; err != nil {
			xlog.Error("app event insert err", zap.Error(err))
			return err
		}
		if cfg.Cfg.JunoEvent.Rocketmq.Enable {
			event.HandleOperationName()
			event.HandleSourceName()
			msg := &eventMessage{AppEvent: event, HostName: strings.Split(event.HostName, ",")}
			eventMsg, _ := json.Marshal(&msg)
			ctx, cancelFn := context.WithTimeout(context.Background(), time.Second)
			_, err := a.eventProducer.SendSync(ctx, primitive.NewMessage(a.topic, eventMsg))
			cancelFn()
			if err != nil {
				xlog.Error("app event eventProducer err", zap.Error(err))
				return err
			}
		}
		return nil
	})
	return err
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
