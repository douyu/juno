package view

type (
	ReqEventList struct {
		AppName string `query:"app_name"`
		Env     string `query:"env"`
		Zone    string `query:"zone"`

		Page     int `query:"page"`
		PageSize int `query:"page_size"`
	}
)
