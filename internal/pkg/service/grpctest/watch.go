package grpctest

import (
	"io/ioutil"
	"os"
	"path"

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
				for {
					select {
					case ev := <-watcher.Events:
						if isWriteEvent(ev) {
							event = ev
						}
						continue
					default:
						break
					}
					break
				}

				if isWriteEvent(event) {
					onWriteEvent(event)
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
	var findPathFunc func(p string)
	findPathFunc = func(p string) {
		files, err := ioutil.ReadDir(p)
		if err != nil {
			return
		}

		for _, file := range files {
			filePath := path.Join(p, file.Name())
			stat, err := os.Stat(filePath)
			if err != nil {
				continue
			}

			if stat.IsDir() {
				subPath := path.Join(p, stat.Name())
				allSubPath = append(allSubPath, subPath)
				findPathFunc(subPath)
			}
		}
	}

	findPathFunc(dir)

	return
}

func onWriteEvent(event fsnotify.Event) {
	// 有修改或新建文件
	xlog.Info("watchDirectory", xlog.String("event", event.Name))
	//err := p.ParseAllProto(dir)
	//if err != nil {
	//	xlog.Error("watchDirectory", xlog.String("method", "ParseAllProto"),
	//		xlog.String("err", err.Error()))
	//}
}

func isWriteEvent(event fsnotify.Event) bool {
	return event.Op&fsnotify.Write == fsnotify.Write || event.Op&fsnotify.Create == fsnotify.Create
}
