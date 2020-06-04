package gitlab

import (
	"github.com/douyu/jupiter/pkg/conf"
)

var IGitlab *Gitlab

func Init() {

	GitlabTmp, err := New(Opts{
		URL:         conf.GetString("gitlab.url"),
		Client:      conf.GetString("gitlab.client"),
		Secret:      conf.GetString("gitlab.secret"),
		Username:    conf.GetString("gitlab.username"),
		Password:    conf.GetString("gitlab.password"),
		PrivateMode: conf.GetBool("gitlab.privateMode"),
		SkipVerify:  conf.GetBool("gitlab.skipVerify"),
	})

	if err != nil {
		panic("gitlab panic")
	}
	IGitlab = GitlabTmp
}
