package vproxyintegrat

type ProxyManageListParams struct {
	Current  int    `json:"current"`
	PageSize int    `json:"pageSize"`
	Query    string `json:"query"`
}

//Valid 是否合法
func (req *ProxyManageListParams) Valid() (isValid bool, msg string) {
	if req.Current <= 0 {
		req.Current = 1
	}
	isValid = true
	return
}

type ProxyManageCreateOrUpdateParams struct {
	ID        int    `json:"id"`
	SubPath   string `json:"sub_path"`
	IsRewrite int    `json:"is_rewrite"`
	ProxyAddr string `json:"proxy_addr"`
	Title     string `json:"title"`
	UID       uint32 `json:"uid"`
}

//Valid 是否合法
func (req *ProxyManageCreateOrUpdateParams) Valid() (isValid bool, msg string) {
	if req.Title == "" {
		msg = "代理名称参数错误"
		return
	}
	if req.ProxyAddr == "" {
		msg = "代理路径错误"
		return
	}
	if req.SubPath == "" {
		msg = "功能标识参数错误"
		return
	}
	if req.IsRewrite != 0 && req.IsRewrite != 1 {
		msg = "重写参数错误"
		return
	}
	isValid = true
	return
}

type ProxyManageDeleteParams struct {
	ID  int    `json:"id"`
	UID uint32 `json:"uid"`
}

//Valid 是否合法
func (req *ProxyManageDeleteParams) Valid() (isValid bool, msg string) {
	if req.ID <= 0 {
		msg = "数据不存在"
		return
	}

	isValid = true
	return
}
