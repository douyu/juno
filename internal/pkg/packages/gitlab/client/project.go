package client

import (
	"encoding/base64"
	"encoding/json"
	"strconv"
	"strings"
	// "github.com/davecgh/go-spew/spew"
)

const (
	projectsUrl       = "/projects"
	projectListUrl    = "/projects"
	projectUrl        = "/projects/:id"
	repoUrlRawFileRef = "/projects/:id/repository/files/:filepath"
	commitStatusUrl   = "/projects/:id/statuses/:sha"
	addProjectHookUrl = "/projects/:id/hooks"
	repoUrlFilesRef   = "/projects/:id/repository/tree"
)

// AllProjectList ...
func (c *Client) AllProjectList(hide_archives bool) ([]*SingleSimpleProject, error) {
	var per_page = 100
	var projects []*SingleSimpleProject

	for i := 1; true; i++ {
		contents, err := c.Projects(int(i), int(per_page), hide_archives)
		if err != nil {
			return projects, err
		}

		for _, value := range contents {
			projects = append(projects, value)
		}

		if len(projects) == 0 {
			break
		}

		if len(projects)/i < per_page {
			break
		}
	}

	return projects, nil
}

// ProjectList ...
func (c *Client) ProjectList(page int, perPage int, hide_archives bool) ([]*SingleSimpleProject, error) {
	if perPage > 100 {
		perPage = 100
	}
	return c.Projects(page, perPage, hide_archives)
}

// Get a list of projects owned by the authenticated user.
func (c *Client) Projects(page int, per_page int, hide_archives bool) ([]*SingleSimpleProject, error) {
	projectsOptions := QMap{
		"page":       strconv.Itoa(int(page)),
		"per_page":   strconv.Itoa(int(per_page)),
		"membership": "true",
		"visibility": "private",
		"order_by":   "updated_at",
		"sort":       "desc",
		"simple":     "true",
	}

	if hide_archives {
		projectsOptions["archived"] = "false"
	}

	url, opaque := c.ResourceUrl(projectListUrl, nil, projectsOptions)

	var projects []*SingleSimpleProject
	contents, err := c.Do("GET", url, opaque, nil)

	if err == nil {
		err = json.Unmarshal(contents, &projects)
	}
	return projects, err
}

// Get a project by id
func (c *Client) SingleProject(id string) (*SingleProject, error) {
	url, opaque := c.ResourceUrl(projectUrl, QMap{":id": id}, nil)

	var project *SingleProject

	contents, err := c.Do("GET", url, opaque, nil)
	if err == nil {
		err = json.Unmarshal(contents, &project)
	}

	return project, err
}

// https://docs.gitlab.com/ce/api/projects.html#add-project-hook
func (c *Client) AddProjectHook(id int, url string, pushEvents bool) (*AddProjectHook, error) {
	var pushEventsStr = "false"
	if pushEvents == true {
		pushEventsStr = "true"
	}
	projectsOptions := QMap{
		"url":         url,
		"push_events": pushEventsStr,
	}

	url, opaque := c.ResourceUrl(addProjectHookUrl, QMap{":id": strconv.Itoa(int(id))}, projectsOptions)

	var projects *AddProjectHook
	contents, err := c.Do("POST", url, opaque, nil)

	if err == nil {
		err = json.Unmarshal(contents, &projects)
	}

	return projects, err
}

// RepoRawFileRef ...
func (c *Client) RepoRawFileRef(id, ref, filepath string) ([]byte, error) {
	var fileRef FileRef
	url, opaque := c.ResourceUrl(
		repoUrlRawFileRef,
		QMap{
			":id":       id,
			":filepath": filepath,
		},
		QMap{
			"ref": ref,
		},
	)

	contents, err := c.Do("GET", url, opaque, nil)
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(contents, &fileRef)
	if err != nil {
		return nil, err
	}

	fileRawContent, err := base64.StdEncoding.DecodeString(fileRef.Content)
	return fileRawContent, err
}

// Get Raw file with meta data
func (c *Client) RepoRawFileRefParse(id, ref, filepath string) (*FileContent, error) {
	url, opaque := c.ResourceUrl(
		repoUrlRawFileRef,
		QMap{
			":id":       id,
			":filepath": filepath,
		},
		QMap{
			"ref": ref,
		},
	)
	var f *FileContent
	contents, err := c.Do("GET", url, opaque, nil)
	if err == nil {
		err = json.Unmarshal(contents, &f)
	}
	return f, err
}

//
func (c *Client) SetStatus(id, sha, state, desc, ref, link string) error {
	url, opaque := c.ResourceUrl(
		commitStatusUrl,
		QMap{
			":id":  id,
			":sha": sha,
		},
		QMap{
			"state":       state,
			"ref":         ref,
			"target_url":  link,
			"description": desc,
			"context":     "ci/drone",
		},
	)

	_, err := c.Do("POST", url, opaque, nil)
	return err
}

// Get a list of projects by query owned by the authenticated user.
func (c *Client) SearchProjectId(namespace string, name string) (id int, err error) {

	url, opaque := c.ResourceUrl(projectsUrl, nil, QMap{
		"query":      strings.ToLower(name),
		"membership": "true",
	})

	var projects []*Project

	contents, err := c.Do("GET", url, opaque, nil)
	if err == nil {
		err = json.Unmarshal(contents, &projects)
	} else {
		return id, err
	}

	for _, project := range projects {
		if project.Namespace.Name == namespace && strings.ToLower(project.Name) == strings.ToLower(name) {
			id = project.Id
		}
	}

	return id, err
}

// Get a list of files in path
func (c *Client) RepoFilesInPath(id, ref, filepath string, recursive bool) ([]*RepoFile, error) {
	url, opaque := c.ResourceUrl(
		repoUrlFilesRef,
		QMap{
			":id": id,
		},
		QMap{
			"ref":       ref,
			"path":      filepath,
			"recursive": strconv.FormatBool(recursive),
		},
	)
	var files []*RepoFile
	contents, err := c.Do("GET", url, opaque, nil)
	if err == nil {
		err = json.Unmarshal(contents, &files)
	}

	return files, err
}
