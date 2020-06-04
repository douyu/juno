package auth_test

import (
	"github.com/douyu/juno/pkg/service/auth"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

var _ = Describe("Auth", func() {

	It("GitlabMasterAuth", func() {

		ok, err := auth.GitlabMasterAuth(85, "wsd-projecta-group-srv-content-go")

		Expect(ok).To(Equal(true))
		Expect(err).To(BeNil())
	})
})
