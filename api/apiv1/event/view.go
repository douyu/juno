package event

type ReqList struct {
	Page     int `query:"page"`
	PageSize int `query:"page_size"`
}
