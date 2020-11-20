package db

import "time"

// K8sPod ..
type K8sPod struct {
	// common field
	PodName           string    `json:"pod_name" gorm:"column:pod_name;primary_key"`           //名称
	Env               string    `json:"env" gorm:"column:env"`                                 //env
	Namespace         string    `json:"namespace" gorm:"column:namespace"`                     //namespace
	HostIp            string    `json:"host_ip" gorm:"column:host_ip"`                         //host_ip
	PodIp             string    `json:"pod_ip" gorm:"column:pod_ip"`                           //podIP
	NodeName          string    `json:"node_name" gorm:"column:node_name"`                     //nodeName
	StartTime         time.Time `json:"start_time" gorm:"column:start_time"`                   //updateTime
	UpdateTime        time.Time `json:"update_time" gorm:"column:update_time"`                 //updateTime
	Image             string    `json:"image" gorm:"column:image"`                             //imageVersion
	Status            string    `json:"status" gorm:"column:status"`                           //status
	InstanceGroupID   string    `json:"instance_group_id" gorm:"column:instance_group_id"`     //appDeploymentId
	InstanceGroupName string    `json:"instance_group_name" gorm:"column:instance_group_name"` //appDeploymentName
	MD5               string    `json:"md5" gorm:"column:md5"`                                 //body
	IsDel             int32     `json:"is_del" gorm:"column:is_del"`                           //id_del

	// customize label
	Aid      int32  `json:"aid" gorm:"column:aid"`             //appId
	AppName  string `json:"app_name" gorm:"column:app_name"`   //appName
	ZoneCode string `json:"zone_code" gorm:"column:zone_code"` //idc_code
}

// TableName ..
func (t *K8sPod) TableName() string {
	return "k8s_pod"
}
