package aliyunlog

//LogNode 日志菜单
type LogNode struct {
	Value    string     `json:"value"`
	Label    string     `json:"label"`
	Children []*LogNode `json:"children"`
}
