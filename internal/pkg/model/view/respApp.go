package view

import (
	"github.com/douyu/juno/internal/pkg/model/db"
)

// RespAppInfo ...
type RespAppInfo struct {
	Aid       int    `json:"aid"`
	Name      string `json:"name"`
	Lang      string `json:"lang"`
	AppName   string `json:"appName"`
	GitlabURL string `json:"gitlabUrl"`
	ProtoDir  string `json:"proto_dir"`
}

type ResourceList []db.AppTopology

func (p ResourceList) Len() int           { return len(p) }
func (p ResourceList) Less(i, j int) bool { return p[i].Name < p[j].Name }
func (p ResourceList) Swap(i, j int)      { p[i], p[j] = p[j], p[i] }

// RespAppResource ...
type RespAppResource struct {
	Aid   int    `json:"aid"`
	Addr  string `json:"addr"`
	Name  string `json:"name"`
	Env   string `json:"env"`
	Type  string `json:"type"`
	Info  string `json:"info"`
	IdcID int    `json:"idcId"`
}

// RespAppInstance ...
type RespAppInstance struct {
	IP   string
	Host string
}

type RespAppPkgAllList struct {
	Aid        int    `json:"aid"`
	AppName    string `json:"appName"`
	DepName    string `json:"depName"`
	DepBranch  string `json:"depBranch"`
	DepVersion string `json:"depVersion"`
	UpdateTime string `json:"update_time"`
}
type RespAppPkgLinkList struct {
	Aid     int    `json:"aid"`
	DepName string `json:"depName"`
}

type RespAppProjectList struct {
	Aid     int    `json:"aid"`
	AppName string `json:"appName"`
	WebUrl  string `json:"webUrl"`
}

type RespDroneStatus struct {
	RepoId      int    `json:"repoId"`
	RepoLink    string `json:"repoLink"`
	BuildStatus string `json:"buildStatus"`
	BuildEvent  string `json:"buildEvent"`
}

type RespAppCommit struct {
	Aid          int    `json:"aid"`
	Commit       string `json:"commit"`
	ReporterPath string `json:"reporterPath"`
}

type RespAppStatistics struct {
	AppCount     int `json:"appCount"`
	AppNodeCount int `json:"appNodeCount"`
}
