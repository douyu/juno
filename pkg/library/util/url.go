package util

import (
	"bytes"
	"regexp"
	"sort"
)

// GetURLParams 计算queryString
func GetURLParams(params map[string]string) string {
	// Sort
	keys := make([]string, 0, len(params))
	for k := range params {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	// Serialize
	var buf bytes.Buffer
	for _, k := range keys {
		if buf.Len() > 0 {
			buf.WriteByte('&')
		}
		buf.WriteString(k)
		if params[k] != "" {
			buf.WriteString("=" + params[k])
		}
	}
	return buf.String()
}

var regName = regexp.MustCompile(`^(https?)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]`)

func ValidUrl(url string) bool {
	return regName.Match([]byte(url))
}
