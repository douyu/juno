package k8s

import "time"

// dataRetentionTime ..
const dataRetentionTime = time.Hour * 24 * 3

// cleanInterval ..
const cleanInterval = time.Minute * 30

const (
	podListAllNamespaces = "/api/v1/pods"
	podItem              = "/api/v1/namespaces/%s/pods/%s"
	podLog               = "/api/v1/namespaces/%s/pods/%s/log"
)

var AllowPodStatus = map[string]bool{
	"Running":   true,
}
