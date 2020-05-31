package codec_test

import (
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"

	"testing"
)

func TestCodec(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "Codec Suite")
}
