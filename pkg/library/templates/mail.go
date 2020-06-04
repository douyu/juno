package templates

// PubMailTemplate ...
const PubMailTemplate = `
<div style="min-width: 50%; max-width: 800px; margin: 10px auto;">
	<div style="background: #002140">
		<p style="font-size: 20px; font-weight: 500; color: white; padding: 10px;">应用信息</p>
	</div>
	<div style="padding-left: 10px;">
		<p>应用别名: {{.Name}}</p>
		<p style="max-width: 800px;">应用描述: {{.Description}}</p>
	</div>
	<div style="background: #002140">
		<p style="font-size: 20px; font-weight: 500; color: white; padding: 10px;">工作流信息</p>
	</div>
	<div style="padding-left: 10px;">
		<p>工作流: {{.FlowName}}</p>
		<p>部署机房：{{.IDCName}}</p>
		<p>构建发起者：{{.TplUserName}}</p>
		<p>构建分支：{{.BuildBranch}}</p>
		<p>构建提交：<a href={{.BuildLink}}>{{.BuildCommit}}</a></p>
		<p>构建信息：{{.BuildMessage}}</p>
		<p>构建起止时间：{{.StartTime}} - {{.StopTime}}</p>
		<p>构建结果：{{.StatusStr}}</p>
		<p>详情链接: <a href={{.Link}}>{{.Link}}</a></p>
	</div>
</div>
`
