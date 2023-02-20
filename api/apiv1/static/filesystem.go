package static

import (
	"net/http"
	"path"
	"path/filepath"
	"strings"
)

// FileSystem is a wrapper around the http.FileSystem interface, adding a method to let us check for the existence
// of files without (attempting to) open them.
type FileSystem interface {
	http.FileSystem
	Exists(string) bool
}

// Dir is a replacement for the http.Dir type, and implements FileSystem.
type Dir string

// Exists tests whether a file with the specified name exists, resolved relative to the base directory.
func (d Dir) Exists(name string) bool {
	if filepath.Separator != '/' && strings.ContainsRune(name, filepath.Separator) {
		return false
	}
	dir := string(d)
	if dir == "" {
		dir = "."
	}
	fullName := filepath.Join(dir, filepath.FromSlash(path.Clean("/"+name)))
	fullName = strings.TrimPrefix(fullName, strings.TrimPrefix(Prefix, "/"))
	_, err := statikFS.Open(fullName)
	return err == nil
}

// Open defers to http.Dir's Open so that gzipped.Dir implements http.FileSystem.
func (d Dir) Open(name string) (http.File, error) {
	dir := string(d)
	if dir == "" {
		dir = "."
	}
	fullName := filepath.Join(dir, filepath.FromSlash(path.Clean("/"+name)))
	fullName = strings.TrimPrefix(fullName, strings.TrimPrefix(Prefix, "/"))
	return statikFS.Open(fullName)
}
