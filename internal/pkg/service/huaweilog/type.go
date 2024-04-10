package huaweilog

type LogNodeMap struct {
	Value    string                 `json:"value"`
	Label    string                 `json:"label"`
	Children map[string]*LogNodeMap `json:"children"`
}
