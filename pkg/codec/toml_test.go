package codec

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

var data = map[string]interface{}{
	"jupiter.registry.etcd.endpoints": []string{"aa", "bb"},
	"jupiter.registry.etcd.timeout":   "1s",
	"jupiter.registry.etcd.read":      "3s",
}

func TestToml(t *testing.T) {
	content, err := UnmarshalTOML(data)
	assert.Nil(t, err)
	fmt.Printf("content => %+v\n", content)
}
