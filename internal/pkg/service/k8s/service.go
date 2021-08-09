package k8s

// apiServer Encapsulates k8s related calls and operations
type apiServer interface {
	allClusterSync(prefix string, excludeSuffix []string)
	get(zoneCode string, url string, v map[string]string, resp interface{}) (err error)
	post(zoneCode string, url string, v interface{}, resp interface{}) (err error)
	postStream(zoneCode string, url string, v interface{}) (stream []byte, err error)
	getStream(zoneCode string, url string, v map[string]string) (stream []byte, err error)
}
