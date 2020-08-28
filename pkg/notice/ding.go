package notice

//钉钉机器人文档
//https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq/9e91d73c

import (
	"encoding/json"
	"fmt"
	"github.com/douyu/juno/pkg/cfg"
	"net/http"
	"strings"
)

const (
	TextMsgType = "text"
	LinkMsgType = "link"
	MarkDownMsgType = "markdown"
	ActionCardMsgType = "actionCard"
)

type DingNotice struct {}

func (d *DingNotice)Send(){
	content := cfg.Cfg.Notice.Ding.TextParam.Content
	atMobiles := cfg.Cfg.Notice.Ding.TextParam.AtMobiles
	isAtAll := cfg.Cfg.Notice.Ding.TextParam.IsAtAll
	NewtDingNotice(TextMsgType).InitText(content,atMobiles,isAtAll).sendDingMsg()
}

type dingMsg struct {
	WebHook string
	Content interface{}
	MsgList struct {
		Text       DingText
		Link       DingLink
		Markdown   DingMarkdown
		ActionCard DingActionCard
	}
}
//钉钉通知消息对象实体获取
func NewtDingNotice(msgtype string) *dingMsg {
	dingNotice := &dingMsg{
		MsgList: struct {
			Text       DingText
			Link       DingLink
			Markdown   DingMarkdown
			ActionCard DingActionCard
		}{
			Text: DingText{},
			Link: DingLink{},
			Markdown: DingMarkdown{},
			ActionCard: DingActionCard{},
		},
	}
	dingNotice.WebHook = cfg.Cfg.Notice.Ding.WebHook

	switch msgtype {
	case TextMsgType:
		dingNotice.MsgList.Text.Msgtype = "text"
		dingNotice.Content = dingNotice.MsgList.Text
	case LinkMsgType:
		dingNotice.MsgList.Link.Msgtype = "link"
		dingNotice.Content = dingNotice.MsgList.Link
	case MarkDownMsgType:
		dingNotice.MsgList.Markdown.Msgtype = "markdown"
		dingNotice.Content = dingNotice.MsgList.Markdown
	case ActionCardMsgType:
		dingNotice.MsgList.ActionCard.Msgtype = "actionCard"
		dingNotice.Content = dingNotice.MsgList.ActionCard
	default:
		dingNotice.MsgList.Text.Msgtype = "text"
		dingNotice.Content = dingNotice.MsgList.Text
	}
	return dingNotice
}


func (d *dingMsg) InitText(content string,atMobiles[]string,isAtAll bool)*msgSubject {
	t := new(msgSubject)
	t.dingMsg = d
	d.MsgList.Text.Text.Content = content
	t.dingMsg.Content = d.MsgList.Text
	return t
}


func (d *dingMsg) InitLink(text,title,picUrl,messageUrl string)*msgSubject {
	t := new(msgSubject)
	t.dingMsg = d
	d.MsgList.Link.Link.Text = text
	d.MsgList.Link.Link.Title = title
	d.MsgList.Link.Link.PicUrl = picUrl
	d.MsgList.Link.Link.MessageUrl = messageUrl
	t.dingMsg.Content = d.MsgList.Link
	return t
}


func (d *dingMsg) InitMarkdownDing(title,text string,atMobiles []string,isAtAll bool)*msgSubject {
	t := new(msgSubject)
	t.dingMsg = d
	d.MsgList.Markdown.Markdown.Text = text
	d.MsgList.Markdown.Markdown.Title = title
	d.MsgList.Markdown.At.AtMobiles = atMobiles
	d.MsgList.Markdown.At.IsAtAll = isAtAll
	t.dingMsg.Content = d.MsgList.Markdown
	return t
}


func (d *dingMsg) InitActionCardDing(title,text,singleTitle,singleURL,btnOrientation string)*msgSubject {
	t := new(msgSubject)
	t.dingMsg = d
	d.MsgList.ActionCard.ActionCard.Text = text
	d.MsgList.ActionCard.ActionCard.Title = title
	d.MsgList.ActionCard.ActionCard.SingleTitle = singleTitle
	d.MsgList.ActionCard.ActionCard.SingleURL = singleURL
	d.MsgList.ActionCard.ActionCard.BtnOrientation = btnOrientation
	t.dingMsg.Content = d.MsgList.ActionCard
	return t
}

type msgSubject struct {
	dingMsg *dingMsg
}

func (d *msgSubject) sendDingMsg() (err error) {
	//请求地址模板
	webHook := d.dingMsg.WebHook
	b,err :=json.Marshal(d.dingMsg.Content)
	if err!=nil{
		return
	}

	jsonStr := string(b)
	fmt.Println(jsonStr,887766)
	//创建一个请求
	req, err := http.NewRequest("POST", webHook, strings.NewReader(jsonStr))
	if err != nil {
		return
	}

	client := &http.Client{}
	req.Header.Set("Content-Type", "application/json; charset=utf-8")
	resp, err := client.Do(req)
	defer resp.Body.Close()
	return
}


