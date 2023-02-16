package casbin

import (
	_ "embed"
)

//go:embed resource.yaml
var resourceContent string

//go:embed model.conf
var modelContent string
