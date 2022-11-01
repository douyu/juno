package e2e

import (
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

var _ = Describe("juno-admin", func() {
	Context("SayHello", func() {
		It("normal", func() {
			Expect(1).To(Equal(1))
		})
	})
})
