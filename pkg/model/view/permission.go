package view

type (
	RespListUserGroup []ListGroupItem

	ReqUpdateGroup struct {
		OriginalName string `json:"name"`
		CurrentName  string `json:"current_name"`
	}

	ReqChangeUserGroup struct {
		UID    uint     `json:"uid"`
		Groups []string `json:"groups"`
	}

	ReqSetGroupAppPerm struct {
		GroupName string   `json:"group_name" valid:"required"`
		AppName   string   `json:"app_name" valid:"required"`
		Env       []string `json:"env"`
		Action    []string `json:"action"`
	}

	ReqSetGroupAPIPerm struct {
		GroupName string        `json:"group_name"`
		APIList   []APIListItem `json:"api_list"`
	}

	ReqSetGroupMenuPerm struct {
		GroupName string   `json:"group_name"`
		Menu      []string `json:"menu"`
	}

	RespListAppGroup []ListGroupItem

	ReqGetGroupMenuPerm struct {
		GroupName string `query:"group_name"`
	}

	ReqGetGroupAPIPerm struct {
		GroupName string `query:"group_name" valid:"required"`
	}

	RespGetGroupAPIPerm []APIPermItem

	RespGetMenuPerm []string

	ReqChangeAppGroup struct {
		AppName   string `json:"app_name"`
		AppEnv    string `json:"app_env"`
		GroupName string `json:"group_name"`
	}

	ReqGetAppPerm struct {
		GroupName     string `json:"group_name"`
		AppNameSearch string `json:"app_name_search"`
		PageSize      uint   `json:"size"`
		Page          uint   `json:"page"`
	}

	RespGetAppPerm struct {
		List       []AppPermItem `json:"list"`
		Pagination Pagination    `json:"pagination"`
	}

	AppPermItem struct {
		Aid           int      `json:"aid"`
		AppName       string   `json:"app_name"`
		AvailableEnvs []string `json:"available_envs"` // 可选的环境
		AllowEnvs     []string `json:"allow_envs"`     // 可用的环境
	}

	ReqListUser struct {
		GroupName string `query:"group_name"`
		Search    string `query:"search"`
		Page      uint   `query:"page"`
		PageSize  uint   `query:"page_size"`
	}

	RespListUser struct {
		List       []ListUserItem `json:"list"`
		Pagination Pagination     `json:"pagination"`
	}

	ListUserItem struct {
		UID      uint     `json:"uid"`
		UserName string   `json:"user_name"`
		NickName string   `json:"nick_name"`
		Access   string   `json:"access"`
		Groups   []string `json:"groups"`
	}

	APIListItem struct {
		Path   string `json:"path"`
		Method string `json:"method"`
	}

	ListGroupItem struct {
		Name string `json:"name"`
	}

	APIPermItem struct {
		Method string `json:"method"`
		Path   string `json:"path"`
	}

	MenuTree []MenuTreeItem

	MenuTreeItem struct {
		Name     string   `json:"name"`
		Path     string   `json:"path"`
		Icon     string   `json:"icon"`
		Children MenuTree `json:"children"`
	}
)
