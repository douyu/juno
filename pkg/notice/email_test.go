package notice

import (
	"github.com/douyu/juno/pkg/cfg"
	"testing"
)

func TestSendEmail(t *testing.T) {
	cfg.InitCfg()
	defaultEmailNotice := NewDefaultEmailNotice()
	defaultEmailNotice.ServerHost = "smtp.163.com"
	defaultEmailNotice.ServerPort = 465
	defaultEmailNotice.FromEmail = "xxx@163.com"
	defaultEmailNotice.FromPasswd = "xxx"
	defaultEmailNotice.Toers = []string{"xxxxxxx@qq.com"}
	defaultEmailNotice.CCers = []string{"xxxxxxx@qq.com"}
	defaultEmailNotice.Send()
}


func TestSendDing(t *testing.T) {
	a :=NewtDingMsgNotice("actionCard")
	a.WebHook = "https://oapi.dingtalk.com/robot/send?access_token=be3350a5ed409bdfeffbe02161b403cc6da442ed1af81e2135f0415c11af0f80"
	a.Send()
}
