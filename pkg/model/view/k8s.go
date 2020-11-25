package view

import v1 "k8s.io/api/core/v1"

// K8sConfig k8s config
type K8sConfig struct {
	Domain string
	Token  string
}

// PodList ..
type PodList struct {
	Items []*v1.Pod `json:"items"`
}
