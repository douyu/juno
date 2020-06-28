package social

import (
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"

	"go.uber.org/zap"
	"golang.org/x/oauth2"
)

type SocialGitlab struct {
	*SocialBase
	allowedGroups []string
	apiUrl        string
}

func (s *SocialGitlab) Type() int {
	return int(GITLAB)
}

func (s *SocialGitlab) IsGroupMember(groups []string) bool {
	if len(s.allowedGroups) == 0 {
		return true
	}

	for _, allowedGroup := range s.allowedGroups {
		for _, group := range groups {
			if group == allowedGroup {
				return true
			}
		}
	}

	return false
}

func (s *SocialGitlab) GetGroups(client *http.Client) []string {
	groups := make([]string, 0)

	for page, url := s.GetGroupsPage(client, s.apiUrl+"/groups"); page != nil; page, url = s.GetGroupsPage(client, url) {
		groups = append(groups, page...)
	}

	return groups
}

// GetGroupsPage returns groups and link to the next page if response is paginated
func (s *SocialGitlab) GetGroupsPage(client *http.Client, url string) ([]string, string) {
	type Group struct {
		FullPath string `json:"full_path"`
	}

	var (
		groups []Group
		next   string
	)

	if url == "" {
		return nil, next
	}

	response, err := HttpGet(client, url)
	if err != nil {
		s.log.Error("Error getting groups from GitLab API", zap.Error(err))
		return nil, next
	}

	if err := json.Unmarshal(response.Body, &groups); err != nil {
		s.log.Error("Error parsing JSON from GitLab API", zap.Error(err))
		return nil, next
	}

	fullPaths := make([]string, len(groups))
	for i, group := range groups {
		fullPaths[i] = group.FullPath
	}

	// GitLab uses Link header with "rel" set to prev/next/first/last page. We need "next".
	if link, ok := response.Headers["Link"]; ok {
		pattern := regexp.MustCompile(`<([^>]+)>; rel="next"`)
		if matches := pattern.FindStringSubmatch(link[0]); matches != nil {
			next = matches[1]
		}
	}

	return fullPaths, next
}

func (s *SocialGitlab) UserInfo(client *http.Client, token *oauth2.Token) (*BasicUserInfo, error) {

	var data struct {
		Id       int
		Username string
		Email    string
		Name     string
		State    string
	}

	response, err := HttpGet(client, s.apiUrl+"/user")
	if err != nil {
		return nil, fmt.Errorf("Error getting user info: %s", err)
	}

	err = json.Unmarshal(response.Body, &data)
	if err != nil {
		return nil, fmt.Errorf("Error getting user info: %s", err)
	}

	if data.State != "active" {
		return nil, fmt.Errorf("User %s is inactive", data.Username)
	}

	groups := s.GetGroups(client)

	userInfo := &BasicUserInfo{
		Id:     fmt.Sprintf("%d", data.Id),
		Name:   data.Name,
		Login:  data.Username,
		Email:  data.Email,
		Groups: groups,
	}

	if !s.IsGroupMember(groups) {
		return nil, ErrMissingGroupMembership
	}

	return userInfo, nil
}
