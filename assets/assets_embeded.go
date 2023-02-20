//go:build embedassets
// +build embedassets

package assets

import (
	"embed"
	"io/fs"
	"net/http"
)

var AssetsEmbedded = true

//go:embed dist
var assets embed.FS

func Assets() (http.FileSystem, error) {
	fsys, err := fs.Sub(assets, "dist")
	if err != nil {

		return nil, err
	}
	t := http.FS(fsys)
	return t, nil
}
