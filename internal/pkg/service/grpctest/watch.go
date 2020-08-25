package grpctest

import (
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/douyu/juno/pkg/util"
	"github.com/douyu/jupiter/pkg/xlog"
	"gopkg.in/fsnotify.v1"
)

//watchProtoDirectory watch PB 目录然后解析PB描述
func watchProtoDirectory() {
	if !option.Enabled {
		xlog.Info("GrpcTest.Enable = false. exit directory watch")
		return
	}

	dir := option.ProtoDir

	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		xlog.Fatal("watchDirectory", xlog.String("err", err.Error()))
		return
	}
	defer watcher.Close()

	stopChan := make(chan struct{})
	go func() {
		for {
			select {
			case event := <-watcher.Events:
				// consume all events
				time.Sleep(1 * time.Second)
				dirs := make([]string, 0)
				if isWriteEvent(event) {
					dirs = append(dirs, event.Name)
				}

				for {
					select {
					case ev := <-watcher.Events:
						if isWriteEvent(ev) {
							dirs = append(dirs, ev.Name)
						}
						continue
					default:
						break
					}
					break
				}

				if len(dirs) != 0 {
					onWrite(dirs)
				}

			case err := <-watcher.Errors:
				if err != nil {
					xlog.Error("watchDirectory", xlog.String("err", err.Error()))
				}
			}
		}
	}()

	subPath := getAllSubPath(dir)
	pathToWatch := []string{dir}
	pathToWatch = append(pathToWatch, subPath...)

	for _, dir := range pathToWatch {
		err = watcher.Add(dir)
		if err != nil {
			xlog.Error("watchDirectory", xlog.String("err", err.Error()))
		}
	}

	<-stopChan
}

func getAllSubPath(dir string) (allSubPath []string) {
	_ = filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if info== nil || !info.IsDir() {
			return nil
		}

		if strings.HasPrefix(filepath.Base(path), ".") {
			return filepath.SkipDir
		}

		allSubPath = append(allSubPath, path)
		return nil
	})

	return
}

func onWrite(dirs []string) {
	if len(dirs) == 0 {
		return
	}

	commonPath := util.CommonPrefix(dirs)
	stat, err := os.Stat(commonPath)
	if err != nil {
		return
	}

	if !stat.IsDir() {
		commonPath = filepath.Dir(commonPath)
	}

	err = ParseAllProto(option.ProtoDir, commonPath)
	if err != nil {
		xlog.Error("watchDirectory", xlog.String("method", "ParseAllProto"),
			xlog.String("err", err.Error()))
	}
}

func isWriteEvent(event fsnotify.Event) bool {
	return event.Op&fsnotify.Write == fsnotify.Write || event.Op&fsnotify.Create == fsnotify.Create
}
