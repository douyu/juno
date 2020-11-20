package k8s

// ApiServer Encapsulates k8s related calls and operations
type ApiServer interface {
	AllClusterSync()
}
