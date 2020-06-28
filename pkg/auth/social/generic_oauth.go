package social

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/mail"
	"regexp"

	"github.com/douyu/juno/pkg/util/errutil"
	"go.uber.org/zap"
	"golang.org/x/oauth2"
)

type SocialGenericOAuth struct {
	*SocialBase
	allowedOrganizations []string
	apiUrl               string
	emailAttributeName   string
	emailAttributePath   string
	roleAttributePath    string
	teamIds              []int
}

func (s *SocialGenericOAuth) Type() int {
	return int(GENERIC)
}

func (s *SocialGenericOAuth) IsTeamMember(client *http.Client) bool {
	if len(s.teamIds) == 0 {
		return true
	}

	teamMemberships, ok := s.FetchTeamMemberships(client)
	if !ok {
		return false
	}

	for _, teamId := range s.teamIds {
		for _, membershipId := range teamMemberships {
			if teamId == membershipId {
				return true
			}
		}
	}

	return false
}

func (s *SocialGenericOAuth) IsOrganizationMember(client *http.Client) bool {
	if len(s.allowedOrganizations) == 0 {
		return true
	}

	organizations, ok := s.FetchOrganizations(client)
	if !ok {
		return false
	}

	for _, allowedOrganization := range s.allowedOrganizations {
		for _, organization := range organizations {
			if organization == allowedOrganization {
				return true
			}
		}
	}

	return false
}

type UserInfoJson struct {
	Name        string              `json:"name"`
	DisplayName string              `json:"display_name"`
	Login       string              `json:"login"`
	Username    string              `json:"username"`
	Email       string              `json:"email"`
	Upn         string              `json:"upn"`
	Attributes  map[string][]string `json:"attributes"`
	rawJSON     []byte
}

func (info *UserInfoJson) String() string {
	return fmt.Sprintf(
		"Name: %s, Displayname: %s, Login: %s, Username: %s, Email: %s, Upn: %s, Attributes: %v",
		info.Name, info.DisplayName, info.Login, info.Username, info.Email, info.Upn, info.Attributes)
}

func (s *SocialGenericOAuth) UserInfo(client *http.Client, token *oauth2.Token) (*BasicUserInfo, error) {
	var data UserInfoJson
	var err error

	userInfo := &BasicUserInfo{}

	if s.extractToken(&data, token) {
		s.fillUserInfo(userInfo, &data)
	}

	if s.extractAPI(&data, client) {
		s.fillUserInfo(userInfo, &data)
	}

	if userInfo.Email == "" {
		userInfo.Email, err = s.FetchPrivateEmail(client)
		if err != nil {
			return nil, err
		}
	}

	if userInfo.Login == "" {
		userInfo.Login = userInfo.Email
	}

	if !s.IsTeamMember(client) {
		return nil, errors.New("User not a member of one of the required teams")
	}

	if !s.IsOrganizationMember(client) {
		return nil, errors.New("User not a member of one of the required organizations")
	}

	s.log.Debug("User info result", zap.Any("result", userInfo))
	return userInfo, nil
}

func (s *SocialGenericOAuth) fillUserInfo(userInfo *BasicUserInfo, data *UserInfoJson) {
	if userInfo.Email == "" {
		userInfo.Email = s.extractEmail(data)
	}
	if userInfo.Role == "" {
		role, err := s.extractRole(data)
		if err != nil {
			s.log.Error("Failed to extract role", zap.Error(err))
		} else {
			userInfo.Role = role
		}
	}
	if userInfo.Name == "" {
		userInfo.Name = s.extractName(data)
	}
	if userInfo.Login == "" {
		userInfo.Login = s.extractLogin(data)
	}
}

func (s *SocialGenericOAuth) extractToken(data *UserInfoJson, token *oauth2.Token) bool {
	var err error

	idToken := token.Extra("id_token")
	if idToken == nil {
		s.log.Debug("No id_token found", zap.Any("token", token))
		return false
	}

	jwtRegexp := regexp.MustCompile("^([-_a-zA-Z0-9=]+)[.]([-_a-zA-Z0-9=]+)[.]([-_a-zA-Z0-9=]+)$")
	matched := jwtRegexp.FindStringSubmatch(idToken.(string))
	if matched == nil {
		s.log.Debug("id_token is not in JWT format", zap.String("id_token", idToken.(string)))
		return false
	}

	data.rawJSON, err = base64.RawURLEncoding.DecodeString(matched[2])
	if err != nil {
		s.log.Error("Error base64 decoding id_token", zap.String("raw_payload", matched[2]), zap.Error(err))
		return false
	}

	err = json.Unmarshal(data.rawJSON, data)
	if err != nil {
		s.log.Error("Error decoding id_token JSON", zap.String("raw_json", string(data.rawJSON)), zap.Error(err))
		data.rawJSON = []byte{}
		return false
	}

	s.log.Debug("Received id_token", zap.Any("raw_json", string(data.rawJSON)), zap.Any("data", data))
	return true
}

func (s *SocialGenericOAuth) extractAPI(data *UserInfoJson, client *http.Client) bool {
	rawUserInfoResponse, err := HttpGet(client, s.apiUrl)
	if err != nil {
		s.log.Debug("Error getting user info response", zap.String("url", s.apiUrl), zap.Error(err))
		return false
	}
	data.rawJSON = rawUserInfoResponse.Body

	err = json.Unmarshal(data.rawJSON, data)
	if err != nil {
		s.log.Error("Error decoding user info response", zap.Any("raw_json", data.rawJSON), zap.Error(err))
		data.rawJSON = []byte{}
		return false
	}

	s.log.Debug("Received user info response", zap.String("raw_json", string(data.rawJSON)), zap.Any("data", data))
	return true
}

func (s *SocialGenericOAuth) extractEmail(data *UserInfoJson) string {
	if data.Email != "" {
		return data.Email
	}

	if s.emailAttributePath != "" {
		email, err := s.searchJSONForAttr(s.emailAttributePath, data.rawJSON)
		if err != nil {
			s.log.Error("Failed to search JSON for attribute", zap.Error(err))
		} else if email != "" {
			return email
		}
	}

	emails, ok := data.Attributes[s.emailAttributeName]
	if ok && len(emails) != 0 {
		return emails[0]
	}

	if data.Upn != "" {
		emailAddr, emailErr := mail.ParseAddress(data.Upn)
		if emailErr == nil {
			return emailAddr.Address
		}
		s.log.Debug("Failed to parse e-mail address", zap.Error(emailErr))
	}

	return ""
}

func (s *SocialGenericOAuth) extractRole(data *UserInfoJson) (string, error) {
	if s.roleAttributePath == "" {
		return "", nil
	}

	role, err := s.searchJSONForAttr(s.roleAttributePath, data.rawJSON)
	if err != nil {
		return "", err
	}
	return role, nil
}

func (s *SocialGenericOAuth) extractLogin(data *UserInfoJson) string {
	if data.Login != "" {
		return data.Login
	}

	if data.Username != "" {
		return data.Username
	}

	return ""
}

func (s *SocialGenericOAuth) extractName(data *UserInfoJson) string {
	if data.Name != "" {
		return data.Name
	}

	if data.DisplayName != "" {
		return data.DisplayName
	}

	return ""
}

func (s *SocialGenericOAuth) FetchPrivateEmail(client *http.Client) (string, error) {
	type Record struct {
		Email       string `json:"email"`
		Primary     bool   `json:"primary"`
		IsPrimary   bool   `json:"is_primary"`
		Verified    bool   `json:"verified"`
		IsConfirmed bool   `json:"is_confirmed"`
	}

	response, err := HttpGet(client, fmt.Sprintf(s.apiUrl+"/emails"))
	if err != nil {
		s.log.Error("Error getting email address", zap.String("url", s.apiUrl+"/emails"), zap.Error(err))
		return "", errutil.Wrap("Error getting email address", err)
	}

	var records []Record

	err = json.Unmarshal(response.Body, &records)
	if err != nil {
		var data struct {
			Values []Record `json:"values"`
		}

		err = json.Unmarshal(response.Body, &data)
		if err != nil {
			s.log.Error("Error decoding email addresses response", zap.String("raw_json", string(response.Body)), zap.Error(err))
			return "", errutil.Wrap("Error decoding email addresses response", err)
		}

		records = data.Values
	}

	s.log.Debug("Received email addresses", zap.Any("emails", records))

	var email = ""
	for _, record := range records {
		if record.Primary || record.IsPrimary {
			email = record.Email
			break
		}
	}

	s.log.Debug("Using email address", zap.String("email", email))

	return email, nil
}

func (s *SocialGenericOAuth) FetchTeamMemberships(client *http.Client) ([]int, bool) {
	type Record struct {
		Id int `json:"id"`
	}

	response, err := HttpGet(client, fmt.Sprintf(s.apiUrl+"/teams"))
	if err != nil {
		s.log.Error("Error getting team memberships", zap.String("url", s.apiUrl+"/teams"), zap.Error(err))
		return nil, false
	}

	var records []Record

	err = json.Unmarshal(response.Body, &records)
	if err != nil {
		s.log.Error("Error decoding team memberships response", zap.String("raw_json", string(response.Body)), zap.Error(err))
		return nil, false
	}

	var ids = make([]int, len(records))
	for i, record := range records {
		ids[i] = record.Id
	}

	s.log.Debug("Received team memberships", zap.Ints("ids", ids))

	return ids, true
}

func (s *SocialGenericOAuth) FetchOrganizations(client *http.Client) ([]string, bool) {
	type Record struct {
		Login string `json:"login"`
	}

	response, err := HttpGet(client, fmt.Sprintf(s.apiUrl+"/orgs"))
	if err != nil {
		s.log.Error("Error getting organizations", zap.String("url", s.apiUrl+"/orgs"), zap.Error(err))
		return nil, false
	}

	var records []Record

	err = json.Unmarshal(response.Body, &records)
	if err != nil {
		s.log.Error("Error decoding organization response", zap.String("response", string(response.Body)), zap.Error(err))
		return nil, false
	}

	var logins = make([]string, len(records))
	for i, record := range records {
		logins[i] = record.Login
	}

	s.log.Debug("Received organizations", zap.Strings("logins", logins))

	return logins, true
}
