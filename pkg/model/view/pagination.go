package view

// 响应
type Pagination struct {
	Current  int   `json:"current"`
	Total    int64 `json:"total"`
	PageSize int   `json:"pageSize"`
}

func NewPagination(current int, pageSize int) *Pagination {
	p := &Pagination{}
	p.Current = current
	p.PageSize = pageSize
	if p.Current == 0 {
		p.Current = 1
	}
	if p.PageSize == 0 {
		p.PageSize = 20
	}
	return p
}
