package view

type (
	//RespAliyunLogDefault ..
	RespAliyunLogDefault struct {
		Code int    `json:"code"`
		Msg  string `json:"msg"`
		Data string `json:"data"`
	}
	//ReqAliyunLogDefault env, query, typ, appNam
	ReqAliyunLogDefault struct {
		Env     string `json:"env" valid:"required"`
		Query   string `json:"query" valid:"required"`
		Typ     string `json:"typ" valid:"required"`
		AppName string `json:"app_name" valid:"required"`
	}
)
