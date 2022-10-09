package view

type (
	ReqCreateAccessToken struct {
		Name string `json:"name" valid:"required"`
	}

	ReqDeleteAccessToken struct {
		AppID string `json:"app_id" valid:"required"`
	}

	ReqListAccessToken struct {
		Page     int `query:"page"`
		PageSize int `query:"page_size" valid:"required"`
	}

	RespListAccessToken struct {
		Pagination Pagination        `json:"pagination"`
		List       []AccessTokenItem `json:"list"`
	}

	AccessTokenItem struct {
		Name      string `json:"name"`
		AppID     string `json:"app_id"`
		AppSecret string `json:"app_secret"`
	}
)
