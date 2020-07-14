package casbin

import (
	"fmt"
	casbinModel "github.com/casbin/casbin/v2/model"
	"github.com/casbin/casbin/v2/persist"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/xlog"
	"go.uber.org/zap"
)

var _ persist.Adapter = (*CasbinAdapter)(nil)

const (
	SubSwitchOn = 1 << 2 // single 000, group 100
	ObjSwitchOn = 1 << 1 // single 000, group 010
	ActSwitchOn = 1      // single 000, group 001
)

// CasbinAdapter
type CasbinAdapter struct{}

// LoadPolicy loads all policy rules from the storage.
func (a *CasbinAdapter) LoadPolicy(model casbinModel.Model) (err error) {
	err = a.loadPolicyAuth(model)
	if err != nil {
		xlog.Error("load policy auth error", zap.Error(err))
		return
	}

	err = a.loadPolicyGroup(model)
	if err != nil {
		xlog.Error("load policy group error", zap.Error(err))
		return err
	}
	return nil
}

// 加载角色策略(p,uid, appname, url)              000
// 加载角色策略(p,user gid, appname, url)         100
// 加载角色策略(p,uid, appname gid, url)          010
// 加载角色策略(p,user, appname , url gid)        001
// 加载角色策略(p,uid, appname, url)              011
// 加载角色策略(p,user gid, appname gid, url)     110
// 加载角色策略(p,user gid, appname, url gid)     101
// 加载角色策略(p,user, appname gid, url gid)     011
// 加载角色策略(p,user gid, appname gid, url gid) 111
func (a *CasbinAdapter) loadPolicyAuth(m casbinModel.Model) (err error) {
	authList, err := PolicyAuthList()
	if err != nil {
		return
	}

	for _, item := range authList {
		line := fmt.Sprintf("p,%s,%s,%s,%s", item.Sub, item.Obj, item.Act, item.Type)
		persist.LoadPolicyLine(line, m)
	}
	return nil
}

// 加载用户策略(g,user_id,role_id)
func (a *CasbinAdapter) loadPolicyGroup(m casbinModel.Model) (err error) {
	authList, err := PolicyGroupList()
	if err != nil {
		return
	}
	var line string
	for _, item := range authList {
		groupKey := CasbinGroupKey(item.Type, item.GroupName)
		switch item.Type {
		case db.CasbinGroupTypeUser:
			line = fmt.Sprintf("g,%d,%s", item.Uid, groupKey)
		case db.CasbinGroupTypeMenu:
			line = fmt.Sprintf("g2,%s,%s", item.URL, groupKey)
		case db.CasbinGroupTypeApp:
			line = fmt.Sprintf("g3,%s@%s,%s", item.AppName, item.AppEnv, groupKey)
		}
		persist.LoadPolicyLine(line, m)
	}
	return nil
}

// SavePolicy saves all policy rules to the storage.
func (a *CasbinAdapter) SavePolicy(model casbinModel.Model) error {
	return nil
}

// AddPolicy adds a policy rule to the storage.
// This is part of the Auto-Save feature.
func (a *CasbinAdapter) AddPolicy(sec string, ptype string, rule []string) error {
	return nil
}

// RemovePolicy removes a policy rule from the storage.
// This is part of the Auto-Save feature.
func (a *CasbinAdapter) RemovePolicy(sec string, ptype string, rule []string) error {
	return nil
}

// RemoveFilteredPolicy removes policy rules that match the filter from the storage.
// This is part of the Auto-Save feature.
func (a *CasbinAdapter) RemoveFilteredPolicy(sec string, ptype string, fieldIndex int, fieldValues ...string) error {
	return nil
}
