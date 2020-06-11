package client

import (
	"encoding/json"

	log "github.com/sirupsen/logrus"
)

const (
	jobsUrl = "/projects/:id/pipelines/:pipeline_id/jobs"
)

// List jobs of pipeline
func (c *Client) Jobs(id, pipeline_id string) ([]*Jobdata, error) {

	url, opaque := c.ResourceUrl(jobsUrl, QMap{":id": id, ":pipeline_id": pipeline_id}, nil)
	var jobs []*Jobdata

	contents, err := c.Do("GET", url, opaque, nil)
	if err == nil {
		err = json.Unmarshal(contents, &jobs)
		if err != nil {
			log.Error("Unmarshal Jobs data error", "content", string(contents), "err", err.Error())
		}
	}
	return jobs, err
}
