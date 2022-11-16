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
		Env     string `query:"env" json:"env" valid:"required"`
		Query   string `query:"query" json:"query" valid:"required"`
		Typ     string `query:"typ" json:"typ" valid:"required"`
		AppName string `query:"app_name"  json:"app_name" valid:"required"`
		Aid     string `query:"aid" json:"aid" valid:"required"`
	}
)
