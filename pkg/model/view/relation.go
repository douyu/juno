package view

type RelationApps struct {
	AppName    string `json:"appName"`
	Name       string `json:"name"`
	Type       string `json:"type"`
	Addr       string `json:"addr"`
	UpdateTime int64  `json:"update_time"`
	Info       string `json:"info"`
}

type RespRelationApps struct {
	Current  int            `json:"current"`
	PageSize int            `json:"pageSize"`
	Total    int            `json:"total"`
	List     []RelationApps `json:"list"`
	AddrList []string       `json:"addrList"`
}

type ReqRelationApps struct {
	Current  int      `json:"current"`
	PageSize int      `json:"pageSize"`
	Env      string   `json:"env"`
	IsAddr   int      `json:"isAddr"`
	IsApp    int      `json:"isApp"`
	AppList  []string `json:"appList"`
	Types    []string `json:"types"`
	AddrList []string `json:"addrList"`
}
