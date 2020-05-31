package respGovern

// 应用基本信息
type AppInfo struct {
	RuntimeStats
	StartTime   string `json:"startTime" label:"启动时间"` // 启动时间
	BuildTime   string `json:"buildTIme" label:"编译时间"` // 编译时间
	Name        string `json:"name" label:"应用名"`       // 应用名
	Aid         string `json:"aid" label:"应用ID"`
	Iid         string `json:"iid"`
	Pid         int    `json:"pid"`
	Zone        string `json:"zone" label:"zone"`
	Region      string `json:"region" label:"Region"`
	ProjectVcs  string `json:"projectVcs"`
	JupiterVcs  string `json:"jupiterVcs"`
	JupiterDate string `json:"jupiterDate"`
	Env         string `json:"env" label:"Env"`
}
