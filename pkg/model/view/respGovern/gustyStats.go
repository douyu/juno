package respGovern

import (
	"google.golang.org/grpc/connectivity"
)

// gusty状态信息
type GustyStats struct {
	RuntimeStats
	Gustys map[string]OneGusty `json:"gustys"`
}

type OneGusty struct {
	State  connectivity.State `json:"state"`
	Target string             `json:"target"`
	Config interface{}        `json:"config"`
}
