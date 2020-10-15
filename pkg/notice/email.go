package notice

import (
	"bytes"
	"errors"
	"html/template"

	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/go-gomail/gomail"
	"go.uber.org/zap"
)

type Email struct {
	// ServerHost 邮箱服务器地址，如腾讯企业邮箱为smtp.exmail.qq.com
	ServerHost string
	// ServerPort 邮箱服务器端口，如腾讯企业邮箱为465
	ServerPort int
	// FromEmail　发件人邮箱地址
	FromEmail string
	// FromPasswd 发件人邮箱密码（注意，这里是明文形式），TODO：如果设置成密文？
	FromPasswd string
	// Toers 接收者邮件
	Toers []string
	// CCers 抄送者邮件
	CCers []string
	//这是主题
	Subject string
	//这是正文
	Body string
	//第三方邮件发送包拓展
	m *gomail.Message
}

type EmailOption func(*Email)

func EmailBody(fields map[string]interface{}) EmailOption {
	return func(args *Email) {
		templ, err := template.ParseFiles(".\\template\\emailnotice.html")
		if err != nil {
			xlog.Error("NewEmailNotice", zap.String("step", "template.ParseFiles"), zap.String("err", err.Error()))
			return
		}

		var mailBody bytes.Buffer
		if err := templ.Execute(&mailBody, map[string]interface{}{
			"fields": fields,
		}); err != nil {
			xlog.Error("NewEmailNotice", zap.String("step", "templ.Execute"), zap.String("err", err.Error()))
			return
		}
		args.Body = mailBody.String()
	}
}

// SendEmail body支持html格式字符串
func (ep *Email) Send(fields map[string]interface{}) {
	NewEmailNotice(EmailBody(fields)).send()
}

//默认邮件通知初始化
func NewEmailNotice(setters ...EmailOption) (email *Email) {
	email = new(Email)
	email.m = gomail.NewMessage()
	email.ServerHost = cfg.Cfg.Notice.Email.ServerHost
	email.ServerPort = cfg.Cfg.Notice.Email.ServerPort
	email.FromEmail = cfg.Cfg.Notice.Email.FromEmail
	email.FromPasswd = cfg.Cfg.Notice.Email.FromPasswd
	email.Toers = cfg.Cfg.Notice.Email.Toers
	email.CCers = cfg.Cfg.Notice.Email.CCers
	email.Subject = "日志服务"

	for _, setter := range setters {
		setter(email)
	}

	return
}

func (ep *Email) send() (err error) {

	if len(ep.Toers) == 0 {
		err = errors.New("邮件接收者邮箱不能为空")
		return
	}

	// 收件人可以有多个，故用此方式
	ep.m.SetHeader("To", ep.Toers...)

	//抄送列表
	if len(ep.CCers) != 0 {
		ep.m.SetHeader("Cc", ep.CCers...)
	}

	// 发件人
	// 第三个参数为发件人别名，如"李大锤"，可以为空（此时则为邮箱名称）
	ep.m.SetAddressHeader("From", ep.FromEmail, "")
	// 主题
	ep.m.SetHeader("Subject", ep.Subject)

	// 正文
	ep.m.SetBody("text/html", ep.Body)

	d := gomail.NewDialer(ep.ServerHost, ep.ServerPort, ep.FromEmail, ep.FromPasswd)
	// 发送
	err = d.DialAndSend(ep.m)
	return
}
