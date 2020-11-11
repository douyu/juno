package appevent

import "github.com/douyu/juno/pkg/model/db"

type eventMessage struct {
	db.AppEvent
	HostName []string `json:"host_name"`
}
