package platform

import (
	"github.com/douyu/juno/internal/app/core"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/testplatform"
)

func WorkerZones(c *core.Context) (err error) {
	zones, err := testplatform.WorkerZones()
	if err != nil {
		return c.OutputJSON(output.MsgErr, err.Error())
	}

	return c.OutputJSON(output.MsgOk, "", c.WithData(zones))
}
