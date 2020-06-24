package system

import (
	"sync"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/jinzhu/gorm"
)

type (
	setting struct {
		db              *gorm.DB
		settingCacheMtx sync.RWMutex
		settingCache    map[view.SettingName]string
		subscribers     map[view.SettingName][]SubscribeCallback // 设置修改事件订阅
		subscribersMtx  sync.RWMutex
	}

	SubscribeCallback func(content string)
)

func newSetting(db *gorm.DB) *setting {
	return &setting{
		db:           db,
		settingCache: map[view.SettingName]string{},
		subscribers:  map[view.SettingName][]SubscribeCallback{},
	}
}

//GetAll 从数据库获取所有设置
func (s *setting) GetAll() (settings map[view.SettingName]string, err error) {
	settings = make(map[view.SettingName]string)

	settingRecords := make([]db.SystemConfig, 0)
	err = s.db.Find(&settingRecords).Error
	if err != nil {
		return
	}

	for _, item := range settingRecords {
		// 判断配置名称是否有效
		if view.CheckSettingNameValid(view.SettingName(item.Name)) {
			settings[view.SettingName(item.Name)] = item.Content
		}
	}

	for field, config := range view.SettingFieldConfigs {
		// 如果为空，则使用默认值
		if _, ok := settings[field]; !ok {
			settings[field] = config.Default
		}
	}

	return
}

//Get 带缓存的设置获取
func (s *setting) Get(name view.SettingName) (val string, err error) {
	// 先从内存中查
	{
		s.settingCacheMtx.RLock()
		val, ok := s.settingCache[name]
		s.settingCacheMtx.RUnlock()

		if ok {
			return val, nil
		}
	}

	// 如果没有从数据库查
	val, err = s.get(name)
	if err != nil {
		return val, err
	}

	{
		s.settingCacheMtx.Lock()
		s.settingCache[name] = val
		s.settingCacheMtx.Unlock()
	}

	return
}

//Set 设置系统设置
func (s *setting) Set(name view.SettingName, value string) (err error) {
	tx := s.db.Begin()

	setting := db.SystemConfig{}
	query := tx.Where("name = ?", name).First(&setting)
	err = query.Error
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return
	}

	setting.Name = string(name)
	setting.Content = value

	if err != nil && gorm.IsRecordNotFoundError(err) {
		err = tx.Create(&setting).Error
	} else {
		err = tx.Save(&setting).Error
	}
	if err != nil {
		tx.Rollback()
		return err
	}

	err = tx.Commit().Error
	if err != nil {
		tx.Rollback()
		return err
	}

	{
		s.settingCacheMtx.Lock()
		s.settingCache[name] = value
		s.settingCacheMtx.Unlock()
	}

	s.pubEvent(name, value)

	return
}

// 从数据库获取
func (s *setting) get(name view.SettingName) (val string, err error) {
	setting := db.SystemConfig{}
	err = s.db.Where("name = ?", name).First(&setting).Error
	if err != nil {
		if gorm.IsRecordNotFoundError(err) {
			if config, ok := view.SettingFieldConfigs[name]; ok {
				return config.Default, nil
			}

			return "", nil
		}

		return
	}

	val = setting.Content
	return
}

func (s *setting) pubEvent(name view.SettingName, value string) {
	s.subscribersMtx.RLock()
	defer s.subscribersMtx.RUnlock()

	for _, callback := range s.subscribers[name] {
		go callback(value)
	}
}

func (s *setting) Subscribe(name view.SettingName, callback SubscribeCallback) {
	if !view.CheckSettingNameValid(name) {
		return
	}

	s.subscribersMtx.Lock()
	defer s.subscribersMtx.Unlock()

	if _, ok := s.subscribers[name]; !ok {
		s.subscribers[name] = make([]SubscribeCallback, 0)
	}

	s.subscribers[name] = append(s.subscribers[name], callback)

	// 订阅时发布
	{
		content, err := s.get(name)
		if err != nil {
			return
		}

		callback(content)
	}
}
