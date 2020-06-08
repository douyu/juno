package client

import "encoding/json"

const (
	tagListUrl   = "/projects/:id/repository/tags"
	singleTagUrl = "/projects/:id/repository/tags/:tag_name"
)

// Get repo tag list
// https://docs.gitlab.com/ce/api/tags.html#list-project-repository-tags
func (c *Client) TagList(id string) ([]SingleTag, error) {
	url, opaque := c.ResourceUrl(tagListUrl, QMap{":id": id}, nil)
	var tags []SingleTag

	contents, err := c.Do("GET", url, opaque, nil)
	if err == nil {
		err = json.Unmarshal(contents, &tags)
	}
	return tags, err
}

// get repo tag info
// https://docs.gitlab.com/ce/api/tags.html#get-a-single-repository-tag
func (c *Client) SingleTag(id, tagName string) (SingleTag, error) {
	url, opaque := c.ResourceUrl(singleTagUrl, QMap{":id": id, ":tag_name": tagName}, nil)

	tag := SingleTag{}
	contents, err := c.Do("GET", url, opaque, nil)
	if err == nil {
		err = json.Unmarshal(contents, &tag)
	}
	return tag, err
}
