package social

import (
	"encoding/json"
	"fmt"
	"net/http"

	"golang.org/x/oauth2"
)

type SocialGoogle struct {
	*SocialBase
	hostedDomain string
	apiUrl       string
}

func (s *SocialGoogle) Type() int {
	return int(GOOGLE)
}

func (s *SocialGoogle) UserInfo(client *http.Client, token *oauth2.Token) (*BasicUserInfo, error) {
	var data struct {
		Id    string `json:"id"`
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	response, err := HttpGet(client, s.apiUrl)
	if err != nil {
		return nil, fmt.Errorf("Error getting user info: %s", err)
	}

	err = json.Unmarshal(response.Body, &data)
	if err != nil {
		return nil, fmt.Errorf("Error getting user info: %s", err)
	}

	return &BasicUserInfo{
		Id:    data.Id,
		Name:  data.Name,
		Email: data.Email,
		Login: data.Email,
	}, nil
}
