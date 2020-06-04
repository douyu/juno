package worker

import (
	"time"
)

// ParsePkg 解析依赖包
type ParsePkg struct{}

func NewParsePkg() *ParsePkg {
	return &ParsePkg{}
}

func (p *ParsePkg) Start() {
	for {
		// 获取所有的golang应用
		// service.AppDep.RunData()
		// 休息 12 小时再来一次
		time.Sleep(time.Hour * 12)
	}
}
