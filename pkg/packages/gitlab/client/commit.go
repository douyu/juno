package client

import (
	"encoding/json"
)

const (
	commitListUrl   = "/projects/:id/repository/commits"
	singleCommitUrl = "/projects/:id/repository/commits/:sha"
)

// Commit Api
// https://docs.gitlab.com/ce/api/commits.html#get-a-single-commit
func (c *Client) SingleCommit(id string, sha string) (*SingleCommit, error) {
	url, opaque := c.ResourceUrl(singleCommitUrl, QMap{":id": id, ":sha": sha}, nil)

	var singleCommit *SingleCommit

	contents, err := c.Do("GET", url, opaque, nil)
	if err == nil {
		err = json.Unmarshal(contents, &singleCommit)
	}
	return singleCommit, err
}

// CommitList ...
func (c *Client) CommitList(id, ref string) ([]SingleCommit, error) {
	url, opaque := c.ResourceUrl(commitListUrl, QMap{":id": id}, QMap{"ref_name": ref})

	var commits []SingleCommit

	contents, err := c.Do("GET", url, opaque, nil)
	if err == nil {
		err = json.Unmarshal(contents, &commits)
	}
	return commits, err
}
