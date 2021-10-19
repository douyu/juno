package db

import (
	"encoding/json"
	"strconv"
	"strings"
	"time"

	"github.com/douyu/juno/pkg/util"
	v1 "k8s.io/api/core/v1"
)

// K8sPod ..
type K8sPod struct {
	// common field
	PodName           string    `json:"pod_name" gorm:"column:pod_name;primary_key"`           //名称
	Env               string    `json:"env" gorm:"column:env"`                                 //env
	Namespace         string    `json:"namespace" gorm:"column:namespace"`                     //namespace
	HostIp            string    `json:"host_ip" gorm:"column:host_ip"`                         //host_ip
	PodIp             string    `json:"pod_ip" gorm:"column:pod_ip"`                           //podIP
	NodeName          string    `json:"node_name" gorm:"column:node_name;index:idx_node_name"` //nodeName
	StartTime         time.Time `json:"start_time" gorm:"column:start_time"`                   //updateTime
	UpdateTime        time.Time `json:"update_time" gorm:"column:update_time"`                 //updateTime
	Image             string    `json:"image" gorm:"column:image"`                             //imageVersion
	Status            string    `json:"status" gorm:"column:status"`                           //status
	InstanceGroupID   string    `json:"instance_group_id" gorm:"column:instance_group_id"`     //appDeploymentId
	InstanceGroupName string    `json:"instance_group_name" gorm:"column:instance_group_name"` //appDeploymentName
	MD5               string    `json:"md5" gorm:"column:md5;index:idx_md5"`                   //body
	IsDel             int32     `json:"is_del" gorm:"column:is_del"`                           //id_del

	// customize label
	Aid      int32  `json:"aid" gorm:"column:aid;index:idx_aid"`               //appId
	AppName  string `json:"app_name" gorm:"column:app_name;index:idx_appname"` //appName
	ZoneCode string `json:"zone_code" gorm:"column:zone_code"`                 //idc_code
	Domain   string `json:"domain" gorm:"column:domain"`                       //zoneCode+Domain唯一标识一个集群
}

// TableName ..
func (t *K8sPod) TableName() string {
	return "k8s_pod"
}

// Formatting ..
func (t *K8sPod) Formatting(zc, domain string, in *v1.Pod) {
	aid, _ := strconv.ParseUint(in.ObjectMeta.Labels["dyAppId"], 10, 32)
	t.Aid = int32(aid)
	t.Env = strings.TrimSpace(in.ObjectMeta.Labels["runEnv"])
	t.ZoneCode = strings.TrimSpace(zc)
	t.Domain = strings.TrimSpace(domain)
	t.PodName = strings.TrimSpace(in.ObjectMeta.Name)
	t.UpdateTime = in.ObjectMeta.CreationTimestamp.Time
	t.AppName = strings.TrimSpace(in.ObjectMeta.Labels["appName"])
	t.Namespace = strings.TrimSpace(in.ObjectMeta.Namespace)

	if len(in.Spec.Containers) > 0 {
		t.Image = strings.TrimSpace(in.Spec.Containers[0].Image)
	}

	t.NodeName = strings.TrimSpace(in.Spec.NodeName)
	t.HostIp = strings.TrimSpace(in.Status.HostIP)
	t.PodIp = strings.TrimSpace(in.Status.PodIP)
	t.Status = strings.TrimSpace(string(in.Status.Phase))
	if in.Status.StartTime != nil {
		t.StartTime = in.Status.StartTime.Time
	}
	t.UpdateTime = time.Now()
	t.InstanceGroupID = strings.TrimSpace(in.ObjectMeta.Labels["appDeploymentId"])
	t.InstanceGroupName = strings.TrimSpace(in.ObjectMeta.Labels["name"])
	t.IsDel = 0

	md5BodyByte, _ := json.Marshal(in)
	t.MD5 = util.Md5(string(md5BodyByte))
}
