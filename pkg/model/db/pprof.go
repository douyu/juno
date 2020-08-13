package db

// 发布环境
type PProf struct {
	ID         int         `gorm:"not null;primary_key" json:"id"`
	Type       string      `gorm:"not null;"json:"type"`
	SceneId    string      `gorm:"not null;"json:"sceneId"`
	AppName    string      `gorm:"not null;"json:"appName"`   // 项目id
	Aid        int         `gorm:"not null;"json:"aid"`       // 项目id
	FileInfo   string      `gorm:"not null;"json:"fileInfo"`  // 环境类型名称
	ZoneCode   string      `gorm:"not null;"json:"zone_code"` // 　环境类型
	Env        string      `gorm:"not null;"json:"env"`       // 　环境类型
	Ext        string      `gorm:"not null;"json:"ext"`
	Remark     string      `gorm:"not null;"json:"remark"`
	HostName   string      `gorm:"not null;"json:"hostName"`
	CreateTime int64       `gorm:""json:"create_time"`
	UpdateTime int64       `gorm:""json:"update_time"`
	DeleteTime int64       `gorm:"index"json:"delete_time"`
	PprofList  []PprofInfo `gorm:"-"json:"pprofList"`
}

type PprofInfo struct {
	Id   int    `json:"id"`
	Type string `json:"type"`
	Url  string `json:"url"`
}

// TableName 表名
func (PProf) TableName() string {
	return "pprof"
}

type PProfViewModel struct {
	PProf
	HostName string `json:"host_name"` // 主机名
}

type PProfFileInfo struct {
	Url      string `json:"url"`
	FileType string `json:"fileType"`
}

type PProfOssFile struct {
	FileType    string `json:"fileType"`
	OriginalRid string `json:"originalRid"`
	OriginalMd5 string `json:"originalMd5"`
	Original    string `json:"original"`
}

type ReqCheck struct {
	InstallType int `json:"installType"`
}

type ReqSysConfig struct {
	Id      int    `gorm:"not null;"json:"id"`
	SysType int    `json:"sysType"`
	SetInt  int    `json:"setInt"`
	SetCate string `gorm:"not null;column:set_cate" json:"setCate"`
	SetStr  string `json:"setStr"`
}
