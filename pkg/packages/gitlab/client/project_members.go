package client

import (
	"encoding/json"
	"errors"
	"fmt"

	log "github.com/sirupsen/logrus"
)

const (
	memberOfProjectUrl    = "/projects/:id/members/:user_id"
	userOfProjectUrl      = "/projects/:id/users"
	projectMembersListUrl = "/projects/:id/members"
	ProjectAccessUrl      = "/projects/:id"
	BranchAccessUrl       = "/projects/:id/repository/branches"
)

// GetProjectMembers 从指定project中获得所有用户列表
func (c *Client) GetProjectMembersList(id string) ([]*User, error) {
	url, opaque := c.ResourceUrl(
		projectMembersListUrl,
		QMap{
			":id": id,
		},
		nil,
	)
	var users []*User
	contents, err := c.Do("GET", url, opaque, nil)
	if err == nil {
		err = json.Unmarshal(contents, &users)
	}

	return users, err
}

// GetProjectMembers 从指定project中获得所有用户列表
func (c *Client) GetProjectAccessList(id string) (int, error) {
	url, opaque := c.ResourceUrl(
		ProjectAccessUrl,
		QMap{
			":id": id,
		},
		nil,
	)
	project := Project{}
	contents, err := c.Do("GET", url, opaque, nil)
	if err != nil {
		return 0, err
	}
	if err = json.Unmarshal(contents, &project); err != nil {
		return 0, err
	}
	log.Info("gitlabAuth", "resp", string(contents), "token", c.Token)
	// 有的账号有group access需要兼容
	var level int
	if project.Permissions.ProjectAccess != nil {
		level = project.Permissions.ProjectAccess.AccessLevel
	} else if project.Permissions.GroupAccess != nil {
		level = project.Permissions.GroupAccess.AccessLevel
	} else {
		return 0, fmt.Errorf("project group access empty")
	}
	return level, err
}

// GetProjectMembers 从指定project中获得所有用户列表
func (c *Client) GetBranchtAccessList(id string) error {
	url, opaque := c.ResourceUrl(
		BranchAccessUrl,
		QMap{
			":id": id,
		},
		nil,
	)
	type branch struct {
		Name string `json:"name"`
	}
	result := make([]branch, 0)
	contents, err := c.Do("GET", url, opaque, nil)
	if err != nil {
		return err
	}
	if err = json.Unmarshal(contents, &result); err != nil {
		return err
	}
	if len(result) == 0 {
		return fmt.Errorf("no auth")
	}
	return nil
}

// GetMemberOfProject 从指定project中获得指定用户信息
func (c *Client) GetMemberOfProject(id, uid string) (User, error) {
	url, opaque := c.ResourceUrl(
		memberOfProjectUrl,
		QMap{
			":id":      id,
			":user_id": uid,
		},
		nil,
	)
	var user User
	contents, err := c.Do("GET", url, opaque, nil)
	if err == nil {
		err = json.Unmarshal(contents, &user)
	}

	return user, err
}

// GetMemberOfProject 从指定project中获得指定用户信息
func (c *Client) GetUserOfProject(id, uname string) (*User, error) {
	url, opaque := c.ResourceUrl(
		userOfProjectUrl,
		QMap{
			":id": id,
		},
		nil,
	)
	var users []*User
	url = url + "search=" + uname
	contents, err := c.Do("GET", url, opaque, nil)
	if err == nil {
		err = json.Unmarshal(contents, &users)
	}
	if len(users) == 0 {
		return nil, errors.New("no this user")
	}
	return users[0], err
}
