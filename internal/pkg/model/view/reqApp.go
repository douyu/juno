package view

// ReqAppList ...
type ReqAppList struct {
	CurrentPage int    `json:"currentPage" form:"currentPage"` // 项目名称
	ShowNum     int    `json:"showNum"  form:"showNum"`        // gitlab项目ID
	Lang        string `json:"lang" form:"lang"`               // filter by lang
	Qs          string `json:"qs" form:"qs"`                   // 模糊搜索
	Sort        string `json:"sort" form:"sort"`               // 模糊搜索
}

// ReqAppSearch ...
type ReqAppSearch struct {
	Repos string `json:"repos" form:"repos"`
	Stats string `json:"stats" form:"stats"`
	Q     string `json:"q" form:"q"`
	Files string `json:"files" form:"files"`
	I     string `json:"i" form:"i"`
	Ctx   string `json:"ctx" form:"ctx"`
}

// RespAppNumber ...
type RespAppNumber struct {
	TotalNumber  int `json:"totalNumber"`
	NewNumber    int `json:"newNumber"`
	DeleteNumber int `json:"deleteNumber"`
}
