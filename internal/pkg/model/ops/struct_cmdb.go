package ops

import (
	"encoding/json"

	"github.com/douyu/juno/internal/pkg/library/util"
)

// 登录返回数据结构
type RespLogin struct {
	Msg  string `json:"msg"`
	Code int    `json:"code"`
	Data struct {
		Iat   int    `json:"iat"`
		Token string `json:"token"`
		Exp   int    `json:"exp"`
	} `json:"data"`
}

type RespDeviceList struct {
	Count   int         `json:"count"`
	Results []OneDevice `json:"results"`
}

type OneDevice struct {
	UsageClassify      string        `json:"usage_classify"`
	OutUsageDate       interface{}   `json:"out_usage_date"`
	DeviceSource       string        `json:"device_source"`
	DeviceUUID         string        `json:"device_uuid"`
	Ipv6               []interface{} `json:"ipv6"`
	IdcRoom            string        `json:"idc_room"`
	MinionID           string        `json:"minion_id"`
	DeviceMonitorTags  string        `json:"device_monitor_tags"`
	InIP               []string      `json:"in_ip"`
	DeviceType         string        `json:"device_type"`
	UseDepartment      string        `json:"use_department"`
	IdracIP            string        `json:"idrac_ip"`
	Disk               string        `json:"disk"`
	OutIP              []interface{} `json:"out_ip"`
	DeviceID           int           `json:"device_id"`
	BizList            []string      `json:"biz_list"`
	InstanceName       string        `json:"instance_name"`
	BondingMode        string        `json:"bonding_mode"`
	OsFinger           string        `json:"os_finger"`
	IdcCabinet         string        `json:"idc_cabinet"`
	StartUsageDate     interface{}   `json:"start_usage_date"`
	UseEnv             string        `json:"use_env"`
	DeviceSubstatus    string        `json:"device_substatus"`
	DeviceModel        interface{}   `json:"device_model"`
	User               string        `json:"user"`
	Hostname           string        `json:"hostname"`
	UseSubdepartment   string        `json:"use_subdepartment"`
	DeviceStatus       string        `json:"device_status"`
	SerialNum          string        `json:"serial_num"`
	InstanceID         string        `json:"instance_id"`
	MaintainDepartment string        `json:"maintain_department"`
	ManagerServer      string        `json:"manager_server"`
	DeviceOpsUsers     string        `json:"device_ops_users"`
	Memory             string        `json:"memory"`
	Usage              string        `json:"usage"`
	Manufacturer       string        `json:"manufacturer"`
	ManagerIP          string        `json:"manager_ip"`
	CPU                string        `json:"cpu"`
	StartUBit          string        `json:"start_u_bit"`
}

type CmdbAppApiRet struct {
	Msg  string    `json:"msg"`
	Code int       `json:"code"`
	Data []AppData `json:"data"`
}

type RespOneAppData struct {
	Msg  string  `json:"msg"`
	Code int     `json:"code"`
	Data AppData `json:"data"`
}

type AppData struct {
	ID            int      `json:"id"`
	GitID         int      `json:"git_id"`
	JunoId        int      `json:"juno_id"`
	ServiceName   string   `json:"service_name"`
	ServiceNameCN string   `json:"service_name_cn"`
	Lang          string   `json:"dev_lang"`
	HttpPort      int      `json:"http_port"`
	RPCPort       int      `json:"rpc_port"`
	HealthPort    int      `json:"health_port"`
	CreatedTime   string   `json:"created_time"`
	UpdatedTime   string   `json:"updated_time"`
	OaNames       []string `json:"oa_names"`
	OaIds         []int    `json:"oa_ids"`
	BizId         int      `json:"biz_id"`
	OwnerDptName  string   `json:"owner_dpt_name"`
	BizDomain     string   `json:"biz_domain"`
	TagNames      []string `json:"tag_names"`
	TagIds        []int    `json:"tag_ids"`
	GitPath       string   `json:"git_path"`
}

func (a *AppData) MD5String() string {
	buf, _ := json.Marshal(a)
	return util.Md5(string(buf))
}

type CmdbEnvPubApiRet struct {
	Msg  string           `json:"msg"`
	Code int              `json:"code"`
	Data []CmdbEnvPubItem `json:"data"`
}

type CmdbEnvPubItem struct {
	Id       int    `json:"id"`
	IdcId    int    `json:"juno_idc_id"`
	InnerIp  string `json:"inner_ip"`
	HostName string `json:"hostname"`
	DeviceId int    `json:"device_id"`
	Env      string `json:"env"`
}

type AppK8sInstanceRet struct {
	Msg  string               `json:"msg"`
	Code int                  `json:"code"`
	Data []AppK8sInstanceItem `json:"data"`
}

type AppK8sInstanceItem struct {
	Id            int    `json:"id"`
	IdcId         int    `json:"juno_idc_id"`
	InnerIp       string `json:"inner_ip"`
	HostName      string `json:"hostname"`
	DeviceId      int    `json:"device_id"`
	Env           string `json:"env"`
	Mode          int    `json:"mode"`
	IP            string `json:"ip"`
	ContainerIP   string `json:"container_ip"`
	ContainerName string `json:"container_name"`
}

type RespDayuNode struct {
	Msg  string `json:"msg"`
	Code int    `json:"code"`
	Data struct {
		ServiceName  string     `json:"service_name"`
		ServiceNodes []DayuNode `json:"service_nodes"`
		GitPath      string     `json:"git_path"`
		ServiceID    int        `json:"service_id"`
		DeployPath   string     `json:"deploy_path"`
		OwnerID      []int      `json:"owner_id"`
	} `json:"data"`
}

type DayuNode struct {
	ZoneCode   string `json:"zone_code"`
	RegionCode string `json:"region_code"`
	RegionName string `json:"region_name"`
	Env        string `json:"env"`
	IP         string `json:"ip"`
	Hostname   string `json:"hostname"`
	IdcName    string `json:"idc_name"`
	DeviceID   int    `json:"device_id"`
}
