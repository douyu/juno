package notice

import (
	"bytes"
	"errors"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/go-gomail/gomail"
	"go.uber.org/zap"
	"html/template"
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


// SendEmail body支持html格式字符串
func(ep *Email) Send() {
	NewEmailNotice().send()
}

func (ep *Email)send()(err error){

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


//默认邮件通知初始化
func NewEmailNotice()(email *Email){
	email = new(Email)
	email.m = gomail.NewMessage()
	email.ServerHost = cfg.Cfg.Notice.Email.ServerHost
	email.ServerPort = cfg.Cfg.Notice.Email.ServerPort
	email.FromEmail =cfg.Cfg.Notice.Email.FromEmail
	email.FromPasswd = cfg.Cfg.Notice.Email.FromPasswd
	email.Toers = cfg.Cfg.Notice.Email.Toers
	email.CCers = cfg.Cfg.Notice.Email.CCers
	email.Subject =  cfg.Cfg.Notice.Email.Subject
	templ,err:=template.ParseFiles( cfg.Cfg.Notice.Email.TemplatePath)
	if err!=nil{
		xlog.Error("NewEmailNotice", zap.String("step", "template.ParseFiles"),zap.String("err", err.Error()))
		return
	}
	var mailBody bytes.Buffer
	if err :=templ.Execute(&mailBody,"");err!=nil{
		xlog.Error("NewEmailNotice", zap.String("step", "templ.Execute"),zap.String("err", err.Error()))
		return
	}

	email.Body = mailBody.String()
	return
}