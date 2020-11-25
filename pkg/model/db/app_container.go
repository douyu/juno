package db

// AppContainer ...
type AppContainer struct {
	ID     uint `gorm:"primary_key"`
	Aid    int  `json:"aid"`
	IdcID  int  `json:"idc_id"`
	K8sAid int  `json:"k8s_aid"`
}

// TableName ...
func (AppContainer) TableName() string {
	return `app_container`
}

// FlowContainer ...
type FlowContainer struct {
	ID     uint `gorm:"primary_key"`
	FlowID int  `json:"flow_id"`
	K8sDid int  `json:"k8s_did"`
}

// TableName ...
func (FlowContainer) TableName() string {
	return `flow_container`
}
