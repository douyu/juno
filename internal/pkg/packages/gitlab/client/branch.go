package client

import (
	"encoding/json"
	"fmt"
)

const (
	branchListUrl   = "/projects/:id/repository/branches"
	singleBranchUrl = "/projects/:id/repository/branches/:branch"
)

// List repository branches
// https://docs.gitlab.com/ce/api/branches.html#list-repository-branches
func (c *Client) BranchList(id string) ([]*SingleBranch, error) {
	url, opaque := c.ResourceUrl(branchListUrl, QMap{":id": id}, nil)
	var branchList []*SingleBranch

	contents, err := c.Do("GET", url, opaque, nil)
	if err == nil {
		err = json.Unmarshal(contents, &branchList)
	}
	return branchList, err
}

// Get single repository branch
// https://docs.gitlab.com/ce/api/branches.html#get-single-repository-branch
func (c *Client) SingleBranch(id string, branch string) (*SingleBranch, error) {
	url, opaque := c.ResourceUrl(singleBranchUrl, QMap{":id": id, ":branch": branch}, nil)

	var singleBranch *SingleBranch
	fmt.Println("url===>", url, opaque)
	contents, err := c.Do("GET", url, opaque, nil)
	if err == nil {
		err = json.Unmarshal(contents, &singleBranch)
	}
	return singleBranch, err
}
