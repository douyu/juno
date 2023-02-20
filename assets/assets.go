//go:build !embedassets
// +build !embedassets

package assets

import (
	"net/http"
)

var AssetsEmbedded = false

func Assets() (http.FileSystem, error) {
	return http.Dir("./assets/dist"), nil
}
