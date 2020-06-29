package util

func Diff(a map[string]interface{}, b map[string]interface{}) map[string]interface{} {
	res := make(map[string]interface{}, 0)
	for name, id := range a {
		if _, ok := b[name]; !ok {
			res[name] = id
		}
	}
	return res
}
