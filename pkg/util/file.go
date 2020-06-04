package util

import (
	"os"
	"path/filepath"
	"strings"
)

func AddPathSeparatorIfAbsent(path string) string {
	s := string(os.PathSeparator)
	if !strings.HasSuffix(path, s) {
		return path + s
	}
	return path
}

func GetCurrentDirectory() string {
	dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	if err != nil {
	}
	return strings.Replace(dir, "\\", "/", -1)
}
