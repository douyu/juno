package client

import (
	"encoding/json"
)

const (
	addDeployKeyUrl = "/projects/:id/deploy_keys"
)

// AddDeployKey ...
func (c *Client) AddDeployKey(gidStr, title, deployKey string) (*AddDeployKey, error) {
	projectsOptions := QMap{
		"title": title,
		"key":   deployKey,
	}

	url, opaque := c.ResourceUrl(addDeployKeyUrl, QMap{
		":id": gidStr,
	}, projectsOptions)

	var project *AddDeployKey
	contents, err := c.Do("POST", url, opaque, nil)
	if err == nil {
		err = json.Unmarshal(contents, &project)
	}

	return project, err
}
