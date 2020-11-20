package notice

import (
	"github.com/douyu/juno/pkg/cfg"
	"testing"
)

func TestSendEmail(t *testing.T) {
	cfg.InitCfg()
	defaultEmailNotice := NewEmailNotice(EmailBody(map[string]interface{}{
		"任务名称":   "邮件发送服务",
		"报错时间":   "2020-10-10 22:11:11",
		"报错信息":   "内存爆了",
		"报错节点":   "第三台node",
		"报错代码路径": "web/project/xxz.go",
	}))
	defaultEmailNotice.Subject = "日志服务"
	defaultEmailNotice.ServerHost = "smtp.163.com"
	defaultEmailNotice.ServerPort = 465
	defaultEmailNotice.FromEmail = "xxx@163.com"
	defaultEmailNotice.FromPasswd = "xxx"
	defaultEmailNotice.Toers = []string{"xxx@qq.com"}
	defaultEmailNotice.CCers = []string{"xxx@qq.com"}
	defaultEmailNotice.send()
}

func TestSendDing(t *testing.T) {
	a := NewtDingNotice(TextMsgType)
	a.WebHook = "https://oapi.dingtalk.com/robot/send?access_token=be3350a5ed409bdfeffbe02161b403cc6da442ed1af81e2135f0415c11af0f80"
	a.InitText("你的群发服务发生了错误，请及时处理", []string{}, true).sendDingMsg()
}
