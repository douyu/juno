package casbin

import (
	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/pkg/model/db"
)

type PolicyType struct {
	SubSwitchOn int
	ObjSwitchOn int
	ActSwitchOn int
}

func PolicyAuthList() (list []db.CasbinPolicyAuth, err error) {
	err = invoker.JunoMysql.Find(&list).Error
	return
}

func PolicyGroupList() (list []db.CasbinPolicyGroup, err error) {
	err = invoker.JunoMysql.Find(&list).Error
	return
}

// 110
func genPolicyType(sub int, obj int, act int) int {
	return sub & obj & act
}

// 010 100  => 100
func parsePolicyType(policy int) PolicyType {
	p := PolicyType{}
	if policy&SubSwitchOn == SubSwitchOn {
		p.SubSwitchOn = 1
	}

	if policy&ObjSwitchOn == ObjSwitchOn {
		p.SubSwitchOn = 1
	}

	if policy&ActSwitchOn == ActSwitchOn {
		p.ActSwitchOn = 1
	}
	return p
}
