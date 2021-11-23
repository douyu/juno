package k8s

// apiServer Encapsulates k8s related calls and operations
type apiServer interface {
	allClusterStart(prefix string, excludeSuffix []string)
	allClusterSync(namespace string, appName string) error
	close()
	get(zoneCode string, url string, v map[string]string, resp interface{}) (err error)
	post(zoneCode string, url string, v interface{}, resp interface{}) (err error)
	postStream(zoneCode string, url string, v interface{}) (stream []byte, err error)
	getStream(zoneCode string, url string, v map[string]string) (stream []byte, err error)
}

// Sync 同步指定aid的k8s节点数据，aid=0时同步全量的
func Sync(appName string) error {
	return IK8s.allClusterSync("wsd", appName)
}

// SyncAll 同步所以aid的k8s节点数据，aid=0时同步全量的
func SyncAll() error {
	return IK8s.allClusterSync("wsd", "")
}

func Reload() {
	IK8s.close()
	Init()
}
