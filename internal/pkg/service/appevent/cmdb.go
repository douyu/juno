package appevent

import (
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/event"
)

func (a *appEvent) AppCreateEvent(aid int, appName, metaData string, user *db.User) {
	// app事件
	appEvent := db.AppEvent{
		AppName:   appName,
		Aid:       aid,
		Operation: event.EventCMDBAppCreate,
		Source:    event.SourceCMDB,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}

func (a *appEvent) AppUpdateEvent(aid int, appName, metaData string, user *db.User) {
	// app事件
	appEvent := db.AppEvent{
		AppName:   appName,
		Aid:       aid,
		Operation: event.EventCMDBAppUpdate,
		Source:    event.SourceCMDB,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}

func (a *appEvent) AppDeleteEvent(aid int, appName, metaData string, user *db.User) {
	// app事件
	appEvent := db.AppEvent{
		AppName:   appName,
		Aid:       aid,
		Operation: event.EventCMDBAppDelete,
		Source:    event.SourceCMDB,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}

func (a *appEvent) AppNodeCreateEvent(aid int, appName, zoneCode, env, hostName, metaData string, user *db.User) {
	// app事件
	appEvent := db.AppEvent{
		AppName:   appName,
		Aid:       aid,
		ZoneCode:  zoneCode,
		Env:       env,
		HostName:  hostName,
		Operation: event.EventCMDBAppNodeCreate,
		Source:    event.SourceCMDB,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}

func (a *appEvent) AppNodeDeleteEvent(aid int, appName, zoneCode, env, hostName, metaData string, user *db.User) {
	// app事件
	appEvent := db.AppEvent{
		AppName:   appName,
		Aid:       aid,
		ZoneCode:  zoneCode,
		Env:       env,
		HostName:  hostName,
		Operation: event.EventCMDBAppNodeDelete,
		Source:    event.SourceCMDB,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}

func (a *appEvent) NodeCreateEvent(zoneCode, env, hostName, metaData string, user *db.User) {
	// app事件
	appEvent := db.AppEvent{
		ZoneCode:  zoneCode,
		Env:       env,
		HostName:  hostName,
		Operation: event.EventCMDBNodeCreate,
		Source:    event.SourceCMDB,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}

func (a *appEvent) NodeUpdateEvent(zoneCode, env, hostName, metaData string, user *db.User) {
	// app事件
	appEvent := db.AppEvent{
		ZoneCode:  zoneCode,
		Env:       env,
		HostName:  hostName,
		Operation: event.EventCMDBNodeUpdate,
		Source:    event.SourceCMDB,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}

func (a *appEvent) NodeDeleteEvent(zoneCode, env, hostName, metaData string, user *db.User) {
	// app事件
	appEvent := db.AppEvent{
		ZoneCode:  zoneCode,
		Env:       env,
		HostName:  hostName,
		Operation: event.EventCMDBNodeDelete,
		Source:    event.SourceCMDB,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}

func (a *appEvent) ConfgoFileCreateEvent(aid int, appName, zoneCode, env, metaData string, user *db.User) {
	// app事件
	appEvent := db.AppEvent{
		ZoneCode:  zoneCode,
		Env:       env,
		Aid:       aid,
		AppName:   appName,
		Operation: event.EventConfgoFileCreate,
		Source:    event.SourceConfgo,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}

func (a *appEvent) ConfgoFileUpdateEvent(aid int, appName, zoneCode, env, metaData string, user *db.User) {
	// app事件
	appEvent := db.AppEvent{
		ZoneCode:  zoneCode,
		Env:       env,
		Aid:       aid,
		AppName:   appName,
		Operation: event.EventConfgoFileUpdate,
		Source:    event.SourceConfgo,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}

func (a *appEvent) ConfgoFileDeleteEvent(aid int, appName, zoneCode, metaData string, user *db.User) {
	// app事件
	appEvent := db.AppEvent{
		ZoneCode:  zoneCode,
		Aid:       aid,
		AppName:   appName,
		Operation: event.EventConfgoFileDelete,
		Source:    event.SourceConfgo,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}

func (a *appEvent) ConfgoItemCreateEvent(aid int, appName, zoneCode, env, metaData string, user *db.User) {
	// app事件
	appEvent := db.AppEvent{
		ZoneCode:  zoneCode,
		Env:       env,
		Aid:       aid,
		AppName:   appName,
		Operation: event.EventConfgoItemCreate,
		Source:    event.SourceConfgo,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}

func (a *appEvent) ConfgoItemUpdateEvent(aid int, appName, zoneCode, env, metaData string, user *db.User) {
	// app事件
	appEvent := db.AppEvent{
		ZoneCode:  zoneCode,
		Env:       env,
		Aid:       aid,
		AppName:   appName,
		Operation: event.EventConfgoItemUpdate,
		Source:    event.SourceConfgo,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}

func (a *appEvent) ConfgoItemDeleteEvent(aid int, appName, zoneCode, env, metaData string, user *db.User) {
	// app事件
	appEvent := db.AppEvent{
		ZoneCode:  zoneCode,
		Env:       env,
		Aid:       aid,
		AppName:   appName,
		Operation: event.EventConfgoItemDelete,
		Source:    event.SourceConfgo,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}

func (a *appEvent) ConfgoFilePublishEvent(aid int, appName, env, zoneCode, metaData string, user *db.User) {
	// app事件
	appEvent := db.AppEvent{
		ZoneCode:  zoneCode,
		Env:       env,
		Aid:       aid,
		AppName:   appName,
		Operation: event.EventConfgoFilePublish,
		Source:    event.SourceConfgo,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}

func (a *appEvent) ConfgoFileRollbackEvent(aid int, appName, zoneCode, env, metaData string, user *db.User) {
	// app事件
	appEvent := db.AppEvent{
		ZoneCode:  zoneCode,
		Env:       env,
		Aid:       aid,
		AppName:   appName,
		Operation: event.EventConfgoFileRollback,
		Source:    event.SourceConfgo,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}

func (a *appEvent) ConfgoWatchHttpPushEvent(zoneCode, env, hostName, metaData string, user *db.User) {
	appEvent := db.AppEvent{
		ZoneCode:  zoneCode,
		Env:       env,
		HostName:  hostName,
		Operation: event.EventConfgoWatchHttpPush,
		Source:    event.SourceConfgo,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}

func (a *appEvent) ConfgoWatchFileSyncEvent(zoneCode, env, hostName, metaData string, user *db.User) {
	appEvent := db.AppEvent{
		ZoneCode:  zoneCode,
		Env:       env,
		HostName:  hostName,
		Operation: event.EventConfgoWatchFileSync,
		Source:    event.SourceConfgo,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}

func (a *appEvent) UserCreateEvent(metaData string, user *db.User) {
	// app事件
	appEvent := db.AppEvent{
		Operation: event.EventCMDBUserCreate,
		Source:    event.SourceCMDB,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}

func (a *appEvent) UserUpdateEvent(metaData string, user *db.User) {
	// app事件
	appEvent := db.AppEvent{
		Operation: event.EventCMDBUserUpdate,
		Source:    event.SourceCMDB,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}

func (a *appEvent) UserDeleteEvent(metaData string, user *db.User) {
	// app事件
	appEvent := db.AppEvent{
		Operation: event.EventCMDBUserDelete,
		Source:    event.SourceCMDB,
		Metadata:  metaData,
	}
	if user != nil {
		appEvent.UserName = user.Username
		appEvent.UID = user.Uid
	}
	a.PutEvent(appEvent)
}
