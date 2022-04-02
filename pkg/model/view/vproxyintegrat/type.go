package vproxyintegrat

type ProxyMenu struct {
	Id              int    `gorm:"column:id;primary_key;AUTO_INCREMENT" json:"id"`              // 主键
	PanelType       string `gorm:"column:panel_type;NOT NULL" json:"panel_type"`                // 功能页面类型
	ProxyUrl        string `gorm:"column:proxy_url;NOT NULL" json:"proxy_url"`                  // 代理地址
	Key             string `gorm:"column:key;NOT NULL" json:"key"`                              // 唯一key
	CreateTime      int64  `gorm:"column:create_time;default:0;NOT NULL" json:"create_time"`    // 创建时间
	UpdateTime      int64  `gorm:"column:update_time;default:0;NOT NULL" json:"update_time"`    // 更新时间
	DeleteTime      int64  `gorm:"column:delete_time;default:0;NOT NULL" json:"delete_time"`    // 删除时间
	Uid             int    `gorm:"column:uid;default:0;NOT NULL" json:"uid"`                    // 操作人uid
	Title           string `gorm:"column:title;NOT NULL" json:"title"`                          // 功能页面
	ProxyUrlPattern string `gorm:"column:proxy_url_pattern;NOT NULL"  json:"proxy_url_pattern"` //应用代理pattern
	Env             string `gorm:"column:env;NOT NULL"  json:"env"`                             //环境变量
	AppPluginFunc   int    `gorm:"column:app_plugin_func;NOT NULL"  json:"app_plugin_func"`     //环境变量
}

type ProxyManage struct {
	Id         int    `gorm:"column:id;primary_key;AUTO_INCREMENT" json:"id"`           // 主键
	Title      string `gorm:"column:title;NOT NULL" json:"title"`                       // 名称
	SubPath    string `gorm:"column:sub_path;NOT NULL" json:"sub_path"`                 // 代理路径
	IsRewrite  int    `gorm:"column:is_rewrite;default:0;NOT NULL" json:"is_rewrite"`   // 是否重写路径
	ProxyAddr  string `gorm:"column:proxy_addr;NOT NULL" json:"proxy_addr"`             // 代理地址
	CreateTime int64  `gorm:"column:create_time;default:0;NOT NULL" json:"create_time"` // 创建时间
	UpdateTime int64  `gorm:"column:update_time;default:0;NOT NULL" json:"update_time"` // 更新时间
	DeleteTime int64  `gorm:"column:delete_time;default:0;NOT NULL" json:"delete_time"` // 删除时间
	Uid        int    `gorm:"column:uid;default:0;NOT NULL" json:"uid"`                 // 操作人uid
}
type ProxyMenuFunc struct {
	Title     string              `json:"title"`
	PanelType string              `json:"panelType"`
	Key       string              `json:"key"`
	Config    ProxyMenuFuncConfig `json:"config"`
}

type ProxyMenuFuncConfig struct {
	ProxyURL string `json:"proxyURL"`
}

type ProxyUIParams struct {
	Current  int `json:"current"`
	PageSize int `json:"pageSize"`
}

//Valid 是否合法
func (req *ProxyUIParams) Valid() (isValid bool, msg string) {
	if req.Current <= 0 {
		req.Current = 1
	}
	isValid = true
	return
}

// TableName ..
func (ProxyMenu) TableName() string {
	return "proxy_menu"
}

// TableName ..
func (ProxyManage) TableName() string {
	return "proxy_manage"
}
