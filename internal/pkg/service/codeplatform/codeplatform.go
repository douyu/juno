package codeplatform

import (
	"bytes"
	"log"
	"path/filepath"

	"github.com/douyu/juno/pkg/util"
	git "github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing/transport/http"
	"github.com/pkg/errors"
)

type (
	Option struct {
		StorageDir string
		Token      string
	}

	CodePlatform struct {
		option Option
	}
)

func New(option Option) *CodePlatform {
	var err error
	option.StorageDir, err = filepath.Abs(option.StorageDir)
	if err != nil {
		log.Fatalf("code.Platform New() failed: %s", err.Error())
	}

	return &CodePlatform{
		option: option,
	}
}

func (c *CodePlatform) CloneOrPull(gitUrl, targetPath string) (progress string, err error) {
	progressBuf := bytes.NewBufferString("")

	auth := &http.BasicAuth{
		Username: "juno",
		Password: c.option.Token, // Bearer Token
	}

	// check if exists
	if util.IsExist(targetPath) {
		var repo *git.Repository
		repo, err = git.PlainOpen(targetPath)
		if err != nil {
			err = errors.Wrapf(err, "%s exists but repo open failed", targetPath)
			return
		}

		wt, _ := repo.Worktree()
		err = wt.Pull(&git.PullOptions{
			SingleBranch:      true,
			RemoteName:        "origin",
			Depth:             1,
			Auth:              auth,
			RecurseSubmodules: 0,
			Progress:          progressBuf,
			Force:             true,
		})
	} else {
		_, err = git.PlainClone(targetPath, false, &git.CloneOptions{
			URL:               gitUrl,
			Auth:              auth,
			SingleBranch:      true,
			RemoteName:        "origin",
			NoCheckout:        false,
			Depth:             1,
			RecurseSubmodules: 0,
			Progress:          progressBuf,
			Tags:              0,
		})
	}

	progress = progressBuf.String()
	if err == git.NoErrAlreadyUpToDate {
		progress = `already up-to-date`
		err = nil
	} else if err != nil {
		return
	}

	return
}
