package casbin

import (
	"fmt"
	"github.com/casbin/casbin/v2"
	"github.com/casbin/casbin/v2/persist"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	log "github.com/sirupsen/logrus"
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"strconv"
	"time"
)

type (
	CasbinService struct {
		*casbin.SyncedEnforcer

		Resource struct {
			Menu MenuTree          `yaml:"menu" json:"menu"`
			App  AppPermissionList `yaml:"app" json:"app"`
			API  APITree           `yaml:"api" json:"api"`
		}
	}

	MenuTree []MenuTreeItem

	AppPermissionList []AppPermissionItem

	APITree []APITreeItem

	MenuTreeItem struct {
		Name     string   `yaml:"name" json:"name"`
		Path     string   `yaml:"path" json:"path"`
		Icon     string   `yaml:"icon" json:"icon"`
		Children MenuTree `yaml:"children" json:"children"`
	}

	AppPermissionItem struct {
		Name string `yaml:"name" json:"name"`
		Key  string `yaml:"key" json:"key"`
	}

	APITreeItem struct {
		Name     string  `yaml:"name" json:"name"`
		Path     string  `yaml:"path" json:"path"`
		Method   *string `yaml:"method" json:"method,omitempty"`
		Children APITree `yaml:"children" json:"children,omitempty"`
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
func InitCasbin(adapter persist.Adapter) (*CasbinService, func(), error) {
	cleanFunc := func() {}
	if !cfg.Cfg.Casbin.Enable {
		return nil, cleanFunc, nil
	}

	Casbin = &CasbinService{
		SyncedEnforcer: nil,
	}

	config := cfg.Cfg.Casbin
	if config.Model == "" {
		Casbin.SyncedEnforcer = new(casbin.SyncedEnforcer)
		return Casbin, nil, nil
	}

	e, err := casbin.NewSyncedEnforcer(config.Model)
	if err != nil {
		return nil, nil, err
	}
	e.EnableLog(config.Debug)

	err = e.InitWithModelAndAdapter(e.GetModel(), adapter)
	if err != nil {
		return nil, nil, err
	}
	e.EnableEnforce(config.Enable)

	if config.AutoLoad {
		e.StartAutoLoadPolicy(time.Duration(config.AutoLoadInternal) * time.Second)
		cleanFunc = func() {
			e.StopAutoLoadPolicy()
		}
	}

	if config.ResourceFile == "" {
		log.Panicf("invalid ResourceFile is ''")
	}
	Casbin.loadResourceFile(config.ResourceFile)

	Casbin.SyncedEnforcer = e

	return Casbin, cleanFunc, nil
}

func (c *CasbinService) loadResourceFile(resourceFile string) {
	resourceContent, err := ioutil.ReadFile(resourceFile)
	if err != nil {
		log.Panicf("Read Resource File Failed: %s", err.Error())
	}

	err = yaml.Unmarshal(resourceContent, &c.Resource)
	if err != nil {
		log.Panicf("Unmarshall %s failed: %s", resourceFile, err.Error())
	}
}

func (c *CasbinService) CheckPermission(sub, object, action string, policyType db.CasbinPolicyType) (ok bool, err error) {
	ok, err = c.Enforce(sub, object, action, string(policyType))
	if err != nil {
		log.Errorf("CasbinService.CheckUserPermission: %s", err.Error())
		return false, err
	}

	return
}

func (c *CasbinService) CheckUserPermission(u *db.User, object string, action string, policyType db.CasbinPolicyType) (ok bool, err error) {
	ok, err = c.Enforce(strconv.Itoa(u.Uid), object, action, string(policyType))
	if err != nil {
		log.Errorf("CasbinService.CheckUserPermission: %s", err.Error())
		return false, err
	}

	return
}

func (c *CasbinService) GetMenu(sub string) (menu view.MenuTree, err error) {
	var genMenuTreeFunctor func(tree MenuTree) (menu view.MenuTree)
	genMenuTreeFunctor = func(tree MenuTree) view.MenuTree {
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

	menu = genMenuTreeFunctor(c.Resource.Menu)

	return
}

func (c *CasbinService) GetAPITree(sub string) (apiTree APITree, err error) {
	var genTreeFn func(tree APITree) APITree

	genTreeFn = func(tree APITree) APITree {
		var ret APITree
		for _, item := range tree {
			treeItem := APITreeItem{
				Name:   item.Name,
				Path:   item.Path,
				Method: item.Method,
			}
			if len(item.Children) > 0 {
				treeItem.Children = genTreeFn(item.Children)
				if len(treeItem.Children) > 0 {
					ret = append(ret, treeItem)
				}
			} else {
				treeItem.Method = item.Method
				ok, _ := c.CheckPermission(sub, item.Path, *item.Method, db.CasbinPolicyTypeAPI)
				if ok {
					ret = append(ret, treeItem)
				}
			}
		}
		return ret
	}

	apiTree = genTreeFn(c.Resource.API)

	return
}

func (c *CasbinService) GetAPIItem(path, method string) (apiItem *APITreeItem) {
	var findFn func(tree APITree)

	findFn = func(tree APITree) {
		for _, item := range tree {
			if item.Path == path && item.Method != nil && *item.Method == method {
				apiItem = &APITreeItem{
					Name:   item.Name,
					Path:   item.Path,
					Method: item.Method,
				}
				return
			}

			if len(item.Children) > 0 {
				findFn(item.Children)
			}
		}
	}

	findFn(c.Resource.API)

	return
}

func (c *CasbinService) UserAPITree(u *db.User) (apiTree APITree, err error) {
	sub := strconv.Itoa(u.Uid)
	apiTree, err = c.GetAPITree(sub)

	return
}

func (c *CasbinService) UserMenu(u *db.User) (menu view.MenuTree, err error) {
	if u == nil {
		err = fmt.Errorf("无效的登录账户")
		return
	}

	return c.GetMenu(strconv.Itoa(u.Uid))
}

func (c *CasbinService) GetAPIList() (list []APIListItem) {
	var genAPIListFunctor func(tree APITree)
	genAPIListFunctor = func(tree APITree) {
		for _, item := range tree {
			listItem := APIListItem{
				Name: item.Name,
				Path: item.Path,
			}
			if item.Method != nil {
				listItem.Method = *item.Method
			}

			if len(item.Children) > 0 {
				genAPIListFunctor(item.Children)
			}

			list = append(list, listItem)
		}

	}

	genAPIListFunctor(c.Resource.API)

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
	for _, item := range c.GetAPIList() {
		if item.Path == path && item.Method == method {
			return true
		}
	}

	return false
}

func (c *CasbinService) AppPermissionList() AppPermissionList {
	return c.Resource.App
}
