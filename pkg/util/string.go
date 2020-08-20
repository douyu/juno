package util

func CommonPrefix(arr []string) string {
	if len(arr) == 0 {
		return ""
	}

	minLen := len(arr[0])
	for _, s := range arr {
		if len(s) < minLen {
			minLen = len(s)
		}
	}

	if minLen == 0 {
		return ""
	}

	prefix := arr[0][:minLen]
	for _, s := range arr {
		for i := 1; i <= minLen; i++ {
			if prefix[:i] != s[:i] {
				prefix = prefix[:i-1]
				minLen = len(prefix)
			}
		}
	}

	return prefix
}
