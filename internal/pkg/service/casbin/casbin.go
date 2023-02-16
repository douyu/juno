package casbin

import (
	"fmt"
	"sort"
	"strconv"
	"time"

	"github.com/casbin/casbin/v2"
	"github.com/casbin/casbin/v2/model"
	"github.com/casbin/casbin/v2/persist"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	log "github.com/sirupsen/logrus"
	"gopkg.in/yaml.v2"
)

type (
	CasbinService struct {
		*casbin.SyncedEnforcer
		enabled bool

		Resource struct {
			Permission PermissionTree    `yaml:"permission" json:"permission"`
			App        AppPermissionList `yaml:"app" json:"app"`
		}
	}

	PermissionTree []MenuTreeItem

	AppPermissionList []AppPermissionItem

	MenuTreeItem struct {
		Name     string         `yaml:"name" json:"name"`
		Path     string         `yaml:"path" json:"path"`
		Icon     string         `yaml:"icon" json:"icon"`
		API      []APIItem      `yaml:"api" json:"api"`
		Children PermissionTree `yaml:"children" json:"children"`
	}

	AppPermissionItem struct {
		Name string `yaml:"name" json:"name"`
		Key  string `yaml:"key" json:"key"`
	}

	APIItem struct {
		Name   string `yaml:"name" json:"name"`
		Path   string `yaml:"path" json:"path"`
		Method string `yaml:"method" json:"method,omitempty"`
	}

	Object struct {
		Resource string
		Type     db.CasbinPolicyType
	}

	APIListItem struct {
		Name   string `json:"name"`
		Path   string `json:"path"`
		Method string `json:"method"`
	}

	Action string
)

var (
	Casbin *CasbinService

	ActionReadMenu Action = "menu:read"
)

// InitCasbin 初始化casbin
func InitCasbin(adapter persist.Adapter) (err error) {
	Casbin = &CasbinService{
		SyncedEnforcer: nil,
		enabled:        cfg.Cfg.Casbin.Enable,
	}

	config := cfg.Cfg.Casbin

	Casbin.loadResourceFile()

	if !cfg.Cfg.Casbin.Enable {
		return
	}
	m, err := model.NewModelFromString(modelContent)
	if err != nil {
		return
	}
	e, err := casbin.NewSyncedEnforcer(m)
	e.EnableLog(config.Debug)

	err = e.InitWithModelAndAdapter(e.GetModel(), adapter)
	if err != nil {
		return
	}
	e.EnableEnforce(config.Enable)

	if config.AutoLoad {
		e.StartAutoLoadPolicy(time.Duration(config.AutoLoadInternal) * time.Second)
	}

	Casbin.SyncedEnforcer = e

	return
}

func (c *CasbinService) loadResourceFile() {
	err := yaml.Unmarshal([]byte(resourceContent), &c.Resource)
	if err != nil {
		log.Panicf("Unmarshall %s failed: %s", resourceContent, err.Error())
	}
}

func (c *CasbinService) CheckPermission(sub, object, action string, policyType db.CasbinPolicyType) (ok bool, err error) {
	if !c.enabled {
		return true, nil
	}

	ok, err = c.Enforce(sub, object, action, string(policyType))
	if err != nil {
		log.Errorf("CasbinService.CheckUserPermission: %s", err.Error())
		return false, err
	}

	return
}

func (c *CasbinService) CheckUserPermission(u *db.User, object string, action string, policyType db.CasbinPolicyType) (ok bool, err error) {
	ok, err = c.CheckPermission(strconv.Itoa(u.Uid), object, action, policyType)
	if err != nil {
		log.Errorf("CasbinService.CheckUserPermission: %s", err.Error())
		return false, err
	}

	return
}

func (c *CasbinService) GetMenu(sub string) (menu view.MenuTree, err error) {
	var genMenuTreeFunctor func(tree PermissionTree) (menu view.MenuTree)
	genMenuTreeFunctor = func(tree PermissionTree) view.MenuTree {
		ret := view.MenuTree{}
		for _, item := range tree {

			hasPermission, _ := c.CheckPermission(sub, item.Path, string(ActionReadMenu), db.CasbinPolicyTypeMenu)

			if !hasPermission {
				continue
			}

			menuItem := view.MenuTreeItem{
				Name:     item.Name,
				Path:     item.Path,
				Icon:     item.Icon,
				Children: nil,
			}

			if len(item.Children) > 0 {
				menuItem.Children = genMenuTreeFunctor(item.Children)
			}

			ret = append(ret, menuItem)
		}

		return ret
	}

	menu = genMenuTreeFunctor(c.Resource.Permission)

	return
}

func (c *CasbinService) LoadPolicy() error {
	if !cfg.Cfg.Casbin.Enable {
		return nil
	}

	return c.SyncedEnforcer.LoadPolicy()
}

//
//func (c *CasbinService) GetAPITree(sub string) (apiTree APITree, err error) {
//	var genTreeFn func(tree APITree) APITree
//
//	genTreeFn = func(tree APITree) APITree {
//		var ret APITree
//		for _, item := range tree {
//			treeItem := APIItem{
//				Name:   item.Name,
//				Path:   item.Path,
//				Method: item.Method,
//			}
//			if len(item.Children) > 0 {
//				treeItem.Children = genTreeFn(item.Children)
//				if len(treeItem.Children) > 0 {
//					ret = append(ret, treeItem)
//				}
//			} else {
//				treeItem.Method = item.Method
//				ok, _ := c.CheckPermission(sub, item.Path, *item.Method, db.CasbinPolicyTypeAPI)
//				if ok {
//					ret = append(ret, treeItem)
//				}
//			}
//		}
//		return ret
//	}
//
//	apiTree = genTreeFn(c.Resource.API)
//
//	return
//}

func (c *CasbinService) GetAPIItem(path, method string) (apiItem *APIItem) {
	fullApiList := c.FullAPIList()
	for _, item := range fullApiList {
		if item.Path == path && item.Method == method {
			apiItem = &item
			return
		}
	}

	return nil
}

func (c *CasbinService) UserMenu(u *db.User) (menu view.MenuTree, err error) {
	if u == nil || !u.IsLogin() {
		err = fmt.Errorf("无效的登录账户")
		return
	}

	return c.GetMenu(strconv.Itoa(u.Uid))
}

func (c *CasbinService) APIList(sub string) (list []APIItem) {
	list = make([]APIItem, 0)
	apiList := c.FullAPIList()
	for _, item := range apiList {
		ok, _ := c.CheckPermission(sub, item.Path, item.Method, db.CasbinPolicyTypeAPI)
		if ok {
			list = append(list, item)
		}
	}

	return
}

// 获取所有的API权限列表（去重结果）
func (c *CasbinService) FullAPIList() (list []APIItem) {
	apiMap := make(map[string]APIItem) // "METHOD_PATH" -> APIListItem

	var genApiListFn func(tree PermissionTree)
	genApiListFn = func(tree PermissionTree) {
		for _, item := range tree {
			for _, apiItem := range item.API {
				key := fmt.Sprintf("%s_%s", apiItem.Method, apiItem.Path)
				apiMap[key] = apiItem
			}

			if len(item.Children) > 0 {
				genApiListFn(item.Children)
			}
		}
	}

	genApiListFn(c.Resource.Permission)

	for _, item := range apiMap {
		list = append(list, item)
	}

	sort.Slice(list, func(i, j int) bool {
		return list[i].Path < list[j].Path
	})

	return
}

func (c *CasbinService) CheckAppPermissionKeyValid(key string) bool {
	for _, item := range c.Resource.App {
		if item.Key == key {
			return true
		}
	}

	return false
}

func (c *CasbinService) CheckAPIValid(path, method string) bool {
	for _, item := range c.FullAPIList() {
		if item.Path == path && item.Method == method {
			return true
		}
	}

	return false
}

func (c *CasbinService) AppPermissionList() AppPermissionList {
	return c.Resource.App
}
