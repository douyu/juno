package supervisor

import (
	"errors"
	"fmt"

	"github.com/douyu/juno/pkg/util"
)

type ActionType int32

//noinspection ALL
const (
	ActionType_StatusAction ActionType = 0
	ActionType_StartAction  ActionType = 1
	ActionType_StopAction   ActionType = 2
	ActionType_RelaodAction ActionType = 3
)

func NewSupervisor() *Supervisor {
	return &Supervisor{}
}

var ActionMap = map[ActionType]string{
	ActionType_StartAction:  "start",
	ActionType_StatusAction: "status",
	ActionType_StopAction:   "stop",
	ActionType_RelaodAction: "restart",
}

type Supervisor struct{}

type ActionReq struct {
	Aid      uint64
	AppName  string
	ZoneCode string
	HostName string
	Action   ActionType
}

type ActionResp struct {
	Code int64
	Msg  string
	Data map[string]*ActionData
}

type ActionData struct {
	RetCode int64
	StdErr  string
	StdOut  string
}

type Req struct {
	AppName            string
	IdcSrvPubAppName   string
	IdcSrvPubAddr      string
	IdcSrvAccessKey    string
	IdcSrvAccessSecret string
	ServerName         string
}

type Ret struct {
	BaseRet
	Data map[string]RetExecInfo `json:"data"`
}

type RetExecInfo struct {
	RetCode int    `json:"retcode"`
	StdErr  string `json:"stderr"`
	StdOut  string `json:"stdout"`
}

var actionList = []string{
	"start", "restart", "stop", "status", "update",
}

func (s *Supervisor) DoCtrl(action string, supervisorReq Req) (ret *OpsSupervisorRet, err error) {
	_, inAction := util.InArray(action, actionList)
	if inAction == false {
		return ret, errors.New("action not found")
	}

	mac := NewMac(supervisorReq.IdcSrvAccessKey, supervisorReq.IdcSrvAccessSecret)
	opsClient := NewOpsClient(supervisorReq.IdcSrvPubAddr, mac)
	req := &OpsSupervisorReq{}
	req.ProjectName = supervisorReq.IdcSrvPubAppName
	req.Cmd = action
	var serverNames []string
	serverNames = append(serverNames, supervisorReq.ServerName)
	req.ServersId = serverNames
	req.Args = []string{supervisorReq.AppName}

	superRet, err := opsClient.Supervisor(req)

	fmt.Println(superRet)

	return superRet, err
}
