package vproxyintegrat

type ProxyMenuListParams struct {
	Current  int    `query:"current" json:"current"`
	PageSize int    `query:"pageSize" json:"pageSize"`
	Query    string `query:"query" json:"query"`
}

// Valid 是否合法
func (req *ProxyMenuListParams) Valid() (isValid bool, msg string) {
	if req.Current <= 0 {
		req.Current = 1
	}
	isValid = true
	return
}

type ProxyMenuCreateOrUpdateParams struct {
	ID        int    `json:"id"`
	Title     string `json:"title"`
	ProxyURL  string `json:"proxy_url"`
	Key       string `json:"key"`
	PanelType string `json:"panel_type"`
	UID       uint32 `json:"uid"`
}

// Valid 是否合法
func (req *ProxyMenuCreateOrUpdateParams) Valid() (isValid bool, msg string) {
	if req.Title == "" {
		msg = "功能名称参数错误"
		return
	}
	if req.ProxyURL == "" {
		msg = "代理路径错误"
		return
	}
	if req.Key == "" {
		msg = "功能标识参数错误"
		return
	}
	if req.PanelType != "grafana" && req.PanelType != "pyroscope" {
		msg = "panel类型错误"
		return
	}
	isValid = true
	return
}

type ProxyMenuDeleteParams struct {
	ID  int    `json:"id"`
	UID uint32 `json:"uid"`
}

// Valid 是否合法
func (req *ProxyMenuDeleteParams) Valid() (isValid bool, msg string) {
	if req.ID <= 0 {
		msg = "数据不存在"
		return
	}

	isValid = true
	return
}
