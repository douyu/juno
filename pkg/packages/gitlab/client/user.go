package client

import (
	"encoding/json"
)

const (
	currentUserUrl   = "/user"
	userByIDUrl      = "/users/:id"
	listUserProjects = "/users/:uid/projects"
)

// CurrentUser ...
func (c *Client) CurrentUser() (User, error) {
	url, opaque := c.ResourceUrl(currentUserUrl, nil, nil)
	var user User

	contents, err := c.Do("GET", url, opaque, nil)

	if err == nil {
		err = json.Unmarshal(contents, &user)
	}

	return user, err
}

// UserByID ...
func (c *Client) UserByID(id string) (User, error) {
	url, opaque := c.ResourceUrl(userByIDUrl, QMap{":id": id}, nil)
	var user User

	contents, err := c.Do("GET", url, opaque, nil)
	if err == nil {
		err = json.Unmarshal(contents, &user)
	}

	return user, err
}

// UserProjectList ...
func (c *Client) UserProjectList(uid string) ([]*SingleProject, error) {
	url, opaque := c.ResourceUrl(listUserProjects, QMap{":uid": uid}, nil)
	var resp []*SingleProject

	contents, err := c.Do("GET", url, opaque, nil)
	if err == nil {
		err = json.Unmarshal(contents, &resp)
	}

	return resp, err
}
