package grpctest

import (
	"path/filepath"

	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/jinzhu/gorm"
)

var (
	option Option
)

type (
	Option struct {
		Enabled  bool
		DB       *gorm.DB
		ProtoDir string
	}
)

func Init(opt Option) {
	option = opt

	if !opt.Enabled {
		return
	}

	var err error
	opt.ProtoDir, err = filepath.Abs(opt.ProtoDir)
	if err != nil {
		xlog.Panic("get absolute path of protoDir failed", xlog.String("err", err.Error()))
	}

	option = opt

	// 启动时把所有 PB 文件解析一遍
	go ParseAllProto(opt.ProtoDir, opt.ProtoDir)

	// watch PB 文件目录变化
	go watchProtoDirectory()
}
