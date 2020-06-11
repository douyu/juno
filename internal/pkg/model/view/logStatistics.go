package view

// 请求
type ReqReportList struct {
	Current  int    `json:"current"`
	PageSize int    `json:"pageSize"`
	Aid      int    `json:"aid"`
	AppName  string `json:"appName"`
	StatDate int64  `json:"statDate"`
}

type ReqReportRangeList struct {
	Aid       int `json:"aid"`
	StartTime int `json:"startTime"`
	EndTime   int `json:"endTime"`
}

type ReportInfo struct {
	Id         int     `json:"id"`
	Aid        int     `json:"aid"`
	AppName    string  `json:"appName" gorm:"column:app_name"`
	Normalized float64 `json:"normalized"`
	Warn       int     `json:"warn"`
	Dpainc     int     `json:"dpainc" gorm:"column:dpainc"`
	Error      int     `json:"error"`
	Merror     int     `json:"merror" gorm:"column:merror"`
	Fatal      int     `json:"fatal"`
	Person     string  `json:"person" gorm:"column:users"`
	Timestamp  int     `json:"timestamp" gorm:"column:timestamp"`
}

type RespReportList struct {
	Pagination Pagination   `json:"pagination"`
	List       []ReportInfo `json:"list"`
}
