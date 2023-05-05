//go:build !embedassets
// +build !embedassets

package assets

import (
	"net/http"
	"path/filepath"
)

var AssetsEmbedded = false

func Assets() (http.FileSystem, error) {
	pathDir := filepath.Join(".", "assets", "dist")
	return http.Dir(pathDir), nil
}
